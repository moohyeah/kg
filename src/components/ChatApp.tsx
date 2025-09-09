import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Send a message to AI...",
  disabled = false,
  maxLength = 2000
}) => {
  const [message, setMessage] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Maximum height
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage?.(trimmedMessage);
      setMessage('');
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
        {/* Main input area */}
        <div className="flex items-end p-3 gap-3">
          {/* Attachment button */}
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={disabled}
            title="Add attachment"
          >
            <Paperclip size={18} />
          </button>

          {/* Text input area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full resize-none border-0 outline-none text-gray-900 placeholder-gray-500 bg-transparent text-sm leading-6 min-h-[24px] max-h-[200px] py-0 leading-normal"
            />
            
            {/* Character count */}
            {message.length > maxLength * 0.8 && (
              <div className="absolute bottom-0 right-0 text-xs text-gray-400 bg-white px-1">
                {message.length}/{maxLength}
              </div>
            )}
          </div>

          {/* Right button group */}
          <div className="flex items-center gap-1">
            {/* Voice button */}
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              disabled={disabled}
              title="Voice input"
            >
              <Mic size={18} />
            </button>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!canSend}
              className={`p-2 rounded-lg transition-all duration-200 ${
                canSend
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Bottom tip text */}
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-500">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatAppProps {
  title?: string;
  onSendMessage?: (message: string) => Promise<string> | string;
  className?: string;
  placeholder?: string;
  welcomeMessage?: string;
  maxInputLength?: number;
  showTypingIndicator?: boolean;
  customLoadingText?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({
  title = "AI Assistant",
  onSendMessage,
  className = "",
  placeholder = "Send a message to AI...",
  welcomeMessage,
  maxInputLength = 2000,
  showTypingIndicator = true,
  customLoadingText = "AI is thinking..."
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化欢迎消息
  useEffect(() => {
    if (welcomeMessage) {
      setMessages([{
        id: 'welcome',
        content: welcomeMessage,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [welcomeMessage]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response: string;
      
      if (onSendMessage) {
        response = await onSendMessage(message);
      } else {
        // Default simulated response
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = `Received your message: "${message}"`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, an error occurred while processing your message. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && !welcomeMessage && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">👋 Start a conversation!</p>
              <p className="text-sm">Send a message to AI to begin your intelligent conversation experience</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && showTypingIndicator && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 max-w-md p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="text-gray-500 text-sm">{customLoadingText}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={placeholder}
          maxLength={maxInputLength}
        />
      </div>
    </div>
  );
};

// 导出所有组件
export { ChatInput, ChatApp };
export type { ChatInputProps, Message, ChatAppProps };

// 默认导出完整的聊天应用
export default ChatApp;
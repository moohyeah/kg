import React, { useState } from "react";
import ChatApp from "./components/ChatApp";
import WalletConnectButton from "./components/WalletConnectButton";
import KnowledgeGraph, { type GraphData, type GraphNode } from "./components/KnowledgeGraph";
import { message as aoMessage, dryrun, createDataItemSigner } from '@permaweb/aoconnect';
import { useWallet } from "../contexts/WalletContext";

  // Custom AI Knowledge Graph Data
  const aiGraphData: GraphData = {
    nodes: {
    },
    connections: [
    ]
  };

  const handleNodeClick = (nodeId: string, nodeData: GraphNode) => {
    console.log('Node clicked:', nodeId, nodeData);
  };

  const handleNodeHover = (nodeId: string, nodeData: GraphNode) => {
    console.log('Node hovered:', nodeId, nodeData.info.title);
  };



const App: React.FC = () => {
  console.log("App component rendering...");
  const { checkLogin } = useWallet();

  const handleMessage = async (message: string): Promise<string> => {
    if (!checkLogin()) return;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    throw new Error('Network Error');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3)_0%,transparent_50%)] pointer-events-none" />
      
      <WalletConnectButton />
      
      <div className="relative z-10 p-10 max-w-7xl mx-auto">
        <div className="flex flex-row items-start gap-6">
          <div className="w-1/2">
            <ChatApp
              title="AI Assistant"
              onSendMessage={handleMessage}
              welcomeMessage="Hello! I'm an AI assistant. How can I help you today?"
              placeholder="Enter your question..."
              customLoadingText="Searching for you..."
              className="h-[80vh]"
            />
          </div>
          <div className="w-1/2">
            <KnowledgeGraph
              data={aiGraphData}
              title="AI Technology Map"
              subtitle="Artificial Intelligence Technology Stack"
              height="80vh"
              theme="dark"
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
              className="border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
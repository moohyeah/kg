import React, { useState, useRef } from "react";
import ChatApp from "./components/ChatApp";
import type { ChatAppHandle } from "./components/ChatApp";
import WalletConnectButton from "./components/WalletConnectButton";
import KnowledgeGraph, { type GraphData, type GraphNode, type KnowledgeGraphRef } from "./components/KnowledgeGraph";
import { message as aoMessage, dryrun, createDataItemSigner } from '@permaweb/aoconnect';
import { useWallet } from "./contexts/WalletContext";
import { config } from "./config";


const processId = config.aoProcessId;

const App: React.FC = () => {
  const chatRef = useRef<ChatAppHandle>(null);
  const graphRef = useRef<KnowledgeGraphRef>(null);
  const { checkLogin } = useWallet();
  const [graphData, setGraphData] = useState<GraphData>();

  const handleNodeClick = (nodeId: string, nodeData: GraphNode) => {
    chatRef.current?.addAssistantMessage(nodeData.info.desc);
    graphRef.current?.highlightPathByLabel(nodeData?.label);
  };

  const handleNodeHover = (nodeId: string, nodeData: GraphNode) => {
  };

  const handleMessage = async (message: string): Promise<string> => {
    if (!checkLogin()){
      chatRef.current?.addAssistantMessage('Please connect your wallet first.');
      return;
    }
    try {
        const res = await dryrun({
          process: processId,
          tags: [
            { name: 'Action', value: 'Search', },
            { name: 'Query', value: message },
          ],
        });
        console.log(res);
        const raw = res?.Messages?.[0]?.Data;
        // console.log(raw);

        if (raw) {
          const data = JSON.parse(raw)
          setGraphData(data.graph);
          console.log(data?.target_node);
          setTimeout(() => {
            graphRef.current?.highlightPathByLabel(data?.target_node?.label);
          }, 1000);
          return data?.target_node?.info?.desc || '';
        }
      } catch (error) {
        throw new Error('Network Error');
      }
    };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" />
      
      <WalletConnectButton />
      
      <div className="relative z-10 p-10 max-w-7xl mx-auto">
        <div className="flex flex-row items-start gap-6">
          <div className="w-1/3">
            <ChatApp
              title="Ocoagent"
              onSendMessage={handleMessage}
              welcomeMessage="Hello! I'm an Ocoagent. How can I help you today?"
              placeholder="Enter your question..."
              customLoadingText="Searching for you..."
              className="h-[80vh]"
              ref={chatRef}
            />
          </div>
          <div className="w-2/3">
            {graphData && (
              <KnowledgeGraph
                data={graphData}
                ref={graphRef}
                height="80vh"
                theme="dark"
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                className="border rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-1 px-4 text-center max-w-3xl">
        <div className="text-black text-base whitespace-nowrap overflow-x-auto">
          A composable agent system on the A0 network that transforms knowledge graphs into on-chain knowledge service infrastructure — scalable, attributable, and monetizable.
        </div>
        <div className="text-black text-sm leading-relaxed">
          基于 AO 网络的可组合智能体系统，将知识图谱变为可调用、可确权、可变现的链上知识服务基础设施
        </div>
      </div>
    </div>
  );
};

export default App;
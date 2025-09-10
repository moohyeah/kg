import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

// 类型定义
export interface NodeInfo {
  title: string;
  desc: string;
  category?: string;
  icon?: string;
}

export interface GraphNode {
  type: 'core' | 'primary' | 'secondary' | 'tertiary';
  label: string;
  x: number;
  y: number;
  info: NodeInfo;
}

export interface GraphData {
  nodes: Record<string, GraphNode>;
  connections: [string, string][];
  title?: string;
}

export interface KnowledgeGraphProps {
  data: GraphData;
  title?: string;
  // subtitle?: string;
  width?: string | number;
  height?: string | number;
  showControls?: boolean;
  showInfoPanel?: boolean;
  theme?: 'dark' | 'light';
  onNodeClick?: (nodeId: string, nodeData: GraphNode) => void;
  onNodeHover?: (nodeId: string, nodeData: GraphNode) => void;
  className?: string;
}

// ref 方法接口
export interface KnowledgeGraphRef {
  highlightPathByLabel: (label: string) => void;
}

// 预设主题
const themes = {
  dark: {
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    text: 'text-white',
  },
  light: {
    background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: 'text-gray-800',
  }
};

const defaultFrontendData: GraphData = { nodes: {}, connections: [] };

const KnowledgeGraph = forwardRef<KnowledgeGraphRef, KnowledgeGraphProps>(({
  data = defaultFrontendData,
  // title = "Knowledge Graph",
  // subtitle = "Interactive Knowledge Graph",
  width = "100%",
  height = "100vh",
  theme = 'dark',
  onNodeClick,
  onNodeHover,
  className = ""
}, ref) => {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<string[]>([]);
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const [nodes, setNodes] = useState(data.nodes);

  const currentTheme = themes[theme];

  // Node style
  const getNodeStyle = (nodeType: string, isSelected: boolean = false): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      border: isSelected ? '3px solid #4facfe' : '2px solid rgba(255, 255, 255, 0.1)',
      userSelect: 'none',
      // boxShadow: isSelected ? '0 0 30px rgba(79, 172, 254, 0.6)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
      transform: 'translate(-50%, -50%)',
      zIndex: isSelected ? 50 : 10
    };

    const typeStyles = {
      core: { width: '140px', height: '140px', background: '#f9faf6ff', fontSize: '18px' },
      primary: { width: '100px', height: '100px', background: '#f1db10ff', fontSize: '14px' },
      secondary: { width: '80px', height: '80px', background: '#4facfe', fontSize: '12px' },
      tertiary: { width: '70px', height: '70px', background: '#43e97b', fontSize: '11px' }
    };

    return { ...baseStyle, ...typeStyles[nodeType as keyof typeof typeStyles] };
  };

  // Connection style
  const getConnectionStyle = (fromId: string, toId: string): React.CSSProperties => {
    const fromNode = nodes[fromId];
    const toNode = nodes[toId];
    if (!fromNode || !toNode) return {};
    const fromX = fromNode.x;
    const fromY = fromNode.y;
    const toX = toNode.x;
    const toY = toNode.y;
    const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
    const isHighlighted = highlightedConnections.includes(`${fromId}-${toId}`) || highlightedConnections.includes(`${toId}-${fromId}`);
    return {
      position: 'absolute',
      left: `${fromX}%`,
      top: `${fromY}%`,
      width: `${length}%`,
      height: isHighlighted ? '3px' : '2px',
      background: isHighlighted ? 'linear-gradient(90deg, #4facfe, #00f2fe, #4facfe)' : 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(79,172,254,0.4), rgba(255,255,255,0.2))',
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%',
      zIndex: 1,
      boxShadow: isHighlighted ? '0 0 10px #4facfe' : 'none',
      opacity: isHighlighted ? 1 : 0.6,
      transition: 'all 0.3s ease'
    };
  };

  // 查找路径到 core
  const findPathToCore = (nodeId: string): string[] => {
    const visited = new Set<string>();
    const path: string[] = [];
    const dfs = (currentId: string): boolean => {
      if (visited.has(currentId)) return false;
      visited.add(currentId);
      const node = nodes[currentId];
      if (!node) return false;
      if (node.type === 'core') {
        path.push(currentId);
        return true;
      }
      const neighbors = data.connections
        .filter(([from, to]) => from === currentId || to === currentId)
        .map(([from, to]) => (from === currentId ? to : from));
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) {
          path.push(currentId);
          return true;
        }
      }
      return false;
    };
    dfs(nodeId);
    return path.reverse();
  };

  // 点击节点
  const handleNodeClick = (nodeId: string, nodeData: GraphNode) => {
    setSelectedNode(nodeData.info);
    setSelectedNodeId(nodeId);
    const path = findPathToCore(nodeId);
    const pathConnections = path.reduce<string[]>((acc, id, idx) => {
      if (idx < path.length - 1) acc.push(`${id}-${path[idx + 1]}`);
      return acc;
    }, []);
    setHighlightedConnections(pathConnections);
    onNodeClick?.(nodeId, nodeData);
  };

  // 悬停节点
  const handleNodeHover = (nodeId: string, nodeData: GraphNode) => {
    const connections = data.connections
      .filter(([from, to]) => from === nodeId || to === nodeId)
      .map(([from, to]) => `${from}-${to}`);
    setHighlightedConnections(connections);
    onNodeHover?.(nodeId, nodeData);
  };

  const resetConnections = () => setHighlightedConnections([]);
  const resetGraph = () => { setSelectedNode(null); setSelectedNodeId(null); resetConnections(); };

  // 外部方法: 根据 label 高亮路径
  useImperativeHandle(ref, () => ({
    highlightPathByLabel: (label: string) => {
      const nodeEntry = Object.entries(nodes).find(([id, node]) => node.label === label);
      if (!nodeEntry) return;
      const [nodeId] = nodeEntry;
      const path = findPathToCore(nodeId);
      const pathConnections = path.reduce<string[]>((acc, id, idx) => {
        if (idx < path.length - 1) acc.push(`${id}-${path[idx + 1]}`);
        return acc;
      }, []);
      setHighlightedConnections(pathConnections);
      setSelectedNodeId(nodeId);
      setSelectedNode(nodes[nodeId].info);
    }
  }));

  return (
    <div className={`relative overflow-hidden`} style={{ width, height }}>
      <div className="absolute inset-0 pointer-events-none" />
      {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 text-center">
        <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2`}>{data.title}</h1>
      </div> */}

      <div className="w-full h-full relative" onMouseLeave={resetConnections}>
        {data.connections.map(([from, to], index) => (
          <div
            key={`${from}-${to}`}
            style={{
              ...getConnectionStyle(from, to),
              animation: animationEnabled ? `pulse 3s ease-in-out infinite ${index * 0.2}s` : 'none'
            }}
          />
        ))}

        {Object.entries(nodes).map(([id, nodeData]) => (
          <div
            key={id}
            style={{
              ...getNodeStyle(nodeData.type, selectedNodeId === id),
              left: `${nodeData.x}%`,
              top: `${nodeData.y}%`,
              animation: animationEnabled ? `float 6s ease-in-out infinite ${Math.random() * 3}s` : 'none'
            }}
            className="hover:scale-110 hover:z-[200] hover:shadow-2xl"
            onClick={() => handleNodeClick(id, nodeData)}
            onMouseEnter={() => handleNodeHover(id, nodeData)}
          >
            {(nodeData.type === 'core' || nodeData.info.icon) ? (
              <>
                {nodeData.info.icon && <span className="mr-2">{nodeData.info.icon}</span>}
                {nodeData.label}
              </>
            ) : (
              nodeData.label
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translateY(-8px) rotate(0.5deg); }
          66% { transform: translate(-50%, -50%) translateY(4px) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  );
});

export { KnowledgeGraph };
export default KnowledgeGraph;

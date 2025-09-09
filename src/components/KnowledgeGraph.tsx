import React, { useState, useRef } from 'react';

// 类型定义
export interface NodeInfo {
  title: string;
  desc: string;
  skills?: string[];
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
}

export interface KnowledgeGraphProps {
  data: GraphData;
  title?: string;
  subtitle?: string;
  width?: string | number;
  height?: string | number;
  showControls?: boolean;
  showInfoPanel?: boolean;
  theme?: 'dark' | 'light';
  onNodeClick?: (nodeId: string, nodeData: GraphNode) => void;
  onNodeHover?: (nodeId: string, nodeData: GraphNode) => void;
  className?: string;
}

// 预设主题配置
const themes = {
  dark: {
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    text: 'text-white',
    panel: 'bg-black/20 backdrop-blur-xl border border-white/10',
    button: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
    accent: 'text-blue-400'
  },
  light: {
    background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: 'text-gray-800',
    panel: 'bg-white/80 backdrop-blur-xl border border-gray/20 shadow-xl',
    button: 'bg-gray/10 backdrop-blur-md border border-gray/30 text-gray-700',
    accent: 'text-indigo-600'
  }
};

// 默认的前端知识图谱数据
const defaultFrontendData: GraphData = {
  nodes: {
    'nextjs': { 
      type: 'core', 
      label: 'Next.js', 
      x: 50, 
      y: 50,
      info: {
        title: 'Next.js',
        desc: 'Production-grade full-stack framework for React, providing server-side rendering, static generation, API routes, and more.',
        skills: ['SSR (Server-side Rendering)', 'SSG (Static Site Generation)', 'API Routes', 'Image Optimization', 'App Router'],
        category: 'Framework'
      }
    },
    'react': { 
      type: 'primary', 
      label: 'React', 
      x: 30, 
      y: 30,
      info: {
        title: 'React',
        desc: 'JavaScript library developed by Facebook for building user interfaces, using a component-based development model.',
        skills: ['JSX Syntax', 'Hooks', 'State Management', 'Lifecycle Methods', 'Virtual DOM'],
        category: 'Library'
      }
    },
    'typescript': { 
      type: 'primary', 
      label: 'TypeScript', 
      x: 70, 
      y: 30,
      info: {
        title: 'TypeScript',
        desc: 'Superset of JavaScript that adds static type checking, improving code quality and development efficiency.',
        skills: ['Static Typing', 'Interface Definitions', 'Generics', 'Decorators', 'Compile-time Checking'],
        category: 'Language'
      }
    },
    'tailwind': { 
      type: 'secondary', 
      label: 'Tailwind', 
      x: 25, 
      y: 70,
      info: {
        title: 'Tailwind CSS',
        desc: 'Utility-first CSS framework that provides numerous atomic classes for quickly building modern interfaces.',
        skills: ['Atomic CSS', 'Responsive Design', 'Dark Mode', 'Custom Themes', 'Component Reuse'],
        category: 'Styling'
      }
    },
    'zustand': { 
      type: 'secondary', 
      label: 'Zustand', 
      x: 75, 
      y: 70,
      info: {
        title: 'Zustand',
        desc: 'Lightweight React state management library with simple API and excellent TypeScript support.',
        skills: ['Lightweight State Management', 'TypeScript Support', 'Middleware', 'Persistence', 'Developer Tools'],
        category: 'State Management'
      }
    }
  },
  connections: [
    ['nextjs', 'react'],
    ['nextjs', 'typescript'],
    ['nextjs', 'tailwind'],
    ['react', 'zustand'],
    ['typescript', 'zustand']
  ]
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  data = defaultFrontendData,
  title = "Knowledge Graph",
  subtitle = "Interactive Knowledge Graph",
  width = "100%",
  height = "100vh",
  showControls = true,
  showInfoPanel = true,
  theme = 'dark',
  onNodeClick,
  onNodeHover,
  className = ""
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<string[]>([]);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [nodes, setNodes] = useState(data.nodes);
  const graphRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes[theme];

  // Node style configuration
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
      boxShadow: isSelected 
        ? '0 0 30px rgba(79, 172, 254, 0.6)' 
        : '0 8px 32px rgba(0, 0, 0, 0.3)',
      transform: 'translate(-50%, -50%)',
      zIndex: isSelected ? 50 : 10
    };

    const typeStyles = {
      core: {
        width: '140px',
        height: '140px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontSize: '18px',
      },
      primary: {
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        fontSize: '14px',
      },
      secondary: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        fontSize: '12px',
      },
      tertiary: {
        width: '70px',
        height: '70px',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        fontSize: '11px',
      }
    };

    return { ...baseStyle, ...typeStyles[nodeType as keyof typeof typeStyles] };
  };

  // Calculate connection line style
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
    
    const isHighlighted = highlightedConnections.includes(`${fromId}-${toId}`);
    
    return {
      position: 'absolute',
      left: `${fromX}%`,
      top: `${fromY}%`,
      width: `${length}%`,
      height: isHighlighted ? '3px' : '2px',
      background: isHighlighted 
        ? 'linear-gradient(90deg, #4facfe, #00f2fe, #4facfe)' 
        : 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(79, 172, 254, 0.4), rgba(255, 255, 255, 0.2))',
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%',
      zIndex: 1,
      boxShadow: isHighlighted ? '0 0 10px #4facfe' : 'none',
      opacity: isHighlighted ? 1 : 0.6,
      transition: 'all 0.3s ease'
    };
  };

  // Handle node click
  const handleNodeClick = (nodeId: string, nodeData: GraphNode) => {
    setSelectedNode(nodeData.info);
    setSelectedNodeId(nodeId);
    onNodeClick?.(nodeId, nodeData);
  };

  // Handle node hover
  const handleNodeHover = (nodeId: string, nodeData: GraphNode) => {
    const connections = data.connections
      .filter(([from, to]) => from === nodeId || to === nodeId)
      .map(([from, to]) => `${from}-${to}`);
    setHighlightedConnections(connections);
    onNodeHover?.(nodeId, nodeData);
  };

  // Reset connection highlights
  const resetConnections = () => {
    setHighlightedConnections([]);
  };

  // Reset graph
  const resetGraph = () => {
    setSelectedNode(null);
    setSelectedNodeId(null);
    resetConnections();
  };

  // Toggle animation
  const toggleAnimation = () => {
    setAnimationEnabled(!animationEnabled);
  };

  // Randomize layout
  const randomizeLayout = () => {
    const newNodes = { ...nodes };
    Object.keys(newNodes).forEach(id => {
      newNodes[id] = {
        ...newNodes[id],
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      };
    });
    setNodes(newNodes);
    resetConnections();
  };

  return (
    <div 
      className={`relative overflow-hidden ${currentTheme.background} ${currentTheme.text} ${className}`}
      style={{ width, height }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      
      {/* Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 text-center">
        <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2`}>
          {title}
        </h1>
        <p className="text-slate-400">{subtitle}</p>
      </div>

      {/* Knowledge Graph Canvas */}
      <div 
        ref={graphRef} 
        className="w-full h-full relative"
        onMouseLeave={resetConnections}
      >
        {/* Render connection lines */}
        {data.connections.map(([from, to], index) => (
          <div
            key={`${from}-${to}`}
            style={{
              ...getConnectionStyle(from, to),
              animation: animationEnabled ? `pulse 3s ease-in-out infinite ${index * 0.2}s` : 'none'
            }}
          />
        ))}

        {/* Render nodes */}
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
            {nodeData.info.icon && (
              <span className="mr-2">{nodeData.info.icon}</span>
            )}
            {nodeData.label}
          </div>
        ))}
      </div>

      {/* CSS animations */}
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
};


export { KnowledgeGraph };
export default KnowledgeGraph;
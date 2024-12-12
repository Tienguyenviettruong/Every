export type NodeStatus = 
  | 'idle' 
  | 'running'
  | 'completed'
  | 'error'
  | 'paused'
  | 'waiting'
  | 'cancelled';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  icon: string;
  type: string;
  color: string;
  status: NodeStatus;
  retryCount?: number;
  maxRetries?: number;
  errorMessage?: string;
  progress?: number;
  executionTime?: number;
  lastExecuted?: Date;
}

export interface WorkflowNode {
  id: string;
  type: string;
  data: NodeData;
  position: Position;
  dependencies?: string[];
  validationRules?: {
    required?: boolean;
    custom?: (node: WorkflowNode) => boolean;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'success' | 'failure' | 'conditional';
  condition?: string;
}

export interface WorkflowHistory {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  nodeExecutions: {
    nodeId: string;
    startTime: Date;
    endTime?: Date;
    status: NodeStatus;
    error?: string;
    retryCount?: number;
  }[];
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  history: WorkflowHistory[];
  isRunning: boolean;
  isPaused: boolean;
  currentHistoryId?: string;
}
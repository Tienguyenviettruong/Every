import { ref } from 'vue';
import type { WorkflowNode, WorkflowEdge, NodeStatus, WorkflowHistory } from '../types/workflow';

export function useWorkflowExecution() {
  const executingNodeId = ref<string | null>(null);
  const isPaused = ref(false);
  const nodeCache = new Map<string, { dependencies: string[], dependents: string[] }>();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateNodeStatus = (nodes: WorkflowNode[], nodeId: string, status: NodeStatus, error?: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.data.status = status;
      if (error) {
        node.data.errorMessage = error;
      }
      console.log(`Node ${nodeId} status updated to: ${status}`); // Log status update
    }
  };

  const executeNode = async (
    node: WorkflowNode, 
    historyEntry: WorkflowHistory,
    retryCount = 0
  ): Promise<boolean> => {
    try {
      console.log(`Executing node: ${node.id}`); // Log node execution start
      console.log(`Node data:`, node.data); // Log node data

      // Cập nhật trạng thái node khi bắt đầu thực thi
      node.data.status = 'running';
      console.log(`Node ${node.id} status set to running`);

      if (isPaused.value) {
        node.data.status = 'paused';
        await new Promise(resolve => {
          const interval = setInterval(() => {
            if (!isPaused.value) {
              clearInterval(interval);
              resolve(true);
            }
          }, 10);
        });
      }

      executingNodeId.value = node.id;
      
      const nodeExecution = {
        nodeId: node.id,
        startTime: new Date(),
        endTime: undefined as Date | undefined,
        status: 'running' as NodeStatus,
        retryCount
      };
      historyEntry.nodeExecutions.push(nodeExecution);

      // Giả lập thời gian xử lý với progress updates
      const totalSteps = 100;
      for (let step = 0; step < totalSteps; step++) {
        if (isPaused.value) {
          await new Promise(resolve => setTimeout(resolve, 10));
          step--;
          continue;
        }
        
        await sleep(20);
        node.data.progress = ((step + 1) / totalSteps) * 100;
        console.log(`Node ${node.id} progress: ${node.data.progress}%`); // Log progress
        
        // Giả lập xác suất lỗi 0.002%
        if (Math.random() < 0.00002) {
          console.error(`Node ${node.id} failed at step ${step + 1}`); // Log failure step
          throw new Error('Node execution failed at step ' + (step + 1));
        }
      }

      // Cập nhật trạng thái node khi hoàn thành
      node.data.status = 'completed';
      node.data.progress = 100;
      node.data.lastExecuted = new Date();
      nodeExecution.endTime = new Date();
      nodeExecution.status = 'completed';
      console.log(`Node ${node.id} execution completed successfully`); // Log completion
      return true;
    } catch (error) {
      console.error(`Error executing node ${node.id}:`, error);
      
      const maxRetries = node.data.maxRetries || 3;
      if (retryCount < maxRetries) {
        console.log(`Retrying node ${node.id}, attempt ${retryCount + 1}/${maxRetries}`);
        node.data.retryCount = retryCount + 1;
        await sleep(1000 * (retryCount + 1)); // Exponential backoff
        return executeNode(node, historyEntry, retryCount + 1);
      }

      node.data.status = 'error';
      if (error instanceof Error) {
        node.data.errorMessage = error.message;
      }
      const nodeExecution = historyEntry.nodeExecutions.find(ne => ne.nodeId === node.id);
      if (nodeExecution) {
        nodeExecution.endTime = new Date();
        nodeExecution.status = 'error';
        nodeExecution.error = error instanceof Error ? error.message : String(error);
      }
      console.log(`Node ${node.id} execution failed after ${retryCount + 1} attempts`); // Log failure
      return false;
    } finally {
      executingNodeId.value = null;
    }
  };

  const buildNodeGraph = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    nodeCache.clear();
    
    // Initialize cache entries
    for (const node of nodes) {
      nodeCache.set(node.id, { dependencies: [], dependents: [] });
    }

    // Build dependency graph
    for (const edge of edges) {
      const sourceCache = nodeCache.get(edge.source);
      const targetCache = nodeCache.get(edge.target);
      
      if (sourceCache && targetCache) {
        sourceCache.dependents.push(edge.target);
        targetCache.dependencies.push(edge.source);
      }
    }
  };

  const findStartNodes = (nodes: WorkflowNode[]): WorkflowNode[] => {
    return nodes.filter(node => {
      const cache = nodeCache.get(node.id);
      return cache && cache.dependencies.length === 0;
    });
  };

  const findReadyNodes = (nodes: WorkflowNode[], completedNodeIds: Set<string>): WorkflowNode[] => {
    return nodes.filter(node => {
      const cache = nodeCache.get(node.id);
      if (!cache) return false;
      
      return !completedNodeIds.has(node.id) && 
             cache.dependencies.every(depId => completedNodeIds.has(depId));
    });
  };

  const pauseWorkflow = () => {
    isPaused.value = true;
  };

  const resumeWorkflow = () => {
    isPaused.value = false;
  };

  const executeWorkflow = async (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    buildNodeGraph(nodes, edges);
    const completedNodeIds = new Set<string>();
    const failedNodeIds = new Set<string>();

    // Reset all nodes
    nodes.forEach(node => {
      node.data.status = 'idle';
      node.data.progress = 0;
      node.data.retryCount = 0;
      node.data.errorMessage = undefined;
    });

    try {
      const startNodes = findStartNodes(nodes);
      
      // Execute start nodes in parallel
      await Promise.all(startNodes.map(async node => {
        const success = await executeNode(node, { id: '', startTime: new Date(), status: 'running', nodeExecutions: [] });
        if (success) {
          completedNodeIds.add(node.id);
        } else {
          failedNodeIds.add(node.id);
        }
      }));

      // Continue with remaining nodes
      while (completedNodeIds.size + failedNodeIds.size < nodes.length) {
        const readyNodes = findReadyNodes(nodes, completedNodeIds);
        if (readyNodes.length === 0) break;

        // Execute ready nodes in parallel
        await Promise.all(readyNodes.map(async node => {
          const success = await executeNode(node, { id: '', startTime: new Date(), status: 'running', nodeExecutions: [] });
          if (success) {
            completedNodeIds.add(node.id);
          } else {
            failedNodeIds.add(node.id);
          }
        }));
      }

      if (failedNodeIds.size > 0) {
        throw new Error(`Workflow execution failed. Failed nodes: ${Array.from(failedNodeIds).join(', ')}`);
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  };

  return {
    executeWorkflow,
    executingNodeId,
    pauseWorkflow,
    resumeWorkflow
  };
}
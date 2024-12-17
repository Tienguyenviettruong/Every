import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkflowNode, WorkflowEdge, WorkflowState, WorkflowHistory } from '../types/workflow'
import { useWorkflowExecution } from '../composables/useWorkflowExecution'

interface HistoryStep {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export const useWorkflowStore = defineStore('workflow', () => {
  const state = ref<WorkflowState>({
    nodes: [],
    edges: [],
    history: [],
    isRunning: false,
    isPaused: false
  })
  
  const undoStack = ref<HistoryStep[]>([])
  const redoStack = ref<HistoryStep[]>([])
  
  const { executeWorkflow, pauseWorkflow, resumeWorkflow } = useWorkflowExecution()

  // Getters
  const hasUnsavedChanges = computed(() => undoStack.value.length > 0)
  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  // History management
  const saveToHistory = () => {
    undoStack.value.push({
      nodes: JSON.parse(JSON.stringify(state.value.nodes)),
      edges: JSON.parse(JSON.stringify(state.value.edges))
    })
    redoStack.value = []
  }

  const undo = () => {
    if (!canUndo.value) return
    const previous = undoStack.value.pop()!
    redoStack.value.push({
      nodes: JSON.parse(JSON.stringify(state.value.nodes)),
      edges: JSON.parse(JSON.stringify(state.value.edges))
    })
    state.value.nodes = previous.nodes
    state.value.edges = previous.edges
  }

  const redo = () => {
    if (!canRedo.value) return
    const next = redoStack.value.pop()!
    undoStack.value.push({
      nodes: JSON.parse(JSON.stringify(state.value.nodes)),
      edges: JSON.parse(JSON.stringify(state.value.edges))
    })
    state.value.nodes = next.nodes
    state.value.edges = next.edges
  }

  // Node and Edge management
  const addNode = (node: WorkflowNode) => {
    saveToHistory()
    state.value.nodes.push(node)
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    saveToHistory()
    const nodeIndex = state.value.nodes.findIndex(n => n.id === nodeId)
    if (nodeIndex !== -1) {
      // Create a new node object with all existing properties and updates
      state.value.nodes[nodeIndex] = {
        ...state.value.nodes[nodeIndex],
        ...updates,
        // Ensure data property is properly merged
        data: {
          ...state.value.nodes[nodeIndex].data,
          ...(updates.data || {}),
          // Preserve the config object if it exists in updates
          config: {
            ...(state.value.nodes[nodeIndex].data?.config || {}),
            ...(updates.data?.config || {})
          }
        }
      }
    }
  }

  const removeNode = (nodeId: string) => {
    if (!nodeId) return;
    
    console.log('Removing node:', nodeId); // Debug log
    
    // First remove any connected edges
    const edgesToRemove = state.value.edges.filter(
      e => e.source === nodeId || e.target === nodeId
    );
    
    if (edgesToRemove.length > 0) {
      console.log('Removing connected edges:', edgesToRemove);
    }
    
    // Save current state to history before making changes
    saveToHistory();
    
    // Remove the node and its connected edges
    state.value.nodes = state.value.nodes.filter(n => n.id !== nodeId);
    state.value.edges = state.value.edges.filter(
      e => e.source !== nodeId && e.target !== nodeId
    );
    
    console.log('Remaining nodes:', state.value.nodes.length);
    console.log('Remaining edges:', state.value.edges.length);
  }

  const addEdge = (edge: WorkflowEdge) => {
    saveToHistory()
    state.value.edges.push(edge)
  }

  const removeEdge = (edgeId: string) => {
    saveToHistory()
    state.value.edges = state.value.edges.filter(e => e.id !== edgeId)
  }

  const clearWorkflow = () => {
    saveToHistory()
    state.value.nodes = []
    state.value.edges = []
  }

  // Workflow execution
  const runWorkflow = async () => {
    if (state.value.nodes.length === 0) {
      throw new Error('No nodes to execute')
    }

    try {
      state.value.isRunning = true
      const historyEntry: WorkflowHistory = {
        id: Date.now().toString(),
        startTime: new Date(),
        status: 'running',
        nodeExecutions: []
      }
      state.value.currentHistoryId = historyEntry.id
      state.value.history.push(historyEntry)
      
      await executeWorkflow(state.value.nodes, state.value.edges)
      
      historyEntry.endTime = new Date()
      historyEntry.status = 'completed'
    } catch (error) {
      console.error('Workflow execution failed:', error)
      const historyEntry = state.value.history.find(h => h.id === state.value.currentHistoryId)
      if (historyEntry) {
        historyEntry.status = 'failed'
        historyEntry.endTime = new Date()
      }
      throw error
    } finally {
      state.value.isRunning = false
      state.value.isPaused = false
    }
  }

  const pauseWorkflowExecution = () => {
    if (state.value.isRunning) {
      state.value.isPaused = true
      pauseWorkflow()
    }
  }

  const resumeWorkflowExecution = () => {
    if (state.value.isRunning && state.value.isPaused) {
      state.value.isPaused = false
      resumeWorkflow()
    }
  }

  return {
    state,
    hasUnsavedChanges,
    canUndo,
    canRedo,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    clearWorkflow,
    runWorkflow,
    undo,
    redo,
    pauseWorkflowExecution,
    resumeWorkflowExecution
  }
})
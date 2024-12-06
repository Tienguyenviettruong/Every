import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'

interface WorkflowNode extends Node {
  data: {
    label: string
    icon: string
    type: string
  }
}

export const useWorkflowStore = defineStore('workflow', () => {
  const nodes = ref<WorkflowNode[]>([])
  const edges = ref<Edge[]>([])

  const addNode = (node: WorkflowNode) => {
    nodes.value.push(node)
  }

  const clearWorkflow = () => {
    nodes.value = []
    edges.value = []
  }

  const runWorkflow = async () => {
    // Implement workflow execution logic here
    console.log('Running workflow with nodes:', nodes.value)
    console.log('and edges:', edges.value)
  }

  return {
    nodes,
    edges,
    addNode,
    clearWorkflow,
    runWorkflow
  }
})
import { useVueFlow } from '@vue-flow/core'
import type { XYPosition } from '@vue-flow/core'

export function useWorkflowNodes(getId: () => string) {
  const { addNodes, project } = useVueFlow()

  const addNewNode = (nodeData: any, position: XYPosition) => {
    const newNode = {
      id: getId(),
      type: 'custom',
      position: project(position),
      data: { 
        label: nodeData.type,
        icon: nodeData.icon,
        type: nodeData.type.toLowerCase().replace(/\s+/g, '-'),
        color: nodeData.color
      },
    }

    addNodes([newNode])
  }

  return {
    addNewNode
  }
} 
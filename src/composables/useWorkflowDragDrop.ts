import { useVueFlow } from '@vue-flow/core'
import type { XYPosition } from '@vue-flow/core'

export function useWorkflowDragDrop(getId: () => string) {
  const { addNodes, project } = useVueFlow({
    defaults: {
      snapToGrid: true,
      snapGrid: [15, 15],
    }
  })

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    const bounds = (event.target as HTMLDivElement).getBoundingClientRect()
    const position = project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    } as XYPosition)

    try {
      const nodeData = JSON.parse(event.dataTransfer?.getData('application/json') || '{}')
      
      const newNode = {
        id: getId(),
        type: 'custom',
        position,
        data: { 
          label: nodeData.type,
          icon: nodeData.icon,
          type: nodeData.type.toLowerCase().replace(/\s+/g, '-'),
          color: nodeData.color
        },
      }

      addNodes([newNode])
    } catch (error) {
      console.error('Failed to parse node data:', error)
    }
  }

  return {
    onDragOver,
    onDrop
  }
}
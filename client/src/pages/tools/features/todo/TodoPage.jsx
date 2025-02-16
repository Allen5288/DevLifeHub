import React from 'react'
import ToolPageLayout from '../../components/ToolPageLayout'
import TodoApp from '../../components/TodoApp/TodoApp'

function TodoPage() {
  return (
    <ToolPageLayout 
      title="Todo Manager" 
      description="Organize your tasks and projects efficiently"
    >
      <TodoApp />
    </ToolPageLayout>
  )
}

export default TodoPage
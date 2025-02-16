import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ToolPageLayout from '../../components/ToolPageLayout';
import TodoApp from '../../components/TodoApp/TodoApp';
import theme from '../../../../theme/todoTheme';

function TodoPage() {
  return (
    <ThemeProvider theme={theme}>
      <ToolPageLayout 
        title="Todo Manager" 
        description="Organize your tasks and projects efficiently"
      >
        <TodoApp />
      </ToolPageLayout>
    </ThemeProvider>
  );
}

export default TodoPage;
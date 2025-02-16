import { useEffect } from 'react';

export const useTodoShortcuts = ({
  onMoveUp,
  onMoveDown,
  onToggleComplete,
  onDelete,
  isEditing
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't trigger shortcuts when editing text
      if (isEditing || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            event.preventDefault();
            onMoveUp?.();
            break;
          case 'j':
            event.preventDefault();
            onMoveDown?.();
            break;
          case 'x':
            event.preventDefault();
            onToggleComplete?.();
            break;
          case 'd':
            event.preventDefault();
            onDelete?.();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onMoveUp, onMoveDown, onToggleComplete, onDelete, isEditing]);
};
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const useDragAndDrop = () => {
  const handleDragEnd = (
    event: DragEndEvent,
    items: any[],
    setItems: (items: any[]) => void
  ) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      setItems(reorderedItems);
    }
  };

  return { handleDragEnd };
};
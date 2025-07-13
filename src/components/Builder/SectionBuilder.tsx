import React, { useState } from 'react';
import { Section, FieldType } from '../../types/template';
import { useTemplate } from '../../context/TemplateContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { ConfirmModal } from '../UI/Modal';
import { FieldBuilder } from './FieldBuilder';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SectionBuilderProps {
  templateId: string;
  section: Section;
  isActive: boolean;
  onSetActive: (sectionId: string | null) => void;
  onAddField: (fieldType: FieldType) => void;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  templateId,
  section,
  isActive,
  onSetActive,
  onAddField
}) => {
  const { updateSection, deleteSection, reorderFields } = useTemplate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedFields = [...section.fields].sort((a, b) => a.order - b.order);

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== section.title) {
      updateSection(templateId, { ...section, title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(section.title);
    setIsEditing(false);
  };

  const handleDeleteSection = () => {
    deleteSection(templateId, section.id);
    setShowDeleteConfirm(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sortedFields.findIndex((field) => field.id === active.id);
      const newIndex = sortedFields.findIndex((field) => field.id === over.id);

      const reorderedFields = arrayMove(sortedFields, oldIndex, newIndex);
      reorderFields(templateId, section.id, reorderedFields);
    }
  };

  return (
    <>
      <Card 
        className={`transition-all ${isActive ? 'ring-2 ring-blue-500 border-blue-200' : 'hover:shadow-md'}`}
        padding="none"
      >
        {/* Section Header */}
        <div 
          className={`p-4 border-b border-gray-200 cursor-pointer ${isActive ? 'bg-blue-50' : 'bg-gray-50'}`}
          onClick={() => onSetActive(isActive ? null : section.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button className="text-gray-400">
                {isActive ? '📂' : '📁'}
              </button>
              
              {isEditing ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-medium"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button size="sm" onClick={handleSaveTitle}>
                    ✓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {section.fields.length} fields
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Content with Drag & Drop */}
        {isActive && (
          <div className="p-4">
            {section.fields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-gray-500 mb-4">No fields in this section</p>
                <p className="text-sm text-gray-400">
                  Select a field type from the palette on the left to add fields
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Fields (drag to reorder)
                  </h4>
                  <span className="text-xs text-gray-500">
                    🔄 Drag & drop to reorder fields
                  </span>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sortedFields.map(field => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {sortedFields.map((field) => (
                        <FieldBuilder
                          key={field.id}
                          templateId={templateId}
                          sectionId={section.id}
                          field={field}
                          isDraggable={true}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSection}
        title="Delete Section"
        message={`Are you sure you want to delete "${section.title}"? This will also delete all fields in this section.`}
        confirmText="Delete Section"
        variant="danger"
      />
    </>
  );
};
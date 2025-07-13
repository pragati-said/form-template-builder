import React, { useState } from 'react';
import { Field, FieldType } from '../../types/template';
import { useTemplate } from '../../context/TemplateContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { ConfirmModal } from '../UI/Modal';
import { LABEL_STYLES } from '../../utils/constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FieldBuilderProps {
  templateId: string;
  sectionId: string;
  field: Field;
  isDraggable?: boolean;
}

export const FieldBuilder: React.FC<FieldBuilderProps> = ({
  templateId,
  sectionId,
  field,
  isDraggable = false
}) => {
  const { updateField, deleteField } = useTemplate();
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState(field);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editField.label.trim()) {
      updateField(templateId, sectionId, editField);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditField(field);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteField(templateId, sectionId, field.id);
    setShowDeleteConfirm(false);
  };

  const handleFieldChange = (key: keyof Field, value: any) => {
    setEditField(prev => ({ ...prev, [key]: value }));
  };

  const getFieldIcon = (type: FieldType) => {
    const icons = {
      label: '📝',
      text: '📄',
      number: '🔢',
      boolean: '☑️',
      enum: '📋'
    };
    return icons[type] || '❓';
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'label':
        const Tag = field.labelStyle === 'h1' ? 'h1' : field.labelStyle === 'h2' ? 'h2' : 'h3';
        const classes = {
          h1: 'text-2xl font-bold',
          h2: 'text-xl font-semibold',
          h3: 'text-lg font-medium'
        };
        return <Tag className={classes[field.labelStyle || 'h2']}>{field.label}</Tag>;

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              disabled
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
              rows={2}
            />
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              placeholder={field.placeholder}
              disabled
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
            />
          </div>
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input type="checkbox" disabled className="h-3 w-3" />
            <span className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
        );

      case 'enum':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
              <option>Select an option...</option>
              {field.options?.map((option, idx) => (
                <option key={idx}>{option}</option>
              ))}
            </select>
          </div>
        );

      default:
        return <div className="text-gray-500">Unknown field type</div>;
    }
  };

  return (
    <>
      <Card 
        className={`hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg' : ''}`} 
        padding="sm"
        style={style}
        ref={setNodeRef}
      >
        <div className="flex items-start justify-between">
          {/* Drag Handle */}
          {isDraggable && (
            <div 
              className="flex items-center mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
              {...attributes}
              {...listeners}
            >
              <span className="text-sm">⋮⋮</span>
            </div>
          )}

          <div className="flex items-start space-x-3 flex-1">
            <span className="text-lg mt-1">{getFieldIcon(field.type)}</span>
            <div className="flex-1 min-w-0">
              {renderFieldPreview()}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑️
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Edit {getFieldIcon(field.type)} {field.type} Field</h3>
            
            <div className="space-y-4">
              <Input
                label="Field Label"
                value={editField.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                fullWidth
                required
              />

              {editField.type === 'label' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Header Style
                  </label>
                  <select
                    value={editField.labelStyle || 'h2'}
                    onChange={(e) => handleFieldChange('labelStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {LABEL_STYLES.map(style => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(editField.type === 'text' || editField.type === 'number') && (
                <Input
                  label="Placeholder Text"
                  value={editField.placeholder || ''}
                  onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                  placeholder="Enter placeholder text..."
                  fullWidth
                />
              )}

              {editField.type === 'enum' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dropdown Options
                    <span className="text-xs text-gray-500 ml-1">(one per line)</span>
                  </label>
                  <textarea
                    value={editField.options?.join('\n') || ''}
                    onChange={(e) => handleFieldChange('options', e.target.value.split('\n').filter(o => o.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editField.options?.length || 0} options configured
                  </p>
                </div>
              )}

              {editField.type !== 'label' && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editField.required || false}
                    onChange={(e) => handleFieldChange('required', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Required field
                    <span className="text-xs text-gray-500 ml-1">(users must fill this)</span>
                  </span>
                </label>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!editField.label.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Field"
        message={`Are you sure you want to delete "${field.label}"? This action cannot be undone.`}
        confirmText="Delete Field"
        variant="danger"
      />
    </>
  );
};
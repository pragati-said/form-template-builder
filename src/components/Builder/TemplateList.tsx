import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Modal, ConfirmModal } from '../UI/Modal';
import { MAX_TEMPLATES } from '../../utils/constants';

interface TemplateListProps {
  onEditTemplate: (templateId: string) => void;
  onPreviewForm: (templateId: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  onEditTemplate,
  onPreviewForm
}) => {
  const { 
    templates, 
    createTemplate, 
    deleteTemplate,
    getFormSubmissions 
  } = useTemplate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) return;

    setIsCreating(true);
    try {
      const template = createTemplate(newTemplateName.trim(), newTemplateDescription.trim() || undefined);
      setShowCreateModal(false);
      setNewTemplateName('');
      setNewTemplateDescription('');
      onEditTemplate(template.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create template');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    setDeleteTemplateId(null);
  };

  const canCreateTemplate = templates.length < MAX_TEMPLATES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
          <p className="text-gray-600 mt-1">
            Create and manage your form templates ({templates.length}/{MAX_TEMPLATES})
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateTemplate}
        >
          📝 Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first form template
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Template
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const submissionCount = getFormSubmissions(template.id).length;
            const fieldCount = template.sections.reduce((acc, section) => acc + section.fields.length, 0);

            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader
                  title={template.name}
                  subtitle={template.description}
                  action={
                    <button
                      onClick={() => setDeleteTemplateId(template.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      🗑️
                    </button>
                  }
                />

                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{template.sections.length} sections</span>
                    <span>{fieldCount} fields</span>
                    <span>{submissionCount} submissions</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => onEditTemplate(template.id)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => onPreviewForm(template.id)}
                      disabled={fieldCount === 0}
                    >
                      👁️ Preview
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                    {template.updatedAt !== template.createdAt && (
                      <span className="block">
                        Updated: {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Template"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name..."
            required
            fullWidth
            autoFocus
          />
          
          <Input
            label="Description (Optional)"
            value={newTemplateDescription}
            onChange={(e) => setNewTemplateDescription(e.target.value)}
            placeholder="Brief description of this template..."
            fullWidth
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowCreateModal(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              disabled={!newTemplateName.trim() || isCreating}
              loading={isCreating}
            >
              Create Template
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTemplateId !== null}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={() => deleteTemplateId && handleDeleteTemplate(deleteTemplateId)}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
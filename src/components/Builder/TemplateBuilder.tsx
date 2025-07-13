import React, { useState, useEffect } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Modal } from '../UI/Modal';
import { FieldPalette } from './FieldPalette';
import { SectionBuilder } from './SectionBuilder';
import { PreviewPanel } from './PreviewPanel';
import { FieldType } from '../../types/template';
import { DEFAULT_FIELD_PROPS } from '../../utils/constants';

interface TemplateBuilderProps {
  templateId: string;
  onPreview: () => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  templateId,
  onPreview
}) => {
  const { 
    templates, 
    activeTemplate, 
    setActiveTemplate,
    addSection,
    addField 
  } = useTemplate();

  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplate(template);
    }
  }, [templateId, templates, setActiveTemplate]);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    addSection(templateId, newSectionTitle.trim());
    setNewSectionTitle('');
    setShowAddSection(false);
  };

  const handleAddField = (sectionId: string, fieldType: FieldType) => {
    const defaultProps = DEFAULT_FIELD_PROPS[fieldType] || {};
    
    addField(templateId, sectionId, {
      type: fieldType,
      label: `New ${fieldType} field`,
      required: false,
      ...defaultProps
    } as any);
  };

  if (!activeTemplate) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Template not found</div>
      </div>
    );
  }

  const totalFields = activeTemplate.sections.reduce((acc, section) => acc + section.fields.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{activeTemplate.name}</h2>
              </div>
              {activeTemplate.description && (
                <p className="text-gray-600 text-lg ml-13">{activeTemplate.description}</p>
              )}
              <div className="flex items-center space-x-6 mt-3 ml-13">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{activeTemplate.sections.length} sections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{totalFields} fields</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowPreview(true)}
                disabled={totalFields === 0}
                className="px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                👁️ Preview
              </Button>
              <Button 
                onClick={onPreview} 
                disabled={totalFields === 0}
                className="px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                🚀 Test Form
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Field Palette */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Field Elements</h3>
                  <p className="text-sm text-gray-600 mt-1">Drag or click to add</p>
                </div>
                <div className="p-6">
                  <FieldPalette 
                    onAddField={(fieldType: FieldType) => {
                      if (activeSectionId) {
                        handleAddField(activeSectionId, fieldType);
                      } else if (activeTemplate.sections.length > 0) {
                        handleAddField(activeTemplate.sections[0].id, fieldType);
                      } else {
                        alert('Please create a section first');
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Builder Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Template Structure</h3>
                    <p className="text-sm text-gray-600 mt-1">Build your form by adding sections and fields</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddSection(true)}
                    className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm font-medium px-4 py-2"
                  >
                    ➕ Add Section
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {activeTemplate.sections.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                      <div className="text-6xl mb-6">📄</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No sections yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Start building your form by adding a section to organize your fields
                      </p>
                      <Button 
                        onClick={() => setShowAddSection(true)}
                        className="px-8 py-3 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Create Your First Section
                      </Button>
                    </div>
                  ) : (
                    activeTemplate.sections.map((section, index) => (
                      <div key={section.id} className="relative">
                        {index > 0 && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        )}
                        <SectionBuilder
                          templateId={templateId}
                          section={section}
                          isActive={activeSectionId === section.id}
                          onSetActive={setActiveSectionId}
                          onAddField={(fieldType) => handleAddField(section.id, fieldType)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Add Section Modal */}
      <Modal
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
        title="Create New Section"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-600">Add a new section to organize your form fields</p>
          </div>

          <Input
            label="Section Title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="e.g., Personal Information, Contact Details..."
            required
            fullWidth
            autoFocus
            className="text-lg"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowAddSection(false)}
              className="px-6 py-2 font-medium"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSection}
              disabled={!newSectionTitle.trim()}
              className="px-6 py-2 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create Section
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enhanced Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Form Preview"
        size="xl"
      >
        <div className="bg-gray-50 rounded-xl p-6">
          <PreviewPanel template={activeTemplate} />
        </div>
      </Modal>
    </div>
  );
};
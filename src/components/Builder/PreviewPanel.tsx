import React from 'react';
import { Template } from '../../types/template';
import { Card } from '../UI/Card';

interface PreviewPanelProps {
  template: Template;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ template }) => {
  const renderField = (field: any) => {
    if (field.type === 'label') {
      const Tag = field.labelStyle === 'h1' ? 'h1' : field.labelStyle === 'h2' ? 'h2' : 'h3';
      const classes: { [key: string]: string } = {
        h1: 'text-3xl font-bold text-gray-900',
        h2: 'text-2xl font-semibold text-gray-900',
        h3: 'text-xl font-medium text-gray-900'
      };
      
      return (
        <Tag key={field.id} className={classes[field.labelStyle || 'h2']}>
          {field.label}
        </Tag>
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              rows={3}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              placeholder={field.placeholder}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="space-y-1">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        );

      case 'enum':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            >
              <option>Select an option...</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
          {template.description && (
            <p className="text-gray-600 mt-1">{template.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {template.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {section.title}
              </h3>
              
              <div className="space-y-4">
                {section.fields
                  .sort((a, b) => a.order - b.order)
                  .map(renderField)}
              </div>
            </div>
          ))}

          {template.sections.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No sections added yet
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
          <button
            disabled
            className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Submit Form (Preview Mode)
          </button>
        </div>
      </Card>
    </div>
  );
};
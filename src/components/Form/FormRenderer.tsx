import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { validateForm } from '../../utils/validation';

interface FormRendererProps {
  templateId: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ templateId }) => {
  const { templates, submitForm } = useTemplate();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const template = templates.find(t => t.id === templateId);

  if (!template) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Template not found</div>
      </div>
    );
  }

  const allFields = template.sections.flatMap(section => section.fields);
  const formFields = allFields.filter(field => field.type !== 'label');

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formFields, formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[data-field-id="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      submitForm(templateId, formData);
      setIsSubmitted(true);
      setFormData({});
      setErrors({});
    } catch (error) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-1" data-field-id={field.id}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
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
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="space-y-1">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                required={field.required}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
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
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option...</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Card className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Submitted Successfully!</h3>
          <p className="text-gray-500 mb-6">
            Thank you for filling out the form. Your response has been recorded.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Fill Out Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader
          title={template.name}
          subtitle={template.description}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {template.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {section.title}
              </h3>
              
              <div className="space-y-4">
                {section.fields.map(renderField)}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              loading={isSubmitting}
              disabled={formFields.length === 0}
            >
              Submit Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
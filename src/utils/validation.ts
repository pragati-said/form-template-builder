import { Field } from '../types/template';

export const validateField = (field: Field, value: any): string | null => {
  // Required field validation
  if (field.required && (value === undefined || value === null || value === '' || value === false)) {
    return `${field.label} is required`;
  }

  // Skip validation if field is empty and not required
  if (!field.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // Type-specific validation
  switch (field.type) {
    case 'text':
      if (typeof value !== 'string') {
        return `${field.label} must be text`;
      }
      if (value.length > 5000) {
        return `${field.label} must be less than 5000 characters`;
      }
      break;

    case 'number':
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field.label} must be a valid number`;
      }
      if (numValue < -999999999 || numValue > 999999999) {
        return `${field.label} must be between -999,999,999 and 999,999,999`;
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return `${field.label} must be true or false`;
      }
      break;

    case 'enum':
      if (!field.options || field.options.length === 0) {
        return `${field.label} has no available options`;
      }
      if (!field.options.includes(value)) {
        return `${field.label} must be one of: ${field.options.join(', ')}`;
      }
      break;

    case 'label':
      // Labels don't need validation as they're display-only
      break;

    default:
      return `Unknown field type: ${field.type}`;
  }

  return null;
};

export const validateForm = (fields: Field[], formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    if (field.type === 'label') return; // Skip labels
    
    const error = validateField(field, formData[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};

export const validateTemplate = (template: any): string[] => {
  const errors: string[] = [];

  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required');
  }

  if (template.name && template.name.length > 100) {
    errors.push('Template name must be less than 100 characters');
  }

  if (template.sections.length === 0) {
    errors.push('Template must have at least one section');
  }

  const totalFields = template.sections.reduce((acc: number, section: any) => acc + section.fields.length, 0);
  if (totalFields === 0) {
    errors.push('Template must have at least one field');
  }

  template.sections.forEach((section: any, sectionIndex: number) => {
    if (!section.title || section.title.trim().length === 0) {
      errors.push(`Section ${sectionIndex + 1} must have a title`);
    }

    section.fields.forEach((field: any, fieldIndex: number) => {
      if (!field.label || field.label.trim().length === 0) {
        errors.push(`Field ${fieldIndex + 1} in section "${section.title}" must have a label`);
      }

      if (field.type === 'enum' && (!field.options || field.options.length === 0)) {
        errors.push(`Dropdown field "${field.label}" must have at least one option`);
      }
    });
  });

  return errors;
};
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
      
      // Smart validation based on field context
      const fieldLower = field.label.toLowerCase();
      
      if (fieldLower.includes('phone') || fieldLower.includes('contact') || fieldLower.includes('mobile')) {
        // Phone number validation - accept 7-15 digits
        const phoneStr = value.toString().replace(/\D/g, ''); // Remove non-digits
        if (phoneStr.length < 7 || phoneStr.length > 15) {
          return `${field.label} must be between 7-15 digits`;
        }
      } else if (fieldLower.includes('age')) {
        // Age validation
        if (numValue < 0 || numValue > 150) {
          return `${field.label} must be between 0 and 150`;
        }
      } else if (fieldLower.includes('year') || fieldLower.includes('experience')) {
        // Experience/year validation
        if (numValue < 0 || numValue > 100) {
          return `${field.label} must be between 0 and 100`;
        }
      } else if (fieldLower.includes('id') || fieldLower.includes('employee')) {
        // ID validation - positive numbers
        if (numValue <= 0) {
          return `${field.label} must be a positive number`;
        }
      } else {
        // General number validation - reasonable range
        if (numValue < -1000000 || numValue > 1000000) {
          return `${field.label} must be between -1,000,000 and 1,000,000`;
        }
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
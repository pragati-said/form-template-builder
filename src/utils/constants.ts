import { FieldConfig } from '../types/template';

export const MAX_TEMPLATES = 5;

export const FIELD_TYPES: FieldConfig[] = [
  {
    type: 'label',
    name: 'Short Answer',
    icon: '📝',
    description: 'H1, H2, H3 based styling'
  },
  {
    type: 'text',
    name: 'Paragraph',
    icon: '📄',
    description: 'Multi-line text input'
  },
  {
    type: 'number',
    name: 'Number',
    icon: '🔢',
    description: 'Numeric input field'
  },
  {
    type: 'boolean',
    name: 'Yes/No',
    icon: '☑️',
    description: 'Checkbox or toggle'
  },
  {
    type: 'enum',
    name: 'Dropdown',
    icon: '📋',
    description: 'Predefined options'
  }
];

export const LABEL_STYLES = [
  { value: 'h1', label: 'H1 - Large Header' },
  { value: 'h2', label: 'H2 - Medium Header' },
  { value: 'h3', label: 'H3 - Small Header' }
];

export const LOCAL_STORAGE_KEYS = {
  TEMPLATES: 'form-builder-templates',
  FORM_DATA: 'form-builder-submissions'
};

export const DEFAULT_FIELD_PROPS = {
  label: { labelStyle: 'h2' as const },
  text: { placeholder: 'Enter your answer...' },
  number: { placeholder: 'Enter a number...' },
  boolean: { label: 'Yes/No' },
  enum: { options: ['Option 1', 'Option 2', 'Option 3'] }
};
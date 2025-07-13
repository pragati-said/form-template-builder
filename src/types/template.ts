export type FieldType = 'label' | 'text' | 'number' | 'boolean' | 'enum';

export type LabelStyle = 'h1' | 'h2' | 'h3';

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for enum fields
  labelStyle?: LabelStyle; // for label fields
  order: number;
}

export interface Section {
  id: string;
  title: string;
  fields: Field[];
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  id: string;
  templateId: string;
  data: Record<string, any>;
  submittedAt: Date;
}

export interface FormField {
  field: Field;
  value: any;
  error?: string;
}

// Drag and drop types
export interface DragEndEvent {
  active: {
    id: string;
  };
  over: {
    id: string;
  } | null;
}

// Field configuration types
export interface FieldConfig {
  type: FieldType;
  name: string;
  icon: string;
  description: string;
}
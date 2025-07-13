import { validateField, validateForm } from '../validation';
import { Field } from '../../types/template';

describe('Validation Utils', () => {
  describe('validateField', () => {
    test('validates required text field', () => {
      const field: Field = {
        id: '1',
        type: 'text',
        label: 'Name',
        required: true,
        order: 0
      };

      expect(validateField(field, '')).toBe('Name is required');
      expect(validateField(field, 'John Doe')).toBeNull();
    });

    test('validates non-required text field', () => {
      const field: Field = {
        id: '1',
        type: 'text',
        label: 'Comments',
        required: false,
        order: 0
      };

      expect(validateField(field, '')).toBeNull();
      expect(validateField(field, 'Some comments')).toBeNull();
    });

    test('validates number field', () => {
      const field: Field = {
        id: '1',
        type: 'number',
        label: 'Age',
        required: true,
        order: 0
      };

      expect(validateField(field, '')).toBe('Age is required');
      expect(validateField(field, 'not a number')).toBe('Age must be a valid number');
      expect(validateField(field, '25')).toBeNull();
      expect(validateField(field, 25)).toBeNull();
    });

    test('validates boolean field', () => {
      const field: Field = {
        id: '1',
        type: 'boolean',
        label: 'Agree to terms',
        required: true,
        order: 0
      };

      expect(validateField(field, false)).toBe('Agree to terms is required');
      expect(validateField(field, true)).toBeNull();
    });

    test('validates enum field', () => {
      const field: Field = {
        id: '1',
        type: 'enum',
        label: 'Country',
        required: true,
        options: ['USA', 'Canada', 'UK'],
        order: 0
      };

      expect(validateField(field, '')).toBe('Country is required');
      expect(validateField(field, 'Invalid')).toBe('Country must be one of: USA, Canada, UK');
      expect(validateField(field, 'USA')).toBeNull();
    });

    test('skips validation for label fields', () => {
      const field: Field = {
        id: '1',
        type: 'label',
        label: 'Section Header',
        order: 0
      };

      expect(validateField(field, '')).toBeNull();
      expect(validateField(field, 'anything')).toBeNull();
    });
  });

  describe('validateForm', () => {
    test('validates multiple fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'text',
          label: 'Name',
          required: true,
          order: 0
        },
        {
          id: '2',
          type: 'number',
          label: 'Age',
          required: true,
          order: 1
        },
        {
          id: '3',
          type: 'label',
          label: 'Header',
          order: 2
        }
      ];

      const formData = {
        '1': '',
        '2': 'not a number'
      };

      const errors = validateForm(fields, formData);
      
      expect(errors['1']).toBe('Name is required');
      expect(errors['2']).toBe('Age must be a valid number');
      expect(errors['3']).toBeUndefined(); // Label fields are skipped
    });

    test('returns empty object for valid form', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'text',
          label: 'Name',
          required: true,
          order: 0
        },
        {
          id: '2',
          type: 'number',
          label: 'Age',
          required: true,
          order: 1
        }
      ];

      const formData = {
        '1': 'John Doe',
        '2': '25'
      };

      const errors = validateForm(fields, formData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});
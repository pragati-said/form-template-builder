import React from 'react';
import { Card } from '../UI/Card';
import { FIELD_TYPES } from '../../utils/constants';
import { FieldType } from '../../types/template';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Field</h3>
      <div className="space-y-2">
        {FIELD_TYPES.map((fieldType) => (
          <button
            key={fieldType.type}
            onClick={() => onAddField(fieldType.type)}
            className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{fieldType.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{fieldType.name}</div>
                <div className="text-sm text-gray-500">{fieldType.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
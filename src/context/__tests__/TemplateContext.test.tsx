import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateProvider, useTemplate } from '../TemplateContext';

// Simple test component to test context
const TestComponent = () => {
  const { templates, createTemplate } = useTemplate();
  
  return (
    <div>
      <div data-testid="template-count">{templates.length}</div>
      <button 
        onClick={() => createTemplate('Test Template')}
        data-testid="create-button"
      >
        Create Template
      </button>
    </div>
  );
};

describe('TemplateContext', () => {
  test('provides template context', () => {
    render(
      <TemplateProvider>
        <TestComponent />
      </TemplateProvider>
    );
    
    expect(screen.getByTestId('template-count')).toHaveTextContent('0');
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });
  
  test('context throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTemplate must be used within a TemplateProvider');
    
    console.error = originalError;
  });
});
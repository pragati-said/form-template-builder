import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders form template builder', () => {
  render(<App />);
  const titleElement = screen.getByText(/Form Template Builder/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders create template button', () => {
  render(<App />);
  const createButton = screen.getByText(/Create Template/i);
  expect(createButton).toBeInTheDocument();
});

test('shows empty state when no templates', () => {
  render(<App />);
  const emptyStateText = screen.getByText(/No templates yet/i);
  expect(emptyStateText).toBeInTheDocument();
});
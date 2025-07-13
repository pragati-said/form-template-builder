# 📝 Form Template Builder

A modern, intuitive form template builder that allows users to create custom forms with drag-and-drop functionality, real-time preview, and dynamic form generation. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏗️ **Template Builder**
- **Create Templates**: Up to 5 custom form templates
- **Section Management**: Organize fields into logical sections
- **5 Field Types**: 
  - 📝 Label (H1, H2, H3 styling options)
  - 📄 Text (Multi-line textarea)
  - 🔢 Number (Numeric input with validation)
  - ☑️ Boolean (Checkbox input)
  - 📋 Enum (Dropdown with custom options)
- **Drag & Drop**: Reorder fields within sections
- **Real-time Preview**: See your form as you build it
- **Field Configuration**: Custom labels, placeholders, required validation
- **Auto-save**: All changes saved to localStorage automatically

### 📋 **Form Rendering**
- **Dynamic Generation**: Forms generated from template schemas
- **Type Validation**: Field-specific validation rules
- **Required Field Validation**: Ensure critical data is collected
- **Form Submission**: Store responses in localStorage
- **Success Feedback**: Clear confirmation after submission
- **Responsive Design**: Works on desktop and mobile

### 💾 **Data Management**
- **localStorage Persistence**: All data saved locally
- **Template Versioning**: Track creation and update timestamps
- **Submission Tracking**: View form submission counts
- **Data Export**: Access data through browser DevTools

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Context API with custom hooks
- **Styling**: Tailwind CSS with custom design system
- **Drag & Drop**: @dnd-kit library
- **Storage**: Browser localStorage API
- **Build Tool**: Create React App
- **Type Safety**: Full TypeScript implementation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/pragati-said/form-template-builder.git
   cd form-template-builder
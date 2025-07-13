import React, { useState } from 'react';
import { TemplateProvider } from './context/TemplateContext';
import { TemplateList } from './components/Builder/TemplateList';
import { TemplateBuilder } from './components/Builder/TemplateBuilder';
import { FormRenderer } from './components/Form/FormRenderer';
import { Button } from './components/UI/Button';

type AppView = 'templates' | 'builder' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('templates');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleViewTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentView('builder');
  };

  const handlePreviewForm = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentView('form');
  };

  const handleBack = () => {
    setCurrentView('templates');
    setSelectedTemplateId(null);
  };

  return (
    <TemplateProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50 opacity-50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo/Title */}
              <div className="flex items-center">
                {currentView !== 'templates' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBack}
                    className="mr-4 hover:bg-white/50 border border-gray-200 shadow-sm"
                  >
                    ← Back
                  </Button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Form Template Builder
                  </h1>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {currentView === 'builder' && selectedTemplateId && (
                  <Button 
                    variant="secondary"
                    onClick={() => handlePreviewForm(selectedTemplateId)}
                    className="font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    👁️ Preview Form
                  </Button>
                )}
                
                {currentView === 'form' && selectedTemplateId && (
                  <Button 
                    variant="secondary"
                    onClick={() => handleViewTemplate(selectedTemplateId)}
                    className="font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    ✏️ Edit Template
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={currentView === 'templates' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
          {currentView === 'templates' && (
            <TemplateList 
              onEditTemplate={handleViewTemplate}
              onPreviewForm={handlePreviewForm}
            />
          )}
          
          {currentView === 'builder' && selectedTemplateId && (
            <TemplateBuilder 
              templateId={selectedTemplateId}
              onPreview={() => handlePreviewForm(selectedTemplateId)}
            />
          )}
          
          {currentView === 'form' && selectedTemplateId && (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FormRenderer templateId={selectedTemplateId} />
              </div>
            </div>
          )}
        </main>
      </div>
    </TemplateProvider>
  );
}

export default App;
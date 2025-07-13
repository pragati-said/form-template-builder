import React, { createContext, useContext, useState } from 'react';
import { Template, Section, Field, FormData } from '../types/template';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS, MAX_TEMPLATES } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

interface TemplateContextType {
  // Templates
  templates: Template[];
  activeTemplate: Template | null;
  setActiveTemplate: (template: Template | null) => void;
  createTemplate: (name: string, description?: string) => Template;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  
  // Sections
  addSection: (templateId: string, title: string) => void;
  updateSection: (templateId: string, section: Section) => void;
  deleteSection: (templateId: string, sectionId: string) => void;
  reorderSections: (templateId: string, sections: Section[]) => void;
  
  // Fields
  addField: (templateId: string, sectionId: string, field: Omit<Field, 'id' | 'order'>) => void;
  updateField: (templateId: string, sectionId: string, field: Field) => void;
  deleteField: (templateId: string, sectionId: string, fieldId: string) => void;
  reorderFields: (templateId: string, sectionId: string, fields: Field[]) => void;
  
  // Form Data
  formSubmissions: FormData[];
  submitForm: (templateId: string, data: Record<string, any>) => void;
  getFormSubmissions: (templateId?: string) => FormData[];
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useLocalStorage<Template[]>(LOCAL_STORAGE_KEYS.TEMPLATES, []);
  const [formSubmissions, setFormSubmissions] = useLocalStorage<FormData[]>(LOCAL_STORAGE_KEYS.FORM_DATA, []);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  const createTemplate = (name: string, description?: string): Template => {
    if (templates.length >= MAX_TEMPLATES) {
      throw new Error(`Maximum ${MAX_TEMPLATES} templates allowed`);
    }

    const newTemplate: Template = {
      id: uuidv4(),
      name,
      description,
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (updatedTemplate: Template) => {
    const updated = {
      ...updatedTemplate,
      updatedAt: new Date()
    };
    
    setTemplates(prev => 
      prev.map(template => 
        template.id === updated.id ? updated : template
      )
    );

    if (activeTemplate?.id === updated.id) {
      setActiveTemplate(updated);
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    if (activeTemplate?.id === id) {
      setActiveTemplate(null);
    }
  };

  const addSection = (templateId: string, title: string) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const newSection: Section = {
            id: uuidv4(),
            title,
            fields: [],
            order: template.sections.length
          };
          
          const updated = {
            ...template,
            sections: [...template.sections, newSection],
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const updateSection = (templateId: string, updatedSection: Section) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.map(section => 
              section.id === updatedSection.id ? updatedSection : section
            ),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const deleteSection = (templateId: string, sectionId: string) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.filter(section => section.id !== sectionId),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const reorderSections = (templateId: string, sections: Section[]) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: sections.map((section, index) => ({ ...section, order: index })),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const addField = (templateId: string, sectionId: string, fieldData: Omit<Field, 'id' | 'order'>) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.map(section => {
              if (section.id === sectionId) {
                const newField: Field = {
                  ...fieldData,
                  id: uuidv4(),
                  order: section.fields.length
                };
                
                return {
                  ...section,
                  fields: [...section.fields, newField]
                };
              }
              return section;
            }),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const updateField = (templateId: string, sectionId: string, updatedField: Field) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  fields: section.fields.map(field => 
                    field.id === updatedField.id ? updatedField : field
                  )
                };
              }
              return section;
            }),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const deleteField = (templateId: string, sectionId: string, fieldId: string) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  fields: section.fields.filter(field => field.id !== fieldId)
                };
              }
              return section;
            }),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const reorderFields = (templateId: string, sectionId: string, fields: Field[]) => {
    setTemplates(prev => 
      prev.map(template => {
        if (template.id === templateId) {
          const updated = {
            ...template,
            sections: template.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  fields: fields.map((field, index) => ({ ...field, order: index }))
                };
              }
              return section;
            }),
            updatedAt: new Date()
          };

          if (activeTemplate?.id === templateId) {
            setActiveTemplate(updated);
          }

          return updated;
        }
        return template;
      })
    );
  };

  const submitForm = (templateId: string, data: Record<string, any>) => {
    const submission: FormData = {
      id: uuidv4(),
      templateId,
      data,
      submittedAt: new Date()
    };

    setFormSubmissions(prev => [...prev, submission]);
  };

  const getFormSubmissions = (templateId?: string): FormData[] => {
    if (templateId) {
      return formSubmissions.filter(submission => submission.templateId === templateId);
    }
    return formSubmissions;
  };

  const value: TemplateContextType = {
    templates,
    activeTemplate,
    setActiveTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addField,
    updateField,
    deleteField,
    reorderFields,
    formSubmissions,
    submitForm,
    getFormSubmissions
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
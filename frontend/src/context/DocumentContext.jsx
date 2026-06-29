import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { documentService } from '../api/documentService';
import { useAuth } from './AuthContext';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchDocuments = useCallback(async () => {
    try {
      const data = isAuthenticated ? await documentService.getMine() : await documentService.getAll();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Upload a file — requires file object, title, description
  const addDocument = useCallback(async (file, title, description, visibility = 'public') => {
    try {
      const savedDoc = await documentService.upload(file, title, description, visibility);
      setDocuments(prev => [savedDoc, ...prev]);
      return savedDoc;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }, []);

  const deleteDocument = useCallback(async (id) => {
    try {
      await documentService.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id.toString() !== id.toString()));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }, []);

  const getDocumentById = useCallback((id) => {
    return documents.find(doc => doc.id.toString() === id.toString());
  }, [documents]);

  return (
    <DocumentContext.Provider value={{ documents, loading, addDocument, deleteDocument, getDocumentById, refreshDocuments: fetchDocuments }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext);

import { create } from 'zustand';
import type { EmployeeDocument, DocumentCategory, DocumentSummary } from '../types';

interface DocumentsState {
  documents: EmployeeDocument[];
  categories: DocumentCategory[];
  loading: boolean;
  error: string | null;
  uploadDocument: (document: Omit<EmployeeDocument, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  approveDocument: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  addCategory: (category: Omit<DocumentCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<DocumentCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getDocumentSummaries: () => DocumentSummary[];
  getEmployeeDocuments: (employeeId: string) => EmployeeDocument[];
}

// Mock data
const mockCategories: DocumentCategory[] = [
  {
    id: '1',
    name: 'Educational Documents',
    description: 'Certificates, degrees, and academic records',
    required: true,
    allowedFileTypes: ['.pdf', '.jpg', '.png'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    expiryRequired: false,
    documentNumberRequired: true,
    issuedByRequired: true,
    issuedDateRequired: true,
    active: true,
  },
  {
    id: '2',
    name: 'Professional Documents',
    description: 'Work experience certificates, licenses, and certifications',
    required: true,
    allowedFileTypes: ['.pdf', '.jpg', '.png'],
    maxFileSize: 5 * 1024 * 1024,
    expiryRequired: true,
    documentNumberRequired: true,
    issuedByRequired: true,
    issuedDateRequired: true,
    active: true,
  },
  {
    id: '3',
    name: 'Identity Documents',
    description: 'Government issued IDs, passports, and other identity proofs',
    required: true,
    allowedFileTypes: ['.pdf', '.jpg', '.png'],
    maxFileSize: 5 * 1024 * 1024,
    expiryRequired: true,
    documentNumberRequired: true,
    issuedByRequired: true,
    issuedDateRequired: true,
    active: true,
  },
];

const mockDocuments: EmployeeDocument[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    category: 'education',
    title: 'Bachelor\'s Degree',
    description: 'Computer Science degree from XYZ University',
    fileUrl: 'https://example.com/documents/degree.pdf',
    fileType: 'application/pdf',
    fileSize: 2 * 1024 * 1024,
    uploadedBy: 'John Doe',
    status: 'approved',
    issuedDate: '2020-05-15',
    issuedBy: 'XYZ University',
    documentNumber: 'CS2020-123',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    category: 'identity',
    title: 'Passport',
    description: 'Current passport',
    fileUrl: 'https://example.com/documents/passport.pdf',
    fileType: 'application/pdf',
    fileSize: 1.5 * 1024 * 1024,
    uploadedBy: 'John Doe',
    status: 'approved',
    issuedDate: '2022-01-10',
    expiryDate: '2032-01-09',
    issuedBy: 'Government',
    documentNumber: 'P1234567',
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
  },
];

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: mockDocuments,
  categories: mockCategories,
  loading: false,
  error: null,

  uploadDocument: async (document) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDocument: EmployeeDocument = {
        ...document,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        documents: [newDocument, ...state.documents],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to upload document', loading: false });
    }
  },

  approveDocument: async (id, approved, managerComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id
            ? {
                ...doc,
                status: approved ? 'approved' : 'rejected',
                managerComments: managerComments || doc.managerComments,
                updatedAt: new Date().toISOString(),
              }
            : doc
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update document status', loading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete document', loading: false });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCategory: DocumentCategory = {
        ...category,
        id: Date.now().toString(),
      };

      set(state => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add category', loading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        categories: state.categories.map(cat =>
          cat.id === id
            ? { ...cat, ...category }
            : cat
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update category', loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete category', loading: false });
    }
  },

  getDocumentSummaries: () => {
    const documents = get().documents;
    const summaries: DocumentSummary[] = [];
    const employeeMap = new Map<string, DocumentSummary>();

    documents.forEach(doc => {
      const existing = employeeMap.get(doc.employeeId);
      if (existing) {
        employeeMap.set(doc.employeeId, {
          ...existing,
          totalDocuments: existing.totalDocuments + 1,
          pendingDocuments: existing.pendingDocuments + (doc.status === 'pending' ? 1 : 0),
          expiringSoonDocuments: existing.expiringSoonDocuments + (
            doc.expiryDate && 
            new Date(doc.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 ? 1 : 0
          ),
          documentsByCategory: {
            ...existing.documentsByCategory,
            [doc.category]: (existing.documentsByCategory[doc.category] || 0) + 1,
          },
          recentDocuments: [...existing.recentDocuments, doc]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
        });
      } else {
        employeeMap.set(doc.employeeId, {
          employeeId: doc.employeeId,
          employeeName: doc.employeeName,
          department: doc.department,
          totalDocuments: 1,
          pendingDocuments: doc.status === 'pending' ? 1 : 0,
          expiringSoonDocuments: doc.expiryDate && 
            new Date(doc.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 ? 1 : 0,
          documentsByCategory: {
            [doc.category]: 1,
          },
          recentDocuments: [doc],
        });
      }
    });

    return Array.from(employeeMap.values());
  },

  getEmployeeDocuments: (employeeId: string) => {
    return get().documents
      .filter(doc => doc.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
}));
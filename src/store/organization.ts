import { create } from 'zustand';
import type { Organization } from '../types';

interface OrganizationState {
  currentOrganization: Organization | null;
  userRole: 'owner' | 'admin' | 'hr_manager' | 'employee' | null;
  loading: boolean;
  error: string | null;
  fetchOrganization: () => Promise<void>;
}

// Mock organization data
const mockOrganization = {
  id: '1',
  name: 'Demo Organization',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useOrganizationStore = create<OrganizationState>((set) => ({
  currentOrganization: null,
  userRole: 'admin',
  loading: false,
  error: null,
  fetchOrganization: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({
        currentOrganization: mockOrganization,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch organization',
        loading: false,
      });
    }
  },
}));
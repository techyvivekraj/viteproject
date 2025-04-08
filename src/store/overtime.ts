import { create } from 'zustand';
import type { OvertimeRequest } from '../types';

interface OvertimeState {
  requests: OvertimeRequest[];
  loading: boolean;
  error: string | null;
  requestOvertime: (request: Omit<OvertimeRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  approveOvertime: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  cancelOvertime: (id: string) => Promise<void>;
}

// Mock data
const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2024-03-20',
    startTime: '18:00',
    endTime: '21:00',
    hours: 3,
    reason: 'Critical system deployment',
    status: 'pending',
    createdAt: '2024-03-19T10:00:00Z',
    updatedAt: '2024-03-19T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    date: '2024-03-19',
    startTime: '18:00',
    endTime: '20:00',
    hours: 2,
    reason: 'Client presentation preparation',
    status: 'approved',
    managerComments: 'Approved due to project deadline',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-18T15:00:00Z',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T15:00:00Z',
  },
];

export const useOvertimeStore = create<OvertimeState>((set) => ({
  requests: mockOvertimeRequests,
  loading: false,
  error: null,

  requestOvertime: async (request) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRequest: OvertimeRequest = {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        requests: [newRequest, ...state.requests],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to submit overtime request', loading: false });
    }
  },

  approveOvertime: async (id, approved, managerComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        requests: state.requests.map(request =>
          request.id === id
            ? {
                ...request,
                status: approved ? 'approved' : 'rejected',
                managerComments: managerComments || request.managerComments,
                approvedBy: 'Mike Manager', // This would come from the logged-in user
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : request
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update overtime request', loading: false });
    }
  },

  cancelOvertime: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        requests: state.requests.filter(request => request.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel overtime request', loading: false });
    }
  },
}));
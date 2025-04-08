import { create } from 'zustand';
import type { Fine, EmployeeFinesSummary } from '../types';

interface FinesState {
  fines: Fine[];
  loading: boolean;
  error: string | null;
  addFine: (fine: Omit<Fine, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  approveFine: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  cancelFine: (id: string) => Promise<void>;
  getEmployeeFinesSummaries: () => EmployeeFinesSummary[];
  getEmployeeFineHistory: (employeeId: string) => Fine[];
}

// Mock data
const mockFines: Fine[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    amount: 50,
    reason: 'Late arrival - 3 instances',
    date: '2024-03-20',
    deductionDate: '2024-04-01',
    status: 'approved',
    managerComments: 'Multiple instances of late arrival',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-20T15:00:00Z',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T15:00:00Z',
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    amount: 30,
    reason: 'Dress code violation',
    date: '2024-03-15',
    deductionDate: '2024-04-01',
    status: 'approved',
    managerComments: 'Not following company dress code',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-15T15:00:00Z',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T15:00:00Z',
  },
  {
    id: '3',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    amount: 25,
    reason: 'Missing team meeting',
    date: '2024-03-18',
    deductionDate: '2024-04-01',
    status: 'pending',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
];

export const useFinesStore = create<FinesState>((set, get) => ({
  fines: mockFines,
  loading: false,
  error: null,

  addFine: async (fine) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newFine: Fine = {
        ...fine,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        fines: [newFine, ...state.fines],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add fine', loading: false });
    }
  },

  approveFine: async (id, approved, managerComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        fines: state.fines.map(fine =>
          fine.id === id
            ? {
                ...fine,
                status: approved ? 'approved' : 'rejected',
                managerComments: managerComments || fine.managerComments,
                approvedBy: 'Mike Manager', // This would come from the logged-in user
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : fine
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update fine', loading: false });
    }
  },

  cancelFine: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        fines: state.fines.filter(fine => fine.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel fine', loading: false });
    }
  },

  getEmployeeFinesSummaries: () => {
    const fines = get().fines;
    const employeeMap = new Map<string, EmployeeFinesSummary>();

    fines.forEach(fine => {
      if (fine.status === 'approved' || fine.status === 'deducted') {
        const existing = employeeMap.get(fine.employeeId);
        if (existing) {
          employeeMap.set(fine.employeeId, {
            ...existing,
            totalFines: existing.totalFines + fine.amount,
            totalDeducted: existing.totalDeducted + (fine.status === 'deducted' ? fine.amount : 0),
            pendingAmount: existing.pendingAmount + (fine.status === 'approved' ? fine.amount : 0),
            nextDeductionDate: fine.deductionDate,
            nextDeductionAmount: existing.nextDeductionAmount + (fine.status === 'approved' ? fine.amount : 0),
            activeFines: existing.activeFines + (fine.status === 'approved' ? 1 : 0),
          });
        } else {
          employeeMap.set(fine.employeeId, {
            employeeId: fine.employeeId,
            employeeName: fine.employeeName,
            department: fine.department,
            totalFines: fine.amount,
            totalDeducted: fine.status === 'deducted' ? fine.amount : 0,
            pendingAmount: fine.status === 'approved' ? fine.amount : 0,
            nextDeductionDate: fine.deductionDate,
            nextDeductionAmount: fine.status === 'approved' ? fine.amount : 0,
            activeFines: fine.status === 'approved' ? 1 : 0,
          });
        }
      }
    });

    return Array.from(employeeMap.values());
  },

  getEmployeeFineHistory: (employeeId: string) => {
    return get().fines
      .filter(fine => fine.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
}));
import { create } from 'zustand';
import type { Remark, EmployeeRemarkSummary } from '../types';

interface RemarkState {
  remarks: Remark[];
  loading: boolean;
  error: string | null;
  addRemark: (remark: Omit<Remark, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  acknowledgeRemark: (id: string, comments?: string) => Promise<void>;
  deleteRemark: (id: string) => Promise<void>;
  getEmployeeRemarkSummaries: () => EmployeeRemarkSummary[];
  getEmployeeRemarks: (employeeId: string) => Remark[];
}

// Mock data
const mockRemarks: Remark[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    type: 'appreciation',
    title: 'Outstanding Project Delivery',
    description: 'Successfully delivered the client project ahead of schedule with excellent quality.',
    date: '2024-03-20',
    createdBy: 'Mike Manager',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    acknowledgement: {
      acknowledged: true,
      acknowledgedAt: '2024-03-20T11:00:00Z',
      comments: 'Thank you for the recognition!',
    },
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    type: 'warning',
    title: 'Late Arrivals',
    description: 'Multiple instances of late arrival in the past week.',
    date: '2024-03-15',
    createdBy: 'Mike Manager',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    acknowledgement: {
      acknowledged: true,
      acknowledgedAt: '2024-03-15T14:00:00Z',
      comments: 'I understand and will improve my punctuality.',
    },
  },
  {
    id: '3',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    type: 'improvement',
    title: 'Design Process Enhancement',
    description: 'Suggested improvements to streamline the design review process.',
    date: '2024-03-18',
    createdBy: 'Mike Manager',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
];

export const useRemarkStore = create<RemarkState>((set, get) => ({
  remarks: mockRemarks,
  loading: false,
  error: null,

  addRemark: async (remark) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRemark: Remark = {
        ...remark,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        remarks: [newRemark, ...state.remarks],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add remark', loading: false });
    }
  },

  acknowledgeRemark: async (id, comments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        remarks: state.remarks.map(remark =>
          remark.id === id
            ? {
                ...remark,
                acknowledgement: {
                  acknowledged: true,
                  acknowledgedAt: new Date().toISOString(),
                  comments,
                },
                updatedAt: new Date().toISOString(),
              }
            : remark
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to acknowledge remark', loading: false });
    }
  },

  deleteRemark: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        remarks: state.remarks.filter(remark => remark.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete remark', loading: false });
    }
  },

  getEmployeeRemarkSummaries: () => {
    const remarks = get().remarks;
    const employeeMap = new Map<string, EmployeeRemarkSummary>();

    remarks.forEach(remark => {
      const existing = employeeMap.get(remark.employeeId);
      if (existing) {
        employeeMap.set(remark.employeeId, {
          ...existing,
          totalRemarks: existing.totalRemarks + 1,
          appreciations: existing.appreciations + (remark.type === 'appreciation' ? 1 : 0),
          warnings: existing.warnings + (remark.type === 'warning' ? 1 : 0),
          improvements: existing.improvements + (remark.type === 'improvement' ? 1 : 0),
          general: existing.general + (remark.type === 'general' ? 1 : 0),
          latestRemark: new Date(remark.date) > new Date(existing.latestRemark.date)
            ? { type: remark.type, date: remark.date }
            : existing.latestRemark,
        });
      } else {
        employeeMap.set(remark.employeeId, {
          employeeId: remark.employeeId,
          employeeName: remark.employeeName,
          department: remark.department,
          totalRemarks: 1,
          appreciations: remark.type === 'appreciation' ? 1 : 0,
          warnings: remark.type === 'warning' ? 1 : 0,
          improvements: remark.type === 'improvement' ? 1 : 0,
          general: remark.type === 'general' ? 1 : 0,
          latestRemark: {
            type: remark.type,
            date: remark.date,
          },
        });
      }
    });

    return Array.from(employeeMap.values());
  },

  getEmployeeRemarks: (employeeId: string) => {
    return get().remarks
      .filter(remark => remark.employeeId === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
}));
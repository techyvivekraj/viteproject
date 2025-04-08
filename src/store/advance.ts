import { create } from 'zustand';
import type { AdvanceRequest, EmployeeLoanSummary } from '../types';

interface AdvanceState {
  requests: AdvanceRequest[];
  loading: boolean;
  error: string | null;
  requestAdvance: (request: Omit<AdvanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'repaymentStatus'>) => Promise<void>;
  approveAdvance: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  cancelAdvance: (id: string) => Promise<void>;
  getEmployeeLoanSummaries: () => EmployeeLoanSummary[];
  getEmployeeAdvanceHistory: (employeeId: string) => AdvanceRequest[];
}

// Mock data
const mockAdvanceRequests: AdvanceRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    amount: 5000,
    reason: 'Medical emergency',
    repaymentMonths: 5,
    monthlyDeduction: 1000,
    status: 'approved',
    managerComments: 'Approved for medical emergency',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-02-18T15:00:00Z',
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2024-02-18T15:00:00Z',
    repaymentStatus: {
      totalPaid: 2000,
      remainingAmount: 3000,
      nextPaymentDate: '2024-04-01',
      paymentHistory: [
        {
          date: '2024-03-01',
          amount: 1000,
          type: 'deduction',
          reference: 'SAL-MAR-2024',
        },
        {
          date: '2024-02-01',
          amount: 1000,
          type: 'deduction',
          reference: 'SAL-FEB-2024',
        },
      ],
    },
  },
  {
    id: '2',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    amount: 3000,
    reason: 'Education fees',
    repaymentMonths: 3,
    monthlyDeduction: 1000,
    status: 'approved',
    managerComments: 'Approved for education',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-01-15T15:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T15:00:00Z',
    repaymentStatus: {
      totalPaid: 2000,
      remainingAmount: 1000,
      nextPaymentDate: '2024-04-01',
      paymentHistory: [
        {
          date: '2024-03-01',
          amount: 1000,
          type: 'deduction',
          reference: 'SAL-MAR-2024',
        },
        {
          date: '2024-02-01',
          amount: 1000,
          type: 'deduction',
          reference: 'SAL-FEB-2024',
        },
      ],
    },
  },
  {
    id: '3',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    amount: 3000,
    reason: 'House rent deposit',
    repaymentMonths: 3,
    monthlyDeduction: 1000,
    status: 'approved',
    managerComments: 'Approved based on good performance record',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-18T15:00:00Z',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T15:00:00Z',
    repaymentStatus: {
      totalPaid: 1000,
      remainingAmount: 2000,
      nextPaymentDate: '2024-04-01',
      paymentHistory: [
        {
          date: '2024-03-01',
          amount: 1000,
          type: 'deduction',
          reference: 'SAL-MAR-2024',
        },
      ],
    },
  },
];

export const useAdvanceStore = create<AdvanceState>((set, get) => ({
  requests: mockAdvanceRequests,
  loading: false,
  error: null,

  requestAdvance: async (request) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRequest: AdvanceRequest = {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        repaymentStatus: {
          totalPaid: 0,
          remainingAmount: request.amount,
          nextPaymentDate: '',
          paymentHistory: [],
        },
      };

      set(state => ({
        requests: [newRequest, ...state.requests],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to submit advance request', loading: false });
    }
  },

  approveAdvance: async (id, approved, managerComments) => {
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
                repaymentStatus: approved ? {
                  totalPaid: 0,
                  remainingAmount: request.amount,
                  nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  paymentHistory: [],
                } : request.repaymentStatus,
              }
            : request
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update advance request', loading: false });
    }
  },

  cancelAdvance: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        requests: state.requests.filter(request => request.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel advance request', loading: false });
    }
  },

  getEmployeeLoanSummaries: () => {
    const requests = get().requests;
    const employeeMap = new Map<string, EmployeeLoanSummary>();

    requests.forEach(request => {
      if (request.status === 'approved') {
        const existing = employeeMap.get(request.employeeId);
        if (existing) {
          employeeMap.set(request.employeeId, {
            ...existing,
            totalLoanAmount: existing.totalLoanAmount + request.amount,
            totalPaidAmount: existing.totalPaidAmount + request.repaymentStatus.totalPaid,
            remainingAmount: existing.remainingAmount + request.repaymentStatus.remainingAmount,
            activeLoans: existing.activeLoans + (request.repaymentStatus.remainingAmount > 0 ? 1 : 0),
            nextPaymentDate: request.repaymentStatus.nextPaymentDate,
            nextPaymentAmount: existing.nextPaymentAmount + request.monthlyDeduction,
          });
        } else {
          employeeMap.set(request.employeeId, {
            employeeId: request.employeeId,
            employeeName: request.employeeName,
            department: request.department,
            totalLoanAmount: request.amount,
            totalPaidAmount: request.repaymentStatus.totalPaid,
            remainingAmount: request.repaymentStatus.remainingAmount,
            activeLoans: request.repaymentStatus.remainingAmount > 0 ? 1 : 0,
            nextPaymentDate: request.repaymentStatus.nextPaymentDate,
            nextPaymentAmount: request.monthlyDeduction,
          });
        }
      }
    });

    return Array.from(employeeMap.values());
  },

  getEmployeeAdvanceHistory: (employeeId: string) => {
    return get().requests.filter(request => 
      request.employeeId === employeeId && request.status === 'approved'
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
}));
import { create } from 'zustand';
import type { LeaveRequest, LeaveBalance, LeaveSummary } from '../types';

interface LeaveState {
  requests: LeaveRequest[];
  balances: LeaveBalance[];
  loading: boolean;
  error: string | null;
  requestLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  approveLeave: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  cancelLeave: (id: string) => Promise<void>;
  getLeaveSummaries: () => LeaveSummary[];
  getEmployeeLeaveHistory: (employeeId: string) => LeaveRequest[];
  getEmployeeLeaveBalance: (employeeId: string) => LeaveBalance | null;
}

// Mock data
const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: '101',
    annual: {
      total: 20,
      used: 5,
      remaining: 15,
    },
    sick: {
      total: 12,
      used: 2,
      remaining: 10,
    },
    unpaid: {
      used: 0,
    },
    maternity: {
      total: 180,
      used: 0,
      remaining: 180,
    },
    paternity: {
      total: 14,
      used: 0,
      remaining: 14,
    },
    bereavement: {
      total: 5,
      used: 0,
      remaining: 5,
    },
  },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    type: 'annual',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-20T10:00:00Z',
    createdAt: '2024-03-19T15:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    type: 'sick',
    startDate: '2024-03-25',
    endDate: '2024-03-26',
    days: 2,
    reason: 'Not feeling well',
    status: 'pending',
    createdAt: '2024-03-24T14:00:00Z',
    updatedAt: '2024-03-24T14:00:00Z',
  },
];

export const useLeaveStore = create<LeaveState>((set, get) => ({
  requests: mockLeaveRequests,
  balances: mockLeaveBalances,
  loading: false,
  error: null,

  requestLeave: async (request) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRequest: LeaveRequest = {
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
      set({ error: 'Failed to submit leave request', loading: false });
    }
  },

  approveLeave: async (id, approved, managerComments) => {
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

      // Update leave balance if approved
      if (approved) {
        const request = get().requests.find(r => r.id === id);
        if (request) {
          set(state => ({
            balances: state.balances.map(balance =>
              balance.employeeId === request.employeeId
                ? {
                    ...balance,
                    [request.type]: {
                      ...balance[request.type],
                      used: balance[request.type].used + request.days,
                      remaining: balance[request.type].remaining - request.days,
                    },
                  }
                : balance
            ),
          }));
        }
      }
    } catch (error) {
      set({ error: 'Failed to update leave request', loading: false });
    }
  },

  cancelLeave: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const request = get().requests.find(r => r.id === id);
      if (request && request.status === 'approved') {
        // Restore leave balance
        set(state => ({
          balances: state.balances.map(balance =>
            balance.employeeId === request.employeeId
              ? {
                  ...balance,
                  [request.type]: {
                    ...balance[request.type],
                    used: balance[request.type].used - request.days,
                    remaining: balance[request.type].remaining + request.days,
                  },
                }
              : balance
          ),
        }));
      }

      set(state => ({
        requests: state.requests.filter(request => request.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel leave request', loading: false });
    }
  },

  getLeaveSummaries: () => {
    const requests = get().requests;
    const balances = get().balances;
    const summaries: LeaveSummary[] = [];

    balances.forEach(balance => {
      const employeeRequests = requests.filter(r => r.employeeId === balance.employeeId);
      const employee = employeeRequests[0]; // Get employee details from any request

      if (employee) {
        summaries.push({
          employeeId: balance.employeeId,
          employeeName: employee.employeeName,
          department: employee.department,
          balance,
          pendingRequests: employeeRequests.filter(r => r.status === 'pending').length,
          approvedUpcoming: employeeRequests.filter(r => 
            r.status === 'approved' && 
            new Date(r.startDate) > new Date()
          ).length,
          recentRequests: employeeRequests
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
        });
      }
    });

    return summaries;
  },

  getEmployeeLeaveHistory: (employeeId: string) => {
    return get().requests
      .filter(request => request.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getEmployeeLeaveBalance: (employeeId: string) => {
    return get().balances.find(balance => balance.employeeId === employeeId) || null;
  },
}));
import { create } from 'zustand';
import type { Salary, Payslip, PayrollSummary } from '../types';

interface PayrollState {
  salaries: Salary[];
  payslips: Payslip[];
  loading: boolean;
  error: string | null;
  updateSalary: (salary: Omit<Salary, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  generatePayslip: (employeeId: string, month: string, year: string) => Promise<void>;
  approvePayslip: (id: string) => Promise<void>;
  markPayslipAsPaid: (id: string) => Promise<void>;
  getPayrollSummaries: () => PayrollSummary[];
  getEmployeePayslips: (employeeId: string) => Payslip[];
}

// Mock data
const mockSalaries: Salary[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    basic: 5000,
    allowances: {
      hra: 2000,
      medical: 500,
      transport: 300,
      special: 700,
    },
    deductions: {
      pf: 600,
      tax: 800,
      insurance: 200,
    },
    effectiveFrom: '2024-01-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    basic: 4500,
    allowances: {
      hra: 1800,
      medical: 500,
      transport: 300,
      special: 500,
    },
    deductions: {
      pf: 540,
      tax: 700,
      insurance: 200,
    },
    effectiveFrom: '2024-01-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockPayslips: Payslip[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    month: '03',
    year: '2024',
    salary: mockSalaries[0],
    earnings: {
      basic: 5000,
      hra: 2000,
      medical: 500,
      transport: 300,
      special: 700,
      overtime: 300,
      bonus: 0,
      other: 0,
    },
    deductions: {
      pf: 600,
      tax: 800,
      insurance: 200,
      advance: 1000,
      fines: 50,
      other: 0,
    },
    totalEarnings: 8800,
    totalDeductions: 2650,
    netPayable: 6150,
    status: 'paid',
    paidOn: '2024-03-31T00:00:00Z',
    createdAt: '2024-03-25T00:00:00Z',
    updatedAt: '2024-03-31T00:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    month: '03',
    year: '2024',
    salary: mockSalaries[1],
    earnings: {
      basic: 4500,
      hra: 1800,
      medical: 500,
      transport: 300,
      special: 500,
      overtime: 200,
      bonus: 0,
      other: 0,
    },
    deductions: {
      pf: 540,
      tax: 700,
      insurance: 200,
      advance: 0,
      fines: 0,
      other: 0,
    },
    totalEarnings: 7800,
    totalDeductions: 1440,
    netPayable: 6360,
    status: 'paid',
    paidOn: '2024-03-31T00:00:00Z',
    createdAt: '2024-03-25T00:00:00Z',
    updatedAt: '2024-03-31T00:00:00Z',
  },
];

export const usePayrollStore = create<PayrollState>((set, get) => ({
  salaries: mockSalaries,
  payslips: mockPayslips,
  loading: false,
  error: null,

  updateSalary: async (salary) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSalary: Salary = {
        ...salary,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        salaries: [...state.salaries.filter(s => 
          s.employeeId !== salary.employeeId || s.status === 'inactive'
        ), newSalary],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update salary', loading: false });
    }
  },

  generatePayslip: async (employeeId: string, month: string, year: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const salary = get().salaries.find(s => 
        s.employeeId === employeeId && s.status === 'active'
      );

      if (!salary) {
        throw new Error('No active salary found for employee');
      }

      const newPayslip: Payslip = {
        id: Date.now().toString(),
        employeeId,
        employeeName: salary.employeeName,
        department: salary.department,
        month,
        year,
        salary,
        earnings: {
          basic: salary.basic,
          hra: salary.allowances.hra,
          medical: salary.allowances.medical,
          transport: salary.allowances.transport,
          special: salary.allowances.special,
          overtime: 0,
          bonus: 0,
          other: 0,
        },
        deductions: {
          pf: salary.deductions.pf,
          tax: salary.deductions.tax,
          insurance: salary.deductions.insurance,
          advance: 0,
          fines: 0,
          other: 0,
        },
        totalEarnings: salary.basic + 
          Object.values(salary.allowances).reduce((a, b) => a + b, 0),
        totalDeductions: Object.values(salary.deductions).reduce((a, b) => a + b, 0),
        netPayable: salary.basic + 
          Object.values(salary.allowances).reduce((a, b) => a + b, 0) -
          Object.values(salary.deductions).reduce((a, b) => a + b, 0),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        payslips: [newPayslip, ...state.payslips],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to generate payslip', loading: false });
    }
  },

  approvePayslip: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        payslips: state.payslips.map(payslip =>
          payslip.id === id
            ? {
                ...payslip,
                status: 'approved',
                updatedAt: new Date().toISOString(),
              }
            : payslip
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to approve payslip', loading: false });
    }
  },

  markPayslipAsPaid: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        payslips: state.payslips.map(payslip =>
          payslip.id === id
            ? {
                ...payslip,
                status: 'paid',
                paidOn: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : payslip
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to mark payslip as paid', loading: false });
    }
  },

  getPayrollSummaries: () => {
    const salaries = get().salaries;
    const payslips = get().payslips;
    const summaries: PayrollSummary[] = [];

    salaries.forEach(salary => {
      if (salary.status === 'active') {
        const lastPayslip = payslips
          .filter(p => p.employeeId === salary.employeeId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        summaries.push({
          employeeId: salary.employeeId,
          employeeName: salary.employeeName,
          department: salary.department,
          currentSalary: {
            basic: salary.basic,
            totalAllowances: Object.values(salary.allowances).reduce((a, b) => a + b, 0),
            totalDeductions: Object.values(salary.deductions).reduce((a, b) => a + b, 0),
            net: salary.basic + 
              Object.values(salary.allowances).reduce((a, b) => a + b, 0) -
              Object.values(salary.deductions).reduce((a, b) => a + b, 0),
          },
          lastPayslip: lastPayslip ? {
            month: lastPayslip.month,
            year: lastPayslip.year,
            amount: lastPayslip.netPayable,
            status: lastPayslip.status,
          } : undefined,
        });
      }
    });

    return summaries;
  },

  getEmployeePayslips: (employeeId: string) => {
    return get().payslips
      .filter(payslip => payslip.employeeId === employeeId)
      .sort((a, b) => {
        const dateA = new Date(`${a.year}-${a.month}-01`);
        const dateB = new Date(`${b.year}-${b.month}-01`);
        return dateB.getTime() - dateA.getTime();
      });
  },
}));
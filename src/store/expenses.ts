import { create } from 'zustand';
import type { Expense, ExpenseCategory, ExpenseSummary } from '../types';

interface ExpensesState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  approveExpense: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  markAsReimbursed: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<ExpenseCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<ExpenseCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getExpenseSummaries: () => ExpenseSummary[];
  getEmployeeExpenses: (employeeId: string) => Expense[];
}

// Mock data
const mockCategories: ExpenseCategory[] = [
  {
    id: '1',
    name: 'Travel',
    description: 'Travel related expenses including transportation and accommodation',
    budgetLimit: 5000,
    requiresApproval: true,
    allowedFor: 'all',
    active: true,
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Stationery and other office supplies',
    budgetLimit: 1000,
    requiresApproval: false,
    allowedFor: 'all',
    active: true,
  },
  {
    id: '3',
    name: 'Training',
    description: 'Professional development and training courses',
    budgetLimit: 2000,
    requiresApproval: true,
    allowedFor: 'all',
    active: true,
  },
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    category: 'Travel',
    amount: 450,
    date: '2024-03-20',
    description: 'Client meeting travel expenses',
    status: 'approved',
    approvedBy: 'Mike Manager',
    approvedAt: '2024-03-21T10:00:00Z',
    createdAt: '2024-03-20T15:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    category: 'Office Supplies',
    amount: 150,
    date: '2024-03-19',
    description: 'Design software subscription',
    status: 'pending',
    createdAt: '2024-03-19T14:00:00Z',
    updatedAt: '2024-03-19T14:00:00Z',
  },
];

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: mockExpenses,
  categories: mockCategories,
  loading: false,
  error: null,

  addExpense: async (expense) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        expenses: [newExpense, ...state.expenses],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add expense', loading: false });
    }
  },

  approveExpense: async (id, approved, managerComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        expenses: state.expenses.map(expense =>
          expense.id === id
            ? {
                ...expense,
                status: approved ? 'approved' : 'rejected',
                managerComments: managerComments || expense.managerComments,
                approvedBy: 'Mike Manager', // This would come from the logged-in user
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : expense
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update expense', loading: false });
    }
  },

  markAsReimbursed: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        expenses: state.expenses.map(expense =>
          expense.id === id
            ? {
                ...expense,
                status: 'reimbursed',
                reimbursedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : expense
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to mark expense as reimbursed', loading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        expenses: state.expenses.filter(expense => expense.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete expense', loading: false });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCategory: ExpenseCategory = {
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

  getExpenseSummaries: () => {
    const expenses = get().expenses;
    const employeeMap = new Map<string, ExpenseSummary>();

    expenses.forEach(expense => {
      const existing = employeeMap.get(expense.employeeId);
      if (existing) {
        employeeMap.set(expense.employeeId, {
          ...existing,
          totalExpenses: existing.totalExpenses + expense.amount,
          totalReimbursed: existing.totalReimbursed + (expense.status === 'reimbursed' ? expense.amount : 0),
          pendingAmount: existing.pendingAmount + (expense.status === 'approved' ? expense.amount : 0),
          monthlyExpenses: updateMonthlyExpenses(existing.monthlyExpenses, expense),
          recentExpenses: [...existing.recentExpenses, expense]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        });
      } else {
        employeeMap.set(expense.employeeId, {
          employeeId: expense.employeeId,
          employeeName: expense.employeeName,
          department: expense.department,
          totalExpenses: expense.amount,
          totalReimbursed: expense.status === 'reimbursed' ? expense.amount : 0,
          pendingAmount: expense.status === 'approved' ? expense.amount : 0,
          monthlyExpenses: [{
            month: expense.date.split('-')[1],
            year: expense.date.split('-')[0],
            amount: expense.amount,
          }],
          recentExpenses: [expense],
        });
      }
    });

    return Array.from(employeeMap.values());
  },

  getEmployeeExpenses: (employeeId: string) => {
    return get().expenses
      .filter(expense => expense.employeeId === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
}));

function updateMonthlyExpenses(
  existing: { month: string; year: string; amount: number; }[],
  expense: Expense
): { month: string; year: string; amount: number; }[] {
  const [year, month] = expense.date.split('-');
  const existingMonth = existing.find(e => e.month === month && e.year === year);

  if (existingMonth) {
    return existing.map(e =>
      e.month === month && e.year === year
        ? { ...e, amount: e.amount + expense.amount }
        : e
    );
  }

  return [...existing, {
    month,
    year,
    amount: expense.amount,
  }].sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-01`);
    const dateB = new Date(`${b.year}-${b.month}-01`);
    return dateB.getTime() - dateA.getTime();
  });
}
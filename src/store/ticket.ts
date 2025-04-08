import { create } from 'zustand';
import type { Ticket, TicketComment } from '../types';

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  createTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'comments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  addComment: (ticketId: string, comment: Omit<TicketComment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  assignTicket: (ticketId: string, assignedTo: string) => Promise<void>;
  resolveTicket: (ticketId: string) => Promise<void>;
  closeTicket: (ticketId: string) => Promise<void>;
  reopenTicket: (ticketId: string) => Promise<void>;
  getTicketSummary: () => {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
  };
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    title: 'Laptop not working',
    description: 'My laptop keeps crashing when running development tools',
    category: 'it_support',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'IT Support Team',
    comments: [
      {
        id: '1',
        ticketId: '1',
        userId: 'support1',
        userName: 'IT Support',
        content: 'We are looking into this issue. Please provide your laptop details.',
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
      },
    ],
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    title: 'Access to design tools',
    description: 'Need access to the new design software suite',
    category: 'it_support',
    priority: 'medium',
    status: 'open',
    comments: [],
    createdAt: '2024-03-19T14:00:00Z',
    updatedAt: '2024-03-19T14:00:00Z',
  },
];

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: mockTickets,
  loading: false,
  error: null,

  createTicket: async (ticket) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTicket: Ticket = {
        ...ticket,
        id: Date.now().toString(),
        status: 'open',
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        tickets: [newTicket, ...state.tickets],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create ticket', loading: false });
    }
  },

  updateTicket: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === id
            ? {
                ...ticket,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update ticket', loading: false });
    }
  },

  addComment: async (ticketId, comment) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComment: TicketComment = {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                comments: [...ticket.comments, newComment],
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add comment', loading: false });
    }
  },

  assignTicket: async (ticketId, assignedTo) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                assignedTo,
                status: 'in_progress',
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to assign ticket', loading: false });
    }
  },

  resolveTicket: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: 'resolved',
                resolvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to resolve ticket', loading: false });
    }
  },

  closeTicket: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: 'closed',
                closedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to close ticket', loading: false });
    }
  },

  reopenTicket: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: 'open',
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to reopen ticket', loading: false });
    }
  },

  getTicketSummary: () => {
    const tickets = get().tickets;
    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      closedTickets: tickets.filter(t => t.status === 'closed').length,
      ticketsByCategory: tickets.reduce((acc, ticket) => {
        acc[ticket.category] = (acc[ticket.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      ticketsByPriority: tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
}));
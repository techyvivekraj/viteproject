import { create } from 'zustand';
import type { AttendanceRecord, TimesheetEntry } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  timesheets: TimesheetEntry[];
  loading: boolean;
  error: string | null;
  markAttendance: (params: {
    shiftId: string;
    type: 'check-in' | 'check-out';
    location: { lat: number; lng: number };
  }) => Promise<void>;
  submitTimesheet: (timesheet: Omit<TimesheetEntry, 'id' | 'status'>) => Promise<void>;
  approveTimesheet: (id: string, approved: boolean, managerComments?: string) => Promise<void>;
  updateTimesheetComments: (id: string, userComments: string) => Promise<void>;
}

// Mock data
const mockRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: '101',
    date: '2024-03-20',
    shifts: [
      {
        shiftId: '1',
        shiftName: 'Morning Shift',
        checkIn: '09:00 AM',
        checkOut: '06:00 PM',
        status: 'present',
        workHours: '9h',
      },
      {
        shiftId: '2',
        shiftName: 'Evening Shift',
        checkIn: '07:00 PM',
        checkOut: '11:00 PM',
        status: 'present',
        workHours: '4h',
      },
    ],
    department: 'Engineering',
    totalWorkHours: '13h',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: '102',
    date: '2024-03-20',
    shifts: [
      {
        shiftId: '1',
        shiftName: 'Morning Shift',
        checkIn: '09:15 AM',
        checkOut: '05:45 PM',
        status: 'late',
        workHours: '8.5h',
      },
    ],
    department: 'Design',
    totalWorkHours: '8.5h',
  },
];

const mockTimesheets: TimesheetEntry[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2024-03-18',
    day: 'Monday',
    shifts: [
      {
        shiftId: '1',
        shiftName: 'Morning Shift',
        hours: 8,
        tasks: 'Project planning, Team meeting',
      },
      {
        shiftId: '2',
        shiftName: 'Evening Shift',
        hours: 4,
        tasks: 'Client deployment, System monitoring',
      },
    ],
    totalHours: 12,
    userComments: 'Completed sprint planning and handled evening deployment',
    status: 'pending',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    date: '2024-03-18',
    day: 'Monday',
    shifts: [
      {
        shiftId: '1',
        shiftName: 'Morning Shift',
        hours: 7.5,
        tasks: 'UI design, Client presentation',
      },
    ],
    totalHours: 7.5,
    userComments: 'Finished client presentation slides and got feedback',
    status: 'approved',
    managerComments: 'Good work on the client presentation',
  },
];

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: mockRecords,
  timesheets: mockTimesheets,
  loading: false,
  error: null,

  markAttendance: async ({ shiftId, type, location }) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      if (type === 'check-in') {
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          employeeName: 'John Doe', // Mock user
          employeeId: '101',
          date: now.toISOString().split('T')[0],
          shifts: [{
            shiftId,
            shiftName: 'Morning Shift', // This would come from shift data
            checkIn: time,
            checkOut: '-',
            status: now.getHours() >= 9 ? 'late' : 'present',
            workHours: '0h',
          }],
          department: 'Engineering',
          totalWorkHours: '0h',
        };

        set(state => ({
          records: [newRecord, ...state.records],
          loading: false,
        }));
      } else {
        set(state => ({
          records: state.records.map(record => {
            if (record.employeeId === '101') { // Mock user ID
              const updatedShifts = record.shifts.map(shift => 
                shift.shiftId === shiftId && shift.checkOut === '-'
                  ? {
                      ...shift,
                      checkOut: time,
                      workHours: '8h', // Mock calculation
                    }
                  : shift
              );
              
              const totalHours = updatedShifts.reduce(
                (total, shift) => total + parseFloat(shift.workHours) || 0,
                0
              );

              return {
                ...record,
                shifts: updatedShifts,
                totalWorkHours: `${totalHours}h`,
              };
            }
            return record;
          }),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to mark attendance', loading: false });
    }
  },

  submitTimesheet: async (timesheet) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTimesheet: TimesheetEntry = {
        ...timesheet,
        id: Date.now().toString(),
        status: 'pending',
      };

      set(state => ({
        timesheets: [newTimesheet, ...state.timesheets],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to submit timesheet', loading: false });
    }
  },

  approveTimesheet: async (id, approved, managerComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        timesheets: state.timesheets.map(timesheet =>
          timesheet.id === id
            ? {
                ...timesheet,
                status: approved ? 'approved' : 'rejected',
                managerComments: managerComments || timesheet.managerComments,
              }
            : timesheet
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update timesheet', loading: false });
    }
  },

  updateTimesheetComments: async (id, userComments) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        timesheets: state.timesheets.map(timesheet =>
          timesheet.id === id
            ? {
                ...timesheet,
                userComments,
              }
            : timesheet
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update timesheet comments', loading: false });
    }
  },
}));
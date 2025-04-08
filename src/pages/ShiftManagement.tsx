import React, { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  ActionIcon,
  Menu,
  ColorInput,
  Tabs,
  Textarea,
  Select,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Plus,
  Edit,
  Trash,
  MoreVertical,
  Clock,
  Users,
  Calendar,
} from 'lucide-react';
import type { Shift, ShiftAssignment } from '../types';
import { useOrganizationStore } from '../store/organization';

// Mock data for shifts
const mockShifts: Shift[] = [
  {
    id: '1',
    name: 'Morning Shift',
    startTime: '09:00',
    endTime: '17:00',
    color: '#4CAF50',
    description: 'Standard day shift',
  },
  {
    id: '2',
    name: 'Evening Shift',
    startTime: '17:00',
    endTime: '01:00',
    color: '#2196F3',
    description: 'Evening operations',
  },
  {
    id: '3',
    name: 'Night Shift',
    startTime: '00:00',
    endTime: '08:00',
    color: '#9C27B0',
    description: 'Overnight operations',
  },
];

// Mock data for shift assignments
const mockAssignments: ShiftAssignment[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    shiftId: '1',
    shiftName: 'Morning Shift',
    date: '2024-03-20',
    status: 'scheduled',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    shiftId: '2',
    shiftName: 'Evening Shift',
    date: '2024-03-20',
    status: 'completed',
  },
];

// Mock employees for assignment
const mockEmployees = [
  { value: '101', label: 'John Doe' },
  { value: '102', label: 'Jane Smith' },
  { value: '103', label: 'Mike Johnson' },
];

export default function ShiftManagement() {
  const [activeTab, setActiveTab] = useState<string | null>('shifts');
  const [addShiftModal, setAddShiftModal] = useState(false);
  const [assignShiftModal, setAssignShiftModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const userRole = useOrganizationStore((state) => state.userRole);

  const [shiftForm, setShiftForm] = useState<Partial<Shift>>({
    name: '',
    startTime: '',
    endTime: '',
    color: '#4CAF50',
    description: '',
  });

  const [assignmentForm, setAssignmentForm] = useState({
    employeeId: '',
    shiftId: '',
    date: new Date(),
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddShift = () => {
    console.log('Adding shift:', shiftForm);
    setAddShiftModal(false);
    setShiftForm({
      name: '',
      startTime: '',
      endTime: '',
      color: '#4CAF50',
      description: '',
    });
  };

  const handleAssignShift = () => {
    console.log('Assigning shift:', assignmentForm);
    setAssignShiftModal(false);
    setAssignmentForm({
      employeeId: '',
      shiftId: '',
      date: new Date(),
    });
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShiftForm(shift);
    setAddShiftModal(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    console.log('Deleting shift:', shiftId);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'blue',
      completed: 'green',
      absent: 'red',
    };
    return colors[status] || 'gray';
  };

  // Convert assignments to calendar events
  const calendarEvents = mockAssignments.map(assignment => ({
    id: assignment.id,
    title: `${assignment.employeeName} - ${assignment.shiftName}`,
    start: `${assignment.date}T${mockShifts.find(s => s.id === assignment.shiftId)?.startTime}`,
    end: `${assignment.date}T${mockShifts.find(s => s.id === assignment.shiftId)?.endTime}`,
    backgroundColor: mockShifts.find(s => s.id === assignment.shiftId)?.color,
  }));

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Shift Management</Title>
        {isManager && activeTab === 'shifts' && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => {
              setSelectedShift(null);
              setShiftForm({
                name: '',
                startTime: '',
                endTime: '',
                color: '#4CAF50',
                description: '',
              });
              setAddShiftModal(true);
            }}
          >
            Add Shift
          </Button>
        )}
        {isManager && activeTab === 'roster' && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAssignShiftModal(true)}
          >
            Assign Shift
          </Button>
        )}
      </Group>

      <Paper withBorder p="md" radius="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="shifts"
              leftSection={<Clock size={16} />}
            >
              Shifts
            </Tabs.Tab>
            <Tabs.Tab
              value="roster"
              leftSection={<Users size={16} />}
            >
              Roster
            </Tabs.Tab>
            <Tabs.Tab
              value="calendar"
              leftSection={<Calendar size={16} />}
            >
              Calendar View
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="shifts" pt="md">
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Timing</Table.Th>
                  <Table.Th>Color</Table.Th>
                  <Table.Th>Description</Table.Th>
                  {isManager && <Table.Th>Actions</Table.Th>}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockShifts.map((shift) => (
                  <Table.Tr key={shift.id}>
                    <Table.Td>{shift.name}</Table.Td>
                    <Table.Td>
                      {shift.startTime} - {shift.endTime}
                    </Table.Td>
                    <Table.Td>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: shift.color,
                        }}
                      />
                    </Table.Td>
                    <Table.Td>{shift.description}</Table.Td>
                    {isManager && (
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleEditShift(shift)}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDeleteShift(shift.id)}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="roster" pt="md">
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Employee</Table.Th>
                  <Table.Th>Shift</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockAssignments.map((assignment) => (
                  <Table.Tr key={assignment.id}>
                    <Table.Td>{assignment.employeeName}</Table.Td>
                    <Table.Td>{assignment.shiftName}</Table.Td>
                    <Table.Td>{assignment.date}</Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <MoreVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<Edit size={16} />}>
                            Edit Assignment
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<Trash size={16} />}
                            color="red"
                          >
                            Remove Assignment
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="calendar" pt="md">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={calendarEvents}
              height="700px"
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              allDaySlot={false}
              nowIndicator={true}
              editable={isManager}
              selectable={isManager}
              select={(info) => {
                setSelectedDate(info.start);
                setAssignShiftModal(true);
              }}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Add/Edit Shift Modal */}
      <Modal
        opened={addShiftModal}
        onClose={() => setAddShiftModal(false)}
        title={selectedShift ? 'Edit Shift' : 'Add New Shift'}
      >
        <Stack>
          <TextInput
            label="Shift Name"
            placeholder="Enter shift name"
            value={shiftForm.name}
            onChange={(e) => setShiftForm({ ...shiftForm, name: e.currentTarget.value })}
            required
          />

          <Group grow>
            <TimeInput
              label="Start Time"
              value={shiftForm.startTime}
              onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.currentTarget.value })}
              required
            />
            <TimeInput
              label="End Time"
              value={shiftForm.endTime}
              onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.currentTarget.value })}
              required
            />
          </Group>

          <ColorInput
            label="Shift Color"
            value={shiftForm.color}
            onChange={(color) => setShiftForm({ ...shiftForm, color })}
          />

          <Textarea
            label="Description"
            placeholder="Enter shift description"
            value={shiftForm.description}
            onChange={(e) => setShiftForm({ ...shiftForm, description: e.currentTarget.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddShiftModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShift}>
              {selectedShift ? 'Save Changes' : 'Add Shift'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Assign Shift Modal */}
      <Modal
        opened={assignShiftModal}
        onClose={() => setAssignShiftModal(false)}
        title="Assign Shift"
      >
        <Stack>
          <Select
            label="Employee"
            placeholder="Select employee"
            data={mockEmployees}
            value={assignmentForm.employeeId}
            onChange={(value) => setAssignmentForm({ ...assignmentForm, employeeId: value || '' })}
            required
          />

          <Select
            label="Shift"
            placeholder="Select shift"
            data={mockShifts.map(shift => ({
              value: shift.id,
              label: shift.name,
            }))}
            value={assignmentForm.shiftId}
            onChange={(value) => setAssignmentForm({ ...assignmentForm, shiftId: value || '' })}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAssignShiftModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignShift}>
              Assign Shift
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
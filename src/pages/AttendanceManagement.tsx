import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  Select,
  Textarea,
  ActionIcon,
  Menu,
  Avatar,
  Pagination,
  LoadingOverlay,
  Tabs,
  Alert,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CalendarRange,
  UserPlus,
  ClipboardList,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useOrganizationStore } from '../store/organization';

// Update the mockAttendanceData to include comments
const mockAttendanceData = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  employeeName: `Employee ${index + 1}`,
  employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
  department: ['Engineering', 'Design', 'Marketing', 'HR'][Math.floor(Math.random() * 4)],
  date: '2024-03-20',
  checkIn: '09:00',
  checkOut: '18:00',
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  location: ['Office', 'Remote'][Math.floor(Math.random() * 2)],
  notes: '',
  comments: '', // Add comments field
}));

// Mock data for timesheets
const mockTimesheetData = Array.from({ length: 30 }, (_, index) => ({
  id: `TS${index + 1}`,
  employeeName: `Employee ${index + 1}`,
  employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
  department: ['Engineering', 'Design', 'Marketing', 'HR'][Math.floor(Math.random() * 4)],
  weekStarting: dayjs().startOf('week').subtract(Math.floor(Math.random() * 4), 'week').format('YYYY-MM-DD'),
  totalHours: 40 + Math.floor(Math.random() * 10),
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  submittedDate: dayjs().subtract(Math.floor(Math.random() * 10), 'day').format('YYYY-MM-DD'),
  tasks: [
    'Project planning and coordination',
    'Development and implementation',
    'Client meetings and presentations',
    'Documentation and reporting',
  ][Math.floor(Math.random() * 4)],
  comments: '',
}));

const ITEMS_PER_PAGE = 10;

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status] || 'gray';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle2 size={16} />;
    case 'pending':
      return <Clock size={16} />;
    case 'rejected':
      return <XCircle size={16} />;
    default:
      return null;
  }
};

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState<string | null>('attendance');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timesheetApprovalModal, setTimesheetApprovalModal] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);

  // Add new state for attendance approval
  const [attendanceApprovalModal, setAttendanceApprovalModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [attendanceComment, setAttendanceComment] = useState('');

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: '',
  });

  const [addForm, setAddForm] = useState({
    employeeId: '',
    date: new Date(),
    checkIn: '',
    checkOut: '',
    status: 'pending',
    location: 'Office',
    notes: '',
  });

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setEditForm({
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      notes: record.notes,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    setTimeout(() => {
      notifications.show({
        title: 'Success',
        message: 'Attendance record updated successfully',
        color: 'green',
      });
      setEditModalOpen(false);
      setLoading(false);
    }, 1000);
  };

  const handleAddAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      notifications.show({
        title: 'Success',
        message: 'Attendance record added successfully',
        color: 'green',
      });
      setAddModalOpen(false);
      setAddForm({
        employeeId: '',
        date: new Date(),
        checkIn: '',
        checkOut: '',
        status: 'pending',
        location: 'Office',
        notes: '',
      });
      setLoading(false);
    }, 1000);
  };

  // Update handleApproveAttendance to use the modal
  const handleApproveAttendance = (record: any) => {
    setSelectedAttendance(record);
    setAttendanceComment('');
    setAttendanceApprovalModal(true);
  };

  const handleAttendanceApproval = (approved: boolean) => {
    setLoading(true);
    setTimeout(() => {
      notifications.show({
        title: 'Success',
        message: `Attendance ${approved ? 'approved' : 'rejected'} for ${selectedAttendance.employeeName}`,
        color: approved ? 'green' : 'red',
      });
      setAttendanceApprovalModal(false);
      setSelectedAttendance(null);
      setAttendanceComment('');
      setLoading(false);
    }, 1000);
  };

  const handleTimesheetAction = (timesheet: any, approved: boolean) => {
    setSelectedTimesheet(timesheet);
    setApprovalComment('');
    setTimesheetApprovalModal(true);
  };

  const handleTimesheetApproval = (approved: boolean) => {
    setLoading(true);
    setTimeout(() => {
      notifications.show({
        title: 'Success',
        message: `Timesheet ${approved ? 'approved' : 'rejected'} for ${selectedTimesheet.employeeName}`,
        color: approved ? 'green' : 'red',
      });
      setTimesheetApprovalModal(false);
      setSelectedTimesheet(null);
      setApprovalComment('');
      setLoading(false);
    }, 1000);
  };

  const filteredRecords = mockAttendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !departmentFilter || record.department === departmentFilter;
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const filteredTimesheets = mockTimesheetData.filter(timesheet => {
    const matchesSearch = timesheet.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timesheet.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !departmentFilter || timesheet.department === departmentFilter;
    const matchesStatus = !statusFilter || timesheet.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(
    (activeTab === 'attendance' ? filteredRecords : filteredTimesheets).length / ITEMS_PER_PAGE
  );

  const renderAttendanceTab = () => (
    <Stack gap="md">
      <Group grow>
        <DatePickerInput
          label="Select Date"
          placeholder="Pick date"
          value={selectedDate}
          onChange={setSelectedDate}
          leftSection={<CalendarRange size={16} />}
        />
        <TextInput
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<Search size={16} />}
        />
        <Select
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          data={['Engineering', 'Design', 'Marketing', 'HR']}
          leftSection={<Filter size={16} />}
          clearable
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          data={['pending', 'approved', 'rejected']}
          leftSection={<Filter size={16} />}
          clearable
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Check In</Table.Th>
            <Table.Th>Check Out</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedRecords.map((record) => (
            <Table.Tr key={record.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    size={30}
                    radius={30}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.employeeName}`}
                  />
                  <div>
                    <Text size="sm" fw={500}>
                      {record.employeeName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {record.employeeId}
                    </Text>
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>{record.department}</Table.Td>
              <Table.Td>{dayjs(record.date).format('MMM D, YYYY')}</Table.Td>
              <Table.Td>{record.checkIn}</Table.Td>
              <Table.Td>{record.checkOut}</Table.Td>
              <Table.Td>
                <Badge
                  color={getStatusColor(record.status)}
                  leftSection={getStatusIcon(record.status)}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>{record.location}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {record.status === 'pending' && isManager && (
                    <>
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => handleApproveAttendance(record)}
                        title="Approve Attendance"
                      >
                        <ThumbsUp size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleApproveAttendance(record)}
                        title="Reject Attendance"
                      >
                        <ThumbsDown size={16} />
                      </ActionIcon>
                    </>
                  )}
                  {record.comments && (
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedAttendance(record);
                        setAttendanceComment(record.comments);
                        setAttendanceApprovalModal(true);
                      }}
                      title="View Comments"
                    >
                      <MessageCircle size={16} />
                    </ActionIcon>
                  )}
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <MoreVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<MessageCircle size={16} />}
                        onClick={() => handleEdit(record)}
                      >
                        Edit Record
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  const renderTimesheetTab = () => (
    <Stack gap="md">
      <Group grow>
        <DatePickerInput
          label="Week Starting"
          placeholder="Pick date"
          value={selectedDate}
          onChange={setSelectedDate}
          leftSection={<CalendarRange size={16} />}
        />
        <TextInput
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<Search size={16} />}
        />
        <Select
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          data={['Engineering', 'Design', 'Marketing', 'HR']}
          leftSection={<Filter size={16} />}
          clearable
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          data={['pending', 'approved', 'rejected']}
          leftSection={<Filter size={16} />}
          clearable
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Week Starting</Table.Th>
            <Table.Th>Total Hours</Table.Th>
            <Table.Th>Submitted Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedTimesheets.map((timesheet) => (
            <Table.Tr key={timesheet.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    size={30}
                    radius={30}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${timesheet.employeeName}`}
                  />
                  <div>
                    <Text size="sm" fw={500}>
                      {timesheet.employeeName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {timesheet.employeeId}
                    </Text>
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>{timesheet.department}</Table.Td>
              <Table.Td>{dayjs(timesheet.weekStarting).format('MMM D, YYYY')}</Table.Td>
              <Table.Td>{timesheet.totalHours}h</Table.Td>
              <Table.Td>{dayjs(timesheet.submittedDate).format('MMM D, YYYY')}</Table.Td>
              <Table.Td>
                <Badge
                  color={getStatusColor(timesheet.status)}
                  leftSection={getStatusIcon(timesheet.status)}
                >
                  {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {timesheet.status === 'pending' && isManager && (
                    <>
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => handleTimesheetAction(timesheet, true)}
                        title="Approve Timesheet"
                      >
                        <ThumbsUp size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleTimesheetAction(timesheet, false)}
                        title="Reject Timesheet"
                      >
                        <ThumbsDown size={16} />
                      </ActionIcon>
                    </>
                  )}
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => {
                      setSelectedTimesheet(timesheet);
                      setTimesheetApprovalModal(true);
                    }}
                    title="View Details"
                  >
                    <MessageCircle size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Attendance Management</Title>
        {activeTab === 'attendance' && (
          <Button
            leftSection={<UserPlus size={20} />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Attendance Record
          </Button>
        )}
      </Group>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="attendance"
              leftSection={<Calendar size={16} />}
            >
              Daily Attendance
            </Tabs.Tab>
            <Tabs.Tab
              value="timesheet"
              leftSection={<ClipboardList size={16} />}
            >
              Timesheets
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="attendance" pt="md">
            {renderAttendanceTab()}
          </Tabs.Panel>

          <Tabs.Panel value="timesheet" pt="md">
            {renderTimesheetTab()}
          </Tabs.Panel>
        </Tabs>

        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      </Paper>

      {/* Edit Attendance Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Attendance Record"
      >
        {selectedRecord && (
          <Stack>
            <Text fw={500}>{selectedRecord.employeeName}</Text>
            <Text size="sm" c="dimmed">
              {dayjs(selectedRecord.date).format('MMMM D, YYYY')}
            </Text>

            <TimeInput
              label="Check In Time"
              value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.currentTarget.value })}
            />

            <TimeInput
              label="Check Out Time"
              value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.currentTarget.value })}
            />

            <Select
              label="Status"
              value={editForm.status}
              onChange={(value) => setEditForm({ ...editForm, status: value || '' })}
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />

            <Textarea
              label="Notes"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.currentTarget.value })}
              placeholder="Add any additional notes"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add Attendance Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Attendance Record"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockAttendanceData.map(emp => ({
              value: emp.employeeId,
              label: `${emp.employeeName} - ${emp.department}`,
            }))}
            value={addForm.employeeId}
            onChange={(value) => setAddForm({ ...addForm, employeeId: value || '' })}
            searchable
            required
          />

          <DatePickerInput
            label="Date"
            placeholder="Pick date"
            value={addForm.date}
            onChange={(value) => setAddForm({ ...addForm, date: value || new Date() })}
            required
          />

          <Group grow>
            <TimeInput
              label="Check In Time"
              value={addForm.checkIn}
              onChange={(e) => setAddForm({ ...addForm, checkIn: e.currentTarget.value })}
              required
            />

            <TimeInput
              label="Check Out Time"
              value={addForm.checkOut}
              onChange={(e) => setAddForm({ ...addForm, checkOut: e.currentTarget.value })}
              required
            />
          </Group>

          <Group grow>
            <Select
              label="Status"
              value={addForm.status}
              onChange={(value) => setAddForm({ ...addForm, status: value || 'pending' })}
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              required
            />

            <Select
              label="Location"
              value={addForm.location}
              onChange={(value) => setAddForm({ ...addForm, location: value || 'Office' })}
              data={[
                { value: 'Office', label: 'Office' },
                { value: 'Remote', label: 'Remote' },
                { value: 'Field', label: 'Field Work' },
              ]}
              required
            />
          </Group>

          <Textarea
            label="Notes"
            value={addForm.notes}
            onChange={(e) => setAddForm({ ...addForm, notes: e.currentTarget.value })}
            placeholder="Add any additional notes"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAttendance} loading={loading}>
              Add Record
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Timesheet Approval Modal */}
      <Modal
        opened={timesheetApprovalModal}
        onClose={() => {
          setTimesheetApprovalModal(false);
          setSelectedTimesheet(null);
          setApprovalComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedTimesheet?.status === 'pending'
              ? 'Timesheet Approval'
              : 'Timesheet Details'}
          </Text>
        }
        size="lg"
      >
        {selectedTimesheet && (
          <Stack>
            <Group>
              <Avatar
                size={40}
                radius={40}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTimesheet.employeeName}`}
              />
              <div>
                <Text fw={500}>{selectedTimesheet.employeeName}</Text>
                <Text size="sm" c="dimmed">{selectedTimesheet.department}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Week Starting</Text>
                <Text>{dayjs(selectedTimesheet.weekStarting).format('MMM D, YYYY')}</Text>
              </div>
              <div>
                <Text fw={500}>Total Hours</Text>
                <Text>{selectedTimesheet.totalHours}h</Text>
              </div>
            </Group>

            <div>
              <Text fw={500}>Tasks</Text>
              <Text>{selectedTimesheet.tasks}</Text>
            </div>

            {selectedTimesheet.status !== 'pending' && selectedTimesheet.comments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Manager Comments"
                color={selectedTimesheet.status === 'approved' ? 'green' : 'red'}
              >
                {selectedTimesheet.comments}
              </Alert>
            )}

            {isManager && selectedTimesheet.status === 'pending' && (
              <>
                <Textarea
                  label="Comments"
                  placeholder="Add your comments here..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.currentTarget.value)}
                  minRows={3}
                />

                <Group justify="flex-end" mt="md">
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleTimesheetApproval(false)}
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    color="green"
                    onClick={() => handleTimesheetApproval(true)}
                    loading={loading}
                  >
                    Approve
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        )}
      </Modal>

      {/* Attendance Approval Modal */}
      <Modal
        opened={attendanceApprovalModal}
        onClose={() => {
          setAttendanceApprovalModal(false);
          setSelectedAttendance(null);
          setAttendanceComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedAttendance?.status === 'pending'
              ? 'Attendance Approval'
              : 'Attendance Details'}
          </Text>
        }
        size="lg"
      >
        {selectedAttendance && (
          <Stack>
            <Group>
              <Avatar
                size={40}
                radius={40}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAttendance.employeeName}`}
              />
              <div>
                <Text fw={500}>{selectedAttendance.employeeName}</Text>
                <Text size="sm" c="dimmed">{selectedAttendance.department}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Date</Text>
                <Text>{dayjs(selectedAttendance.date).format('MMM D, YYYY')}</Text>
              </div>
              <div>
                <Text fw={500}>Location</Text>
                <Text>{selectedAttendance.location}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Check In</Text>
                <Text>{selectedAttendance.checkIn}</Text>
              </div>
              <div>
                <Text fw={500}>Check Out</Text>
                <Text>{selectedAttendance.checkOut}</Text>
              </div>
            </Group>

            {selectedAttendance.status !== 'pending' && selectedAttendance.comments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Manager Comments"
                color={selectedAttendance.status === 'approved' ? 'green' : 'red'}
              >
                {selectedAttendance.comments}
              </Alert>
            )}

            {isManager && selectedAttendance.status === 'pending' && (
              <>
                <Textarea
                  label="Comments"
                  placeholder="Add your comments here..."
                  value={attendanceComment}
                  onChange={(e) => setAttendanceComment(e.currentTarget.value)}
                  minRows={3}
                />

                <Group justify="flex-end" mt="md">
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleAttendanceApproval(false)}
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    color="green"
                    onClick={() => handleAttendanceApproval(true)}
                    loading={loading}
                  >
                    Approve
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
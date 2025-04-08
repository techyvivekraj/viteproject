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
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CalendarRange,
  UserPlus,
} from 'lucide-react';
import { useOvertimeStore } from '../store/overtime';
import { useOrganizationStore } from '../store/organization';
import type { OvertimeRequest } from '../types';

// Mock data for employees
const mockEmployees = [
  { value: '101', label: 'John Doe - Engineering' },
  { value: '102', label: 'Jane Smith - Design' },
  { value: '103', label: 'Mike Johnson - Marketing' },
];

export default function Overtime() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addRequestModal, setAddRequestModal] = useState(false);
  const [addOvertimeModal, setAddOvertimeModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);
  const { requests, loading, requestOvertime, approveOvertime, cancelOvertime } = useOvertimeStore();

  const [requestForm, setRequestForm] = useState({
    date: new Date(),
    startTime: '',
    endTime: '',
    reason: '',
  });

  const [overtimeForm, setOvertimeForm] = useState({
    employeeId: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    reason: '',
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddRequest = async () => {
    const hours = calculateHours(requestForm.startTime, requestForm.endTime);
    
    await requestOvertime({
      employeeId: '101', // This would come from the logged-in user
      employeeName: 'John Doe', // This would come from the logged-in user
      department: 'Engineering', // This would come from the logged-in user
      date: requestForm.date.toISOString().split('T')[0],
      startTime: requestForm.startTime,
      endTime: requestForm.endTime,
      hours,
      reason: requestForm.reason,
    });

    setAddRequestModal(false);
    setRequestForm({
      date: new Date(),
      startTime: '',
      endTime: '',
      reason: '',
    });
  };

  const handleAddOvertime = async () => {
    const hours = calculateHours(overtimeForm.startTime, overtimeForm.endTime);
    const selectedEmployee = mockEmployees.find(emp => emp.value === overtimeForm.employeeId);
    const [name, department] = selectedEmployee?.label.split(' - ') || [];
    
    await requestOvertime({
      employeeId: overtimeForm.employeeId,
      employeeName: name,
      department: department,
      date: overtimeForm.date.toISOString().split('T')[0],
      startTime: overtimeForm.startTime,
      endTime: overtimeForm.endTime,
      hours,
      reason: overtimeForm.reason,
    });

    setAddOvertimeModal(false);
    setOvertimeForm({
      employeeId: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      reason: '',
    });
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedRequest) return;

    await approveOvertime(selectedRequest.id, approved, approvalComment);
    setApprovalModal(false);
    setSelectedRequest(null);
    setApprovalComment('');
  };

  const calculateHours = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
  };

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
        return <AlertCircle size={16} />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !departmentFilter || request.department === departmentFilter;
    const matchesStatus = !statusFilter || request.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Overtime Management</Title>
        <Group>
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddRequestModal(true)}
          >
            Request Overtime
          </Button>
          {isManager && (
            <Button
              leftSection={<UserPlus size={20} />}
              onClick={() => setAddOvertimeModal(true)}
              variant="light"
            >
              Add Overtime
            </Button>
          )}
        </Group>
      </Group>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Group mb="md" grow>
          <TextInput
            placeholder="Search by name or reason"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
          />
          <Group>
            <Select
              placeholder="Filter by department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              data={['Engineering', 'Design', 'Marketing', 'HR']}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              data={['pending', 'approved', 'rejected']}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
          </Group>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Hours</Table.Th>
              <Table.Th>Reason</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRequests.map((request) => (
              <Table.Tr key={request.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar
                      size={30}
                      radius={30}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employeeName}`}
                    />
                    <div>
                      <Text size="sm" fw={500}>
                        {request.employeeName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {request.employeeId}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>{request.department}</Table.Td>
                <Table.Td>{new Date(request.date).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  {request.startTime} - {request.endTime}
                </Table.Td>
                <Table.Td>{request.hours}h</Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>
                    {request.reason}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusColor(request.status)}
                    leftSection={getStatusIcon(request.status)}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {request.status === 'pending' && (
                      <>
                        {isManager ? (
                          <>
                            <ActionIcon
                              variant="light"
                              color="green"
                              onClick={() => {
                                setSelectedRequest(request);
                                setApprovalModal(true);
                              }}
                              title="Approve Request"
                            >
                              <ThumbsUp size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => {
                                setSelectedRequest(request);
                                setApprovalModal(true);
                              }}
                              title="Reject Request"
                            >
                              <ThumbsDown size={16} />
                            </ActionIcon>
                          </>
                        ) : (
                          <Menu>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <MoreVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                color="red"
                                onClick={() => cancelOvertime(request.id)}
                              >
                                Cancel Request
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </>
                    )}
                    {request.managerComments && (
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setSelectedRequest(request);
                          setApprovalComment(request.managerComments || '');
                          setApprovalModal(true);
                        }}
                        title="View Comments"
                      >
                        <MessageCircle size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add Request Modal */}
      <Modal
        opened={addRequestModal}
        onClose={() => setAddRequestModal(false)}
        title="Request Overtime"
      >
        <Stack>
          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={requestForm.date}
            onChange={(value) => setRequestForm({ ...requestForm, date: value || new Date() })}
            leftSection={<CalendarRange size={16} />}
            required
          />

          <Group grow>
            <TimeInput
              label="Start Time"
              value={requestForm.startTime}
              onChange={(e) => setRequestForm({ ...requestForm, startTime: e.currentTarget.value })}
              leftSection={<Clock size={16} />}
              required
            />
            <TimeInput
              label="End Time"
              value={requestForm.endTime}
              onChange={(e) => setRequestForm({ ...requestForm, endTime: e.currentTarget.value })}
              leftSection={<Clock size={16} />}
              required
            />
          </Group>

          <Textarea
            label="Reason"
            placeholder="Enter reason for overtime"
            value={requestForm.reason}
            onChange={(e) => setRequestForm({ ...requestForm, reason: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddRequestModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest} loading={loading}>
              Submit Request
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Overtime Modal (Manager) */}
      <Modal
        opened={addOvertimeModal}
        onClose={() => setAddOvertimeModal(false)}
        title="Add Employee Overtime"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockEmployees}
            value={overtimeForm.employeeId}
            onChange={(value) => setOvertimeForm({ ...overtimeForm, employeeId: value || '' })}
            searchable
            required
          />

          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={overtimeForm.date}
            onChange={(value) => setOvertimeForm({ ...overtimeForm, date: value || new Date() })}
            leftSection={<CalendarRange size={16} />}
            required
          />

          <Group grow>
            <TimeInput
              label="Start Time"
              value={overtimeForm.startTime}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, startTime: e.currentTarget.value })}
              leftSection={<Clock size={16} />}
              required
            />
            <TimeInput
              label="End Time"
              value={overtimeForm.endTime}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, endTime: e.currentTarget.value })}
              leftSection={<Clock size={16} />}
              required
            />
          </Group>

          <Textarea
            label="Reason"
            placeholder="Enter reason for overtime"
            value={overtimeForm.reason}
            onChange={(e) => setOvertimeForm({ ...overtimeForm, reason: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddOvertimeModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOvertime} loading={loading}>
              Add Overtime
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Approval Modal */}
      <Modal
        opened={approvalModal}
        onClose={() => {
          setApprovalModal(false);
          setSelectedRequest(null);
          setApprovalComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedRequest?.status === 'pending'
              ? 'Overtime Approval'
              : 'Overtime Details'}
          </Text>
        }
      >
        {selectedRequest && (
          <Stack>
            <Group>
              <Avatar
                size={40}
                radius={40}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.employeeName}`}
              />
              <div>
                <Text fw={500}>{selectedRequest.employeeName}</Text>
                <Text size="sm" c="dimmed">{selectedRequest.department}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Date</Text>
                <Text>{new Date(selectedRequest.date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text fw={500}>Time</Text>
                <Text>{selectedRequest.startTime} - {selectedRequest.endTime}</Text>
              </div>
              <div>
                <Text fw={500}>Hours</Text>
                <Text>{selectedRequest.hours}h</Text>
              </div>
            </Group>

            <div>
              <Text fw={500}>Reason</Text>
              <Text>{selectedRequest.reason}</Text>
            </div>

            {selectedRequest.status !== 'pending' && selectedRequest.managerComments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Manager Comments"
                color={selectedRequest.status === 'approved' ? 'green' : 'red'}
              >
                {selectedRequest.managerComments}
              </Alert>
            )}

            {selectedRequest.status === 'pending' && isManager && (
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
                    onClick={() => handleApproval(false)}
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    color="green"
                    onClick={() => handleApproval(true)}
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
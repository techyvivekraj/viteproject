import { useState } from 'react';
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
  Card,
  FileInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Upload,
  Calendar,
  FileText,
  Download,
  MoreVertical,
} from 'lucide-react';
import { useLeaveStore } from '../store/leave';
import { useOrganizationStore } from '../store/organization';
import type { LeaveRequest } from '../types';
import { differenceInBusinessDays } from 'date-fns';

export default function Leave() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  const userRole = useOrganizationStore((state) => state.userRole);
  const {
    requests,
    loading,
    requestLeave,
    approveLeave,
    cancelLeave,
    getLeaveSummaries,
  } = useLeaveStore();

  const [leaveForm, setLeaveForm] = useState({
    type: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    reason: '',
    attachments: [] as File[],
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const calculateDays = (start: Date, end: Date) => {
    return differenceInBusinessDays(end, start) + 1;
  };

  const handleAddLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate) return;

    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);

    try {
      await requestLeave({
        employeeId: '101', // This would come from the logged-in user
        employeeName: 'John Doe', // This would come from the logged-in user
        department: 'Engineering', // This would come from the logged-in user
        type: leaveForm.type as LeaveRequest['type'],
        startDate: leaveForm.startDate.toISOString().split('T')[0],
        endDate: leaveForm.endDate.toISOString().split('T')[0],
        days,
        reason: leaveForm.reason,
        attachments: leaveForm.attachments.map(file => URL.createObjectURL(file)), // In a real app, these would be uploaded to storage
      });

      setAddLeaveModal(false);
      setLeaveForm({
        type: '',
        startDate: null,
        endDate: null,
        reason: '',
        attachments: [],
      });
    } catch (error) {
      console.error('Error adding leave request:', error);
    }
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedRequest) return;

    try {
      await approveLeave(selectedRequest.id, approved, approvalComment);
      setApprovalModal(false);
      setSelectedRequest(null);
      setApprovalComment('');
    } catch (error) {
      console.error('Error handling approval:', error);
    }
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
        return <Calendar size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const summaries = getLeaveSummaries();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Leave Management</Title>
        <Button
          leftSection={<Plus size={20} />}
          onClick={() => setAddLeaveModal(true)}
        >
          Request Leave
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Group mb="md" grow>
          <TextInput
            placeholder="Search by name"
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
              <Table.Th>Type</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Days</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests
              .filter(request => {
                const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDepartment = !departmentFilter || request.department === departmentFilter;
                const matchesStatus = !statusFilter || request.status === statusFilter;
                return matchesSearch && matchesDepartment && matchesStatus;
              })
              .map((request) => (
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
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{request.department}</Table.Td>
                  <Table.Td>
                    <Text tt="capitalize">{request.type}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>{request.days} days</Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(request.status)}
                      leftSection={getStatusIcon(request.status)}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
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
                                title="Approve Leave"
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
                                title="Reject Leave"
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
                                  onClick={() => cancelLeave(request.id)}
                                >
                                  Cancel Request
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          )}
                        </>
                      )}
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setSelectedRequest(request);
                          setApprovalModal(true);
                        }}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add Leave Modal */}
      <Modal
        opened={addLeaveModal}
        onClose={() => setAddLeaveModal(false)}
        title="Request Leave"
        size="lg"
      >
        <Stack>
          <Select
            label="Leave Type"
            placeholder="Select leave type"
            data={[
              { value: 'annual', label: 'Annual Leave' },
              { value: 'sick', label: 'Sick Leave' },
              { value: 'unpaid', label: 'Unpaid Leave' },
              { value: 'maternity', label: 'Maternity Leave' },
              { value: 'paternity', label: 'Paternity Leave' },
              { value: 'bereavement', label: 'Bereavement Leave' },
            ]}
            value={leaveForm.type}
            onChange={(value) => setLeaveForm({ ...leaveForm, type: value || '' })}
            required
          />

          <Group grow>
            <DatePickerInput
              label="Start Date"
              placeholder="Select start date"
              value={leaveForm.startDate}
              onChange={(value) => setLeaveForm({ ...leaveForm, startDate: value })}
              required
              minDate={new Date()}
            />
            <DatePickerInput
              label="End Date"
              placeholder="Select end date"
              value={leaveForm.endDate}
              onChange={(value) => setLeaveForm({ ...leaveForm, endDate: value })}
              required
              minDate={leaveForm.startDate || new Date()}
            />
          </Group>

          {leaveForm.startDate && leaveForm.endDate && (
            <Alert icon={<Calendar size={16} />} color="blue">
              {calculateDays(leaveForm.startDate, leaveForm.endDate)} working days
            </Alert>
          )}

          <Textarea
            label="Reason"
            placeholder="Enter reason for leave"
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.currentTarget.value })}
            minRows={3}
            required
          />

          <FileInput
            label="Attachments"
            placeholder="Upload supporting documents"
            multiple
            accept="image/*,.pdf"
            value={leaveForm.attachments}
            onChange={(files) => setLeaveForm({ ...leaveForm, attachments: Array.from(files || []) })}
            leftSection={<Upload size={16} />}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddLeaveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLeave} loading={loading}>
              Submit Request
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
              ? 'Leave Approval'
              : 'Leave Details'}
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
                <Text fw={500}>Leave Type</Text>
                <Text tt="capitalize">{selectedRequest.type}</Text>
              </div>
              <div>
                <Text fw={500}>Duration</Text>
                <Text>
                  {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text fw={500}>Days</Text>
                <Text>{selectedRequest.days} days</Text>
              </div>
            </Group>

            <div>
              <Text fw={500}>Reason</Text>
              <Text>{selectedRequest.reason}</Text>
            </div>

            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <Card withBorder mb="md">
                <Text fw={500} mb="sm">Attachments</Text>
                <Stack>
                  {selectedRequest.attachments.map((url, index) => (
                    <Group key={index} justify="space-between" wrap="nowrap">
                      <Group gap="sm">
                        <FileText size={20} />
                        <div>
                          <Text size="sm" fw={500}>Document {index + 1}</Text>
                          <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                            {url.split('/').pop()}
                          </Text>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <Button
                          variant="light"
                          size="xs"
                          component="a"
                          href={url}
                          target="_blank"
                          leftSection={<Eye size={14} />}
                        >
                          View
                        </Button>
                        <Button
                          variant="light"
                          size="xs"
                          component="a"
                          href={url}
                          download
                          leftSection={<Download size={14} />}
                        >
                          Download
                        </Button>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

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
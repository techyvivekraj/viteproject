import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  NumberInput,
  Progress,
} from '@mantine/core';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  UserPlus,
  Calculator,
  Eye,
} from 'lucide-react';
import { useAdvanceStore } from '../store/advance';
import { useOrganizationStore } from '../store/organization';
import type { AdvanceRequest } from '../types';

// Mock data for employees
const mockEmployees = [
  { value: '101', label: 'John Doe - Engineering' },
  { value: '102', label: 'Jane Smith - Design' },
  { value: '103', label: 'Mike Johnson - Marketing' },
];

export default function Advance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [addRequestModal, setAddRequestModal] = useState(false);
  const [addAdvanceModal, setAddAdvanceModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdvanceRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);
  const { 
    requests, 
    loading, 
    requestAdvance, 
    approveAdvance, 
    cancelAdvance,
    getEmployeeLoanSummaries,
  } = useAdvanceStore();

  const [requestForm, setRequestForm] = useState({
    amount: 0,
    reason: '',
    repaymentMonths: 1,
  });

  const [advanceForm, setAdvanceForm] = useState({
    employeeId: '',
    amount: 0,
    reason: '',
    repaymentMonths: 1,
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const calculateMonthlyDeduction = (amount: number, months: number) => {
    return Math.ceil(amount / months);
  };

  const handleAddRequest = async () => {
    const monthlyDeduction = calculateMonthlyDeduction(requestForm.amount, requestForm.repaymentMonths);
    
    await requestAdvance({
      employeeId: '101', // This would come from the logged-in user
      employeeName: 'John Doe', // This would come from the logged-in user
      department: 'Engineering', // This would come from the logged-in user
      amount: requestForm.amount,
      reason: requestForm.reason,
      repaymentMonths: requestForm.repaymentMonths,
      monthlyDeduction,
    });

    setAddRequestModal(false);
    setRequestForm({
      amount: 0,
      reason: '',
      repaymentMonths: 1,
    });
  };

  const handleAddAdvance = async () => {
    const monthlyDeduction = calculateMonthlyDeduction(advanceForm.amount, advanceForm.repaymentMonths);
    const selectedEmployee = mockEmployees.find(emp => emp.value === advanceForm.employeeId);
    const [name, department] = selectedEmployee?.label.split(' - ') || [];
    
    await requestAdvance({
      employeeId: advanceForm.employeeId,
      employeeName: name,
      department: department,
      amount: advanceForm.amount,
      reason: advanceForm.reason,
      repaymentMonths: advanceForm.repaymentMonths,
      monthlyDeduction,
    });

    setAddAdvanceModal(false);
    setAdvanceForm({
      employeeId: '',
      amount: 0,
      reason: '',
      repaymentMonths: 1,
    });
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedRequest) return;

    await approveAdvance(selectedRequest.id, approved, approvalComment);
    setApprovalModal(false);
    setSelectedRequest(null);
    setApprovalComment('');
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
        return <Calculator size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const employeeSummaries = getEmployeeLoanSummaries();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Advance Management</Title>
        <Group>
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddRequestModal(true)}
          >
            Request Advance
          </Button>
          {isManager && (
            <Button
              leftSection={<UserPlus size={20} />}
              onClick={() => setAddAdvanceModal(true)}
              variant="light"
            >
              Add Advance
            </Button>
          )}
        </Group>
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
          <Select
            placeholder="Filter by department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            data={['Engineering', 'Design', 'Marketing', 'HR']}
            leftSection={<Filter size={16} />}
            clearable
          />
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Total Loan Amount</Table.Th>
              <Table.Th>Total Paid</Table.Th>
              <Table.Th>Remaining Amount</Table.Th>
              <Table.Th>Next Payment</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {employeeSummaries
              .filter(summary => {
                const matchesSearch = summary.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDepartment = !departmentFilter || summary.department === departmentFilter;
                return matchesSearch && matchesDepartment;
              })
              .map((summary) => (
                <Table.Tr key={summary.employeeId}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        size={30}
                        radius={30}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${summary.employeeName}`}
                      />
                      <div>
                        <Text size="sm" fw={500}>
                          {summary.employeeName}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{summary.department}</Table.Td>
                  <Table.Td>${summary.totalLoanAmount.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.totalPaidAmount.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.remainingAmount.toLocaleString()}</Table.Td>
                  <Table.Td>
                    {summary.nextPaymentDate ? (
                      <Group gap="xs">
                        <Text size="sm">${summary.nextPaymentAmount.toLocaleString()}</Text>
                        <Text size="sm" c="dimmed">on {summary.nextPaymentDate}</Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No pending payments</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<Eye size={14} />}
                      onClick={() => navigate(`/advance/history/${summary.employeeId}`)}
                    >
                      View History
                    </Button>
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
        title="Request Advance"
      >
        <Stack>
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            value={requestForm.amount}
            onChange={(value) => setRequestForm({ ...requestForm, amount: typeof value === 'string' ? parseFloat(value) || 0 : value || 0 })}
            min={0}
            prefix="$"
            required
          />

          <NumberInput
            label="Repayment Period (Months)"
            placeholder="Enter number of months"
            value={requestForm.repaymentMonths}
            onChange={(value) => setRequestForm({ ...requestForm, repaymentMonths: typeof value === 'string' ? parseInt(value) || 1 : value || 1 })}
            min={1}
            max={24}
            required
          />

          {requestForm.amount > 0 && requestForm.repaymentMonths > 0 && (
            <Alert icon={<Calculator size={16} />} color="blue">
              Monthly Deduction: ${calculateMonthlyDeduction(requestForm.amount, requestForm.repaymentMonths).toLocaleString()}
            </Alert>
          )}

          <Textarea
            label="Reason"
            placeholder="Enter reason for advance"
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

      {/* Add Advance Modal (Manager) */}
      <Modal
        opened={addAdvanceModal}
        onClose={() => setAddAdvanceModal(false)}
        title="Add Employee Advance"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockEmployees}
            value={advanceForm.employeeId}
            onChange={(value) => setAdvanceForm({ ...advanceForm, employeeId: value || '' })}
            searchable
            required
          />

          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            value={advanceForm.amount}
            onChange={(value) => setAdvanceForm({ ...advanceForm, amount: typeof value === 'string' ? parseFloat(value) || 0 : value || 0 })}
            min={0}
            prefix="$"
            required
          />

          <NumberInput
            label="Repayment Period (Months)"
            placeholder="Enter number of months"
            value={advanceForm.repaymentMonths}
            onChange={(value) => setAdvanceForm({ ...advanceForm, repaymentMonths: typeof value === 'string' ? parseInt(value) || 1 : value || 1 })}
            min={1}
            max={24}
            required
          />

          {advanceForm.amount > 0 && advanceForm.repaymentMonths > 0 && (
            <Alert icon={<Calculator size={16} />} color="blue">
              Monthly Deduction: ${calculateMonthlyDeduction(advanceForm.amount, advanceForm.repaymentMonths).toLocaleString()}
            </Alert>
          )}

          <Textarea
            label="Reason"
            placeholder="Enter reason for advance"
            value={advanceForm.reason}
            onChange={(e) => setAdvanceForm({ ...advanceForm, reason: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddAdvanceModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdvance} loading={loading}>
              Add Advance
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
              ? 'Advance Approval'
              : 'Advance Details'}
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
                <Text fw={500}>Amount</Text>
                <Text>${selectedRequest.amount.toLocaleString()}</Text>
              </div>
              <div>
                <Text fw={500}>Monthly Deduction</Text>
                <Text>${selectedRequest.monthlyDeduction.toLocaleString()}</Text>
              </div>
              <div>
                <Text fw={500}>Repayment Period</Text>
                <Text>{selectedRequest.repaymentMonths} months</Text>
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
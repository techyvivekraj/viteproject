import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
  NumberInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useFinesStore } from '../store/fines';
import { useOrganizationStore } from '../store/organization';
import type { Fine } from '../types';

// Mock data for employees
const mockEmployees = [
  { value: '101', label: 'John Doe - Engineering' },
  { value: '102', label: 'Jane Smith - Design' },
  { value: '103', label: 'Mike Johnson - Marketing' },
];

export default function Fines() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [addFineModal, setAddFineModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);
  const { 
    fines, 
    loading, 
    addFine, 
    approveFine, 
    cancelFine,
    getEmployeeFinesSummaries,
  } = useFinesStore();

  const [fineForm, setFineForm] = useState({
    employeeId: '',
    amount: 0,
    reason: '',
    date: new Date(),
    deductionDate: new Date(),
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddFine = async () => {
    const selectedEmployee = mockEmployees.find(emp => emp.value === fineForm.employeeId);
    const [name, department] = selectedEmployee?.label.split(' - ') || [];
    
    await addFine({
      employeeId: fineForm.employeeId,
      employeeName: name,
      department: department,
      amount: fineForm.amount,
      reason: fineForm.reason,
      date: fineForm.date.toISOString().split('T')[0],
      deductionDate: fineForm.deductionDate.toISOString().split('T')[0],
    });

    setAddFineModal(false);
    setFineForm({
      employeeId: '',
      amount: 0,
      reason: '',
      date: new Date(),
      deductionDate: new Date(),
    });
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedFine) return;

    await approveFine(selectedFine.id, approved, approvalComment);
    setApprovalModal(false);
    setSelectedFine(null);
    setApprovalComment('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      deducted: 'blue',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={16} />;
      case 'pending':
        return <AlertCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'deducted':
        return <CheckCircle2 size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const employeeSummaries = getEmployeeFinesSummaries();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Fines Management</Title>
        {isManager && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddFineModal(true)}
          >
            Add Fine
          </Button>
        )}
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
              <Table.Th>Total Fines</Table.Th>
              <Table.Th>Deducted</Table.Th>
              <Table.Th>Pending Amount</Table.Th>
              <Table.Th>Next Deduction</Table.Th>
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
                  <Table.Td>${summary.totalFines.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.totalDeducted.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.pendingAmount.toLocaleString()}</Table.Td>
                  <Table.Td>
                    {summary.nextDeductionDate ? (
                      <Group gap="xs">
                        <Text size="sm">${summary.nextDeductionAmount.toLocaleString()}</Text>
                        <Text size="sm" c="dimmed">on {summary.nextDeductionDate}</Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No pending deductions</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<Eye size={14} />}
                      onClick={() => navigate(`/fines/history/${summary.employeeId}`)}
                    >
                      View History
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add Fine Modal */}
      <Modal
        opened={addFineModal}
        onClose={() => setAddFineModal(false)}
        title="Add Fine"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockEmployees}
            value={fineForm.employeeId}
            onChange={(value) => setFineForm({ ...fineForm, employeeId: value || '' })}
            searchable
            required
          />

          <NumberInput
            label="Fine Amount"
            placeholder="Enter amount"
            value={fineForm.amount}
            onChange={(value) => setFineForm({ ...fineForm, amount: typeof value === 'string' ? parseFloat(value) || 0 : value || 0 })}
            min={0}
            prefix="$"
            required
          />

          <DatePickerInput
            label="Fine Date"
            placeholder="Select date"
            value={fineForm.date}
            onChange={(value) => setFineForm({ ...fineForm, date: value || new Date() })}
            required
          />

          <DatePickerInput
            label="Deduction Date"
            placeholder="Select deduction date"
            value={fineForm.deductionDate}
            onChange={(value) => setFineForm({ ...fineForm, deductionDate: value || new Date() })}
            required
          />

          <Textarea
            label="Reason"
            placeholder="Enter reason for fine"
            value={fineForm.reason}
            onChange={(e) => setFineForm({ ...fineForm, reason: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddFineModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFine} loading={loading}>
              Add Fine
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Approval Modal */}
      <Modal
        opened={approvalModal}
        onClose={() => {
          setApprovalModal(false);
          setSelectedFine(null);
          setApprovalComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedFine?.status === 'pending'
              ? 'Fine Approval'
              : 'Fine Details'}
          </Text>
        }
      >
        {selectedFine && (
          <Stack>
            <Group>
              <Avatar
                size={40}
                radius={40}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFine.employeeName}`}
              />
              <div>
                <Text fw={500}>{selectedFine.employeeName}</Text>
                <Text size="sm" c="dimmed">{selectedFine.department}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Amount</Text>
                <Text>${selectedFine.amount.toLocaleString()}</Text>
              </div>
              <div>
                <Text fw={500}>Date</Text>
                <Text>{new Date(selectedFine.date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text fw={500}>Deduction Date</Text>
                <Text>{new Date(selectedFine.deductionDate).toLocaleDateString()}</Text>
              </div>
            </Group>

            <div>
              <Text fw={500}>Reason</Text>
              <Text>{selectedFine.reason}</Text>
            </div>

            {selectedFine.status !== 'pending' && selectedFine.managerComments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Manager Comments"
                color={selectedFine.status === 'approved' ? 'green' : 'red'}
              >
                {selectedFine.managerComments}
              </Alert>
            )}

            {selectedFine.status === 'pending' && isManager && (
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
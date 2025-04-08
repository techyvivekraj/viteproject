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
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
  NumberInput,
  FileInput,
  Tabs,
  Card,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  Receipt,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Upload,
  Clock,
  FileText,
  Eye,
  Download,
} from 'lucide-react';
import { useExpensesStore } from '../store/expenses';
import { useOrganizationStore } from '../store/organization';
import type { Expense } from '../types';

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('expenses');

  const userRole = useOrganizationStore((state) => state.userRole);
  const {
    expenses,
    categories,
    loading,
    addExpense,
    approveExpense,
    markAsReimbursed,
  } = useExpensesStore();

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: 0,
    date: new Date(),
    description: '',
    attachments: [] as File[],
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddExpense = async () => {
    try {
      await addExpense({
        employeeId: '101', // This would come from the logged-in user
        employeeName: 'John Doe', // This would come from the logged-in user
        department: 'Engineering', // This would come from the logged-in user
        category: expenseForm.category,
        amount: expenseForm.amount,
        date: expenseForm.date.toISOString().split('T')[0],
        description: expenseForm.description,
        attachments: expenseForm.attachments.map(file => URL.createObjectURL(file)), // In a real app, these would be uploaded to storage
      });

      setAddExpenseModal(false);
      setExpenseForm({
        category: '',
        amount: 0,
        date: new Date(),
        description: '',
        attachments: [],
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedExpense) return;

    try {
      await approveExpense(selectedExpense.id, approved, approvalComment);
      setApprovalModal(false);
      setSelectedExpense(null);
      setApprovalComment('');
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };

  const handleMarkAsReimbursed = async (id: string) => {
    try {
      await markAsReimbursed(id);
    } catch (error) {
      console.error('Error marking as reimbursed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      reimbursed: 'blue',
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
      case 'reimbursed':
        return <Receipt size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const renderExpensesList = () => (
    <Stack gap="md">
      <Group grow>
        <TextInput
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<Search size={16} />}
        />
        <Group>
          <Select
            placeholder="Department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            data={['Engineering', 'Design', 'Marketing', 'HR']}
            leftSection={<Filter size={16} />}
            clearable
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            data={categories.map(cat => cat.name)}
            leftSection={<Filter size={16} />}
            clearable
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            data={['pending', 'approved', 'rejected', 'reimbursed']}
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
            <Table.Th>Category</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenses
            .filter(expense => {
              const matchesSearch = 
                expense.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense.description.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesDepartment = !departmentFilter || expense.department === departmentFilter;
              const matchesCategory = !categoryFilter || expense.category === categoryFilter;
              const matchesStatus = !statusFilter || expense.status === statusFilter;
              return matchesSearch && matchesDepartment && matchesCategory && matchesStatus;
            })
            .map((expense) => (
              <Table.Tr key={expense.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar
                      size={30}
                      radius={30}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expense.employeeName}`}
                    />
                    <div>
                      <Text size="sm" fw={500}>
                        {expense.employeeName}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>{expense.department}</Table.Td>
                <Table.Td>{expense.category}</Table.Td>
                <Table.Td>${expense.amount.toLocaleString()}</Table.Td>
                <Table.Td>{new Date(expense.date).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusColor(expense.status)}
                    leftSection={getStatusIcon(expense.status)}
                  >
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    {expense.status === 'pending' && isManager && (
                      <>
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setApprovalModal(true);
                          }}
                          title="Approve Expense"
                        >
                          <ThumbsUp size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setApprovalModal(true);
                          }}
                          title="Reject Expense"
                        >
                          <ThumbsDown size={16} />
                        </ActionIcon>
                      </>
                    )}
                    {expense.status === 'approved' && isManager && (
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleMarkAsReimbursed(expense.id)}
                        title="Mark as Reimbursed"
                      >
                        <Receipt size={16} />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedExpense(expense);
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
    </Stack>
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Expense Management</Title>
        <Button
          leftSection={<Plus size={20} />}
          onClick={() => setAddExpenseModal(true)}
        >
          Add Expense
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="expenses"
              leftSection={<Receipt size={16} />}
            >
              Expenses
            </Tabs.Tab>
            {isManager && (
              <Tabs.Tab
                value="settings"
                leftSection={<Settings size={16} />}
              >
                Settings
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="expenses" pt="md">
            {renderExpensesList()}
          </Tabs.Panel>

          {isManager && (
            <Tabs.Panel value="settings" pt="md">
              <Text>Expense categories and settings</Text>
            </Tabs.Panel>
          )}
        </Tabs>
      </Paper>

      {/* Add Expense Modal */}
      <Modal
        opened={addExpenseModal}
        onClose={() => setAddExpenseModal(false)}
        title="Add Expense"
        size="lg"
      >
        <Stack>
          <Select
            label="Category"
            placeholder="Select expense category"
            data={categories.map(cat => cat.name)}
            value={expenseForm.category}
            onChange={(value) => setExpenseForm({ ...expenseForm, category: value || '' })}
            required
          />

          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            value={expenseForm.amount}
            onChange={(value) => setExpenseForm({ ...expenseForm, amount: typeof value === 'string' ? parseFloat(value) || 0 : value || 0 })}
            min={0}
            prefix="$"
            required
          />

          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={expenseForm.date}
            onChange={(value) => setExpenseForm({ ...expenseForm, date: value || new Date() })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter expense description"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.currentTarget.value })}
            minRows={3}
            required
          />

          <FileInput
            label="Attachments"
            placeholder="Upload receipts or documents"
            multiple
            accept="image/*,.pdf"
            value={expenseForm.attachments}
            onChange={(files) => setExpenseForm({ ...expenseForm, attachments: Array.from(files || []) })}
            leftSection={<Upload size={16} />}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddExpenseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense} loading={loading}>
              Add Expense
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Approval Modal */}
      <Modal
        opened={approvalModal}
        onClose={() => {
          setApprovalModal(false);
          setSelectedExpense(null);
          setApprovalComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedExpense?.status === 'pending'
              ? 'Expense Approval'
              : 'Expense Details'}
          </Text>
        }
      >
        {selectedExpense && (
          <Stack>
            <Group>
              <Avatar
                size={40}
                radius={40}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedExpense.employeeName}`}
              />
              <div>
                <Text fw={500}>{selectedExpense.employeeName}</Text>
                <Text size="sm" c="dimmed">{selectedExpense.department}</Text>
              </div>
            </Group>

            <Group grow>
              <div>
                <Text fw={500}>Category</Text>
                <Text>{selectedExpense.category}</Text>
              </div>
              <div>
                <Text fw={500}>Amount</Text>
                <Text>${selectedExpense.amount.toLocaleString()}</Text>
              </div>
              <div>
                <Text fw={500}>Date</Text>
                <Text>{new Date(selectedExpense.date).toLocaleDateString()}</Text>
              </div>
            </Group>

            <div>
              <Text fw={500}>Description</Text>
              <Text>{selectedExpense.description}</Text>
            </div>

            {selectedExpense.attachments && selectedExpense.attachments.length > 0 && (
              <Card withBorder mb="md">
                <Text fw={500} mb="sm">Attachments</Text>
                <Stack>
                  {selectedExpense.attachments.map((url: string, index: number) => (
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

            {selectedExpense.status !== 'pending' && selectedExpense.managerComments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Manager Comments"
                color={selectedExpense.status === 'approved' ? 'green' : 'red'}
              >
                {selectedExpense.managerComments}
              </Alert>
            )}

            {selectedExpense.status === 'pending' && isManager && (
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
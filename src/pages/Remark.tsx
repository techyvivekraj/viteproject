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
  Card,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  Star,
  AlertTriangle,
  ArrowUp,
  MessageSquare,
  UserPlus,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Trash,
} from 'lucide-react';
import { useRemarkStore } from '../store/remark';
import { useOrganizationStore } from '../store/organization';
import type { Remark } from '../types';

// Mock data for employees
const mockEmployees = [
  { value: '101', label: 'John Doe - Engineering' },
  { value: '102', label: 'Jane Smith - Design' },
  { value: '103', label: 'Mike Johnson - Marketing' },
];

export default function Remarks() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [addRemarkModal, setAddRemarkModal] = useState(false);
  const userRole = useOrganizationStore((state) => state.userRole);
  const { 
    remarks,
    loading,
    addRemark,
    deleteRemark,
    getEmployeeRemarkSummaries,
  } = useRemarkStore();

  const [remarkForm, setRemarkForm] = useState({
    employeeId: '',
    type: '',
    title: '',
    description: '',
    date: new Date(),
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddRemark = async () => {
    const selectedEmployee = mockEmployees.find(emp => emp.value === remarkForm.employeeId);
    const [name, department] = selectedEmployee?.label.split(' - ') || [];
    
    await addRemark({
      employeeId: remarkForm.employeeId,
      employeeName: name,
      department: department,
      type: remarkForm.type as Remark['type'],
      title: remarkForm.title,
      description: remarkForm.description,
      date: remarkForm.date.toISOString().split('T')[0],
      createdBy: 'Mike Manager', // This would come from the logged-in user
    });

    setAddRemarkModal(false);
    setRemarkForm({
      employeeId: '',
      type: '',
      title: '',
      description: '',
      date: new Date(),
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appreciation':
        return <Star size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'improvement':
        return <ArrowUp size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      appreciation: 'green',
      warning: 'red',
      improvement: 'blue',
      general: 'gray',
    };
    return colors[type] || 'gray';
  };

  const employeeSummaries = getEmployeeRemarkSummaries();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Employee Remarks</Title>
        {isManager && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddRemarkModal(true)}
          >
            Add Remark
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
              placeholder="Filter by type"
              value={typeFilter}
              onChange={setTypeFilter}
              data={[
                { value: 'appreciation', label: 'Appreciation' },
                { value: 'warning', label: 'Warning' },
                { value: 'improvement', label: 'Improvement' },
                { value: 'general', label: 'General' },
              ]}
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
              <Table.Th>Total Remarks</Table.Th>
              <Table.Th>Latest Remark</Table.Th>
              <Table.Th>Statistics</Table.Th>
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
                  <Table.Td>{summary.totalRemarks}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={getTypeColor(summary.latestRemark.type)}
                      leftSection={getTypeIcon(summary.latestRemark.type)}
                    >
                      {new Date(summary.latestRemark.date).toLocaleDateString()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Badge color="green" size="sm">
                        {summary.appreciations} ★
                      </Badge>
                      <Badge color="red" size="sm">
                        {summary.warnings} !
                      </Badge>
                      <Badge color="blue" size="sm">
                        {summary.improvements} ↑
                      </Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<Eye size={14} />}
                      onClick={() => navigate(`/remarks/history/${summary.employeeId}`)}
                    >
                      View History
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add Remark Modal */}
      <Modal
        opened={addRemarkModal}
        onClose={() => setAddRemarkModal(false)}
        title="Add Remark"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockEmployees}
            value={remarkForm.employeeId}
            onChange={(value) => setRemarkForm({ ...remarkForm, employeeId: value || '' })}
            searchable
            required
          />

          <Select
            label="Remark Type"
            placeholder="Select type"
            data={[
              { value: 'appreciation', label: 'Appreciation' },
              { value: 'warning', label: 'Warning' },
              { value: 'improvement', label: 'Improvement' },
              { value: 'general', label: 'General' },
            ]}
            value={remarkForm.type}
            onChange={(value) => setRemarkForm({ ...remarkForm, type: value || '' })}
            required
          />

          <TextInput
            label="Title"
            placeholder="Enter remark title"
            value={remarkForm.title}
            onChange={(e) => setRemarkForm({ ...remarkForm, title: e.currentTarget.value })}
            required
          />

          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={remarkForm.date}
            onChange={(value) => setRemarkForm({ ...remarkForm, date: value || new Date() })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter detailed description"
            value={remarkForm.description}
            onChange={(e) => setRemarkForm({ ...remarkForm, description: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddRemarkModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRemark} loading={loading}>
              Add Remark
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
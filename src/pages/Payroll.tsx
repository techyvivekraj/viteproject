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
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
  NumberInput,
  Grid,
  Card,
} from '@mantine/core';
import {
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  Receipt,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { usePayrollStore } from '../store/payroll';
import { useOrganizationStore } from '../store/organization';
import type { Salary } from '../types';

export default function Payroll() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [updateSalaryModal, setUpdateSalaryModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const userRole = useOrganizationStore((state) => state.userRole);
  const { 
    loading,
    updateSalary,
    generatePayslip,
    getPayrollSummaries,
  } = usePayrollStore();

  const [salaryForm, setSalaryForm] = useState<Partial<Salary>>({
    basic: 0,
    allowances: {
      hra: 0,
      medical: 0,
      transport: 0,
      special: 0,
    },
    deductions: {
      pf: 0,
      tax: 0,
      insurance: 0,
    },
    effectiveFrom: new Date().toISOString().split('T')[0],
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleUpdateSalary = async () => {
    if (!selectedEmployeeId) return;

    const selectedEmployee = mockEmployees.find(emp => emp.value === selectedEmployeeId);
    const [name, department] = selectedEmployee?.label.split(' - ') || [];
    
    await updateSalary({
      employeeId: selectedEmployeeId,
      employeeName: name,
      department: department,
      basic: salaryForm.basic || 0,
      allowances: salaryForm.allowances || {
        hra: 0,
        medical: 0,
        transport: 0,
        special: 0,
      },
      deductions: salaryForm.deductions || {
        pf: 0,
        tax: 0,
        insurance: 0,
      },
      effectiveFrom: salaryForm.effectiveFrom || new Date().toISOString().split('T')[0],
      status: 'active',
    });

    setUpdateSalaryModal(false);
    setSelectedEmployeeId(null);
    setSalaryForm({
      basic: 0,
      allowances: {
        hra: 0,
        medical: 0,
        transport: 0,
        special: 0,
      },
      deductions: {
        pf: 0,
        tax: 0,
        insurance: 0,
      },
      effectiveFrom: new Date().toISOString().split('T')[0],
    });
  };

  const handleGeneratePayslip = async (employeeId: string) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    
    await generatePayslip(employeeId, month, year);
    navigate(`/payroll/payslip/${employeeId}/${month}/${year}`);
  };

  const summaries = getPayrollSummaries();

  // Mock data for employees (in a real app, this would come from your employee management system)
  const mockEmployees = [
    { value: '101', label: 'John Doe - Engineering' },
    { value: '102', label: 'Jane Smith - Design' },
    { value: '103', label: 'Mike Johnson - Marketing' },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Payroll Management</Title>
        {isManager && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setUpdateSalaryModal(true)}
          >
            Update Salary
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
              <Table.Th>Basic Salary</Table.Th>
              <Table.Th>Allowances</Table.Th>
              <Table.Th>Deductions</Table.Th>
              <Table.Th>Net Salary</Table.Th>
              <Table.Th>Last Payslip</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {summaries
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
                  <Table.Td>${summary.currentSalary.basic.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.currentSalary.totalAllowances.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.currentSalary.totalDeductions.toLocaleString()}</Table.Td>
                  <Table.Td>${summary.currentSalary.net.toLocaleString()}</Table.Td>
                  <Table.Td>
                    {summary.lastPayslip ? (
                      <Group gap="xs">
                        <Badge
                          color={
                            summary.lastPayslip.status === 'paid'
                              ? 'green'
                              : summary.lastPayslip.status === 'approved'
                              ? 'blue'
                              : 'yellow'
                          }
                          leftSection={
                            summary.lastPayslip.status === 'paid'
                              ? <CheckCircle2 size={14} />
                              : summary.lastPayslip.status === 'approved'
                              ? <Clock size={14} />
                              : <AlertCircle size={14} />
                          }
                        >
                          {`${summary.lastPayslip.month}/${summary.lastPayslip.year}`}
                        </Badge>
                        <Text size="sm">${summary.lastPayslip.amount.toLocaleString()}</Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No payslip</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        variant="light"
                        size="xs"
                        leftSection={<FileText size={14} />}
                        onClick={() => handleGeneratePayslip(summary.employeeId)}
                      >
                        Generate Payslip
                      </Button>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <Eye size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>View Payslips</Menu.Label>
                          {summary.lastPayslip && (
                            <Menu.Item
                              leftSection={<Receipt size={14} />}
                              onClick={() => navigate(`/payroll/payslip/${summary.employeeId}/${summary.lastPayslip.month}/${summary.lastPayslip.year}`)}
                            >
                              Latest Payslip
                            </Menu.Item>
                          )}
                          <Menu.Item
                            leftSection={<Download size={14} />}
                            onClick={() => {/* Handle download */}}
                          >
                            Download All
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Update Salary Modal */}
      <Modal
        opened={updateSalaryModal}
        onClose={() => {
          setUpdateSalaryModal(false);
          setSelectedEmployeeId(null);
          setSalaryForm({
            basic: 0,
            allowances: {
              hra: 0,
              medical: 0,
              transport: 0,
              special: 0,
            },
            deductions: {
              pf: 0,
              tax: 0,
              insurance: 0,
            },
            effectiveFrom: new Date().toISOString().split('T')[0],
          });
        }}
        title="Update Salary"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Employee"
            placeholder="Choose an employee"
            data={mockEmployees}
            value={selectedEmployeeId}
            onChange={setSelectedEmployeeId}
            searchable
            required
          />

          <Card withBorder>
            <Title order={4} mb="md">Basic Salary</Title>
            <NumberInput
              label="Basic Salary"
              placeholder="Enter basic salary"
              value={salaryForm.basic}
              onChange={(value) => setSalaryForm({ ...salaryForm, basic: value || 0 })}
              min={0}
              prefix="$"
              required
            />
          </Card>

          <Card withBorder>
            <Title order={4} mb="md">Allowances</Title>
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="HRA"
                  placeholder="Enter HRA"
                  value={salaryForm.allowances?.hra}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    allowances: {
                      ...salaryForm.allowances,
                      hra: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Medical"
                  placeholder="Enter medical allowance"
                  value={salaryForm.allowances?.medical}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    allowances: {
                      ...salaryForm.allowances,
                      medical: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Transport"
                  placeholder="Enter transport allowance"
                  value={salaryForm.allowances?.transport}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    allowances: {
                      ...salaryForm.allowances,
                      transport: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Special"
                  placeholder="Enter special allowance"
                  value={salaryForm.allowances?.special}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    allowances: {
                      ...salaryForm.allowances,
                      special: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
            </Grid>
          </Card>

          <Card withBorder>
            <Title order={4} mb="md">Deductions</Title>
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="PF"
                  placeholder="Enter PF deduction"
                  value={salaryForm.deductions?.pf}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    deductions: {
                      ...salaryForm.deductions,
                      pf: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Tax"
                  placeholder="Enter tax deduction"
                  value={salaryForm.deductions?.tax}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    deductions: {
                      ...salaryForm.deductions,
                      tax: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Insurance"
                  placeholder="Enter insurance deduction"
                  value={salaryForm.deductions?.insurance}
                  onChange={(value) => setSalaryForm({
                    ...salaryForm,
                    deductions: {
                      ...salaryForm.deductions,
                      insurance: value || 0,
                    },
                  })}
                  min={0}
                  prefix="$"
                />
              </Grid.Col>
            </Grid>
          </Card>

          <TextInput
            label="Effective From"
            type="date"
            value={salaryForm.effectiveFrom}
            onChange={(e) => setSalaryForm({ ...salaryForm, effectiveFrom: e.currentTarget.value })}
            required
          />

          <Alert color="blue" icon={<AlertCircle size={16} />}>
            <Text fw={500}>Total Salary Breakdown</Text>
            <Text size="sm">Basic: ${salaryForm.basic?.toLocaleString() || '0'}</Text>
            <Text size="sm">
              Total Allowances: ${Object.values(salaryForm.allowances || {}).reduce((a, b) => a + b, 0).toLocaleString()}
            </Text>
            <Text size="sm">
              Total Deductions: ${Object.values(salaryForm.deductions || {}).reduce((a, b) => a + b, 0).toLocaleString()}
            </Text>
            <Text fw={500} mt="xs">
              Net Salary: ${(
                (salaryForm.basic || 0) +
                Object.values(salaryForm.allowances || {}).reduce((a, b) => a + b, 0) -
                Object.values(salaryForm.deductions || {}).reduce((a, b) => a + b, 0)
              ).toLocaleString()}
            </Text>
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setUpdateSalaryModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSalary} loading={loading}>
              Update Salary
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
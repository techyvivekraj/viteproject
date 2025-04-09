import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Card,
  TextInput,
  Grid,
  Badge,
  Select,
  MultiSelect,
  NumberInput,
  Textarea,
  FileInput,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconInfoCircle,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function EditEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(false);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isMobile = useMediaQuery('(max-width: 48em)');
  const isTablet = useMediaQuery('(max-width: 62em)');

  const getSize = () => (isMobile ? 'xs' : 'sm');

  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    department: '',
    hire_date: null as Date | null,
    status: 'active',
    phone: '',
    shiftIds: [] as string[],
    salaryType: '',
    salary: '',
    address: '',
    country: '',
    state: '',
    postalCode: '',
    city: '',
    dateOfBirth: null as Date | null,
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyName: '',
    reportingManagerId: '',
    bankAccountNumber: '',
    confirmBankAccountNumber: '',
    bankIfsc: '',
    bankName: '',
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API response
        const mockEmployee = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          role: 'developer',
          department: 'Engineering',
          hire_date: new Date('2024-01-15'),
          status: 'active',
          phone: '+1234567890',
          shiftIds: ['morning'],
          salaryType: 'monthly',
          salary: '5000',
          address: '123 Main St',
          country: 'US',
          state: 'CA',
          postalCode: '12345',
          city: 'San Francisco',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'male',
          bloodGroup: 'O+',
          emergencyContact: '+1987654321',
          emergencyName: 'Jane Doe',
          reportingManagerId: 'mgr1',
          bankAccountNumber: '1234567890',
          confirmBankAccountNumber: '1234567890',
          bankIfsc: 'BANK123',
          bankName: 'Example Bank',
        };

        setFormValues(mockEmployee);
      } catch (error) {
        setErrors({ general: 'Failed to fetch employee data' });
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: string, files: File[]) => {
    console.log(`Files selected for ${field}:`, files);
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/employees');
    } catch (error) {
      setErrors({ general: 'Failed to update employee' });
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const departmentList = [
    { value: 'eng', label: 'Engineering' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'sales', label: 'Sales' },
  ];

  const designationList = [
    { value: 'dev', label: 'Developer' },
    { value: 'manager', label: 'Manager' },
    { value: 'designer', label: 'Designer' },
  ];

  const shiftList = [
    { value: 'morning', label: 'Morning Shift' },
    { value: 'evening', label: 'Evening Shift' },
    { value: 'night', label: 'Night Shift' },
  ];

  const managerList = [
    { value: 'mgr1', label: 'John Doe' },
    { value: 'mgr2', label: 'Jane Smith' },
  ];

  const countries = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
  ];

  const indianStates = [
    { value: 'KA', label: 'Karnataka' },
    { value: 'MH', label: 'Maharashtra' },
  ];

  return (
    <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
      <Stack gap="xl">
        <Group justify="apart" mb="md">
          <Stack gap={0}>
            <Title order={2} size={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}>
              Edit Employee
            </Title>
            <Text color="dimmed" size={isMobile ? 'xs' : 'sm'}>
              Update employee information
            </Text>
          </Stack>
          <Group gap="xs">
            <Button
              variant="light"
              color="red"
              onClick={handleCancel}
              disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
              size={getSize()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="employee-form"
              loading={loading}
              disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
              color="blue"
              size={getSize()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Group>
        </Group>

        {errors.general && (
          <Card withBorder p="md" bg="red.0" radius="md">
            <Group>
              <IconInfoCircle size={isMobile ? 16 : 20} color="red" />
              <Text color="red" size={isMobile ? 'xs' : 'sm'}>
                {errors.general}
              </Text>
            </Group>
          </Card>
        )}

        <form id="employee-form" onSubmit={onSubmit}>
          <Stack gap="xl">
            <Paper withBorder p="md" radius="md">
              <Group justify="apart" mb="md">
                <Title order={3} size={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}>
                  Basic Information
                </Title>
                <Badge color="red" variant="light" size={getSize()}>
                  Required
                </Badge>
              </Group>
              <Grid gutter={{ base: 5, sm: 'sm', md: 'md', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="First Name"
                    placeholder="Enter first name"
                    value={formValues.first_name}
                    onChange={(e) => handleChange('first_name', e.currentTarget.value)}
                    required
                    error={errors.first_name}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Last Name"
                    placeholder="Enter last name"
                    value={formValues.last_name}
                    onChange={(e) => handleChange('last_name', e.currentTarget.value)}
                    required
                    error={errors.last_name}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Phone"
                    placeholder="Enter phone number"
                    value={formValues.phone}
                    onChange={(e) => handleChange('phone', e.currentTarget.value)}
                    required
                    error={errors.phone}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Email"
                    placeholder="Enter email"
                    value={formValues.email}
                    onChange={(e) => handleChange('email', e.currentTarget.value)}
                    required
                    error={errors.email}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <DatePickerInput
                    label="Joining Date"
                    placeholder="Select joining date"
                    value={formValues.hire_date}
                    onChange={(date) => handleChange('hire_date', date)}
                    required
                    error={errors.hire_date}
                    valueFormat="DD/MM/YYYY"
                    minDate={new Date(2000, 0, 1)}
                    maxDate={new Date(2100, 0, 1)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Select employee joining date">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Department"
                    placeholder="Select department"
                    data={departmentList}
                    value={formValues.department}
                    onChange={(value) => handleChange('department', value)}
                    required
                    error={errors.department}
                    radius="md"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Role"
                    placeholder="Select role"
                    data={[
                      { value: 'developer', label: 'Developer' },
                      { value: 'manager', label: 'Manager' },
                      { value: 'designer', label: 'Designer' },
                    ]}
                    value={formValues.role}
                    onChange={(value) => handleChange('role', value)}
                    required
                    error={errors.role}
                    radius="md"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <MultiSelect
                    label="Shifts"
                    placeholder="Select shifts"
                    data={shiftList}
                    value={formValues.shiftIds}
                    onChange={(value) => handleChange('shiftIds', value)}
                    required
                    error={errors.shiftIds}
                    radius="md"
                    searchable
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Salary Type"
                    placeholder="Select salary type"
                    data={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                    ]}
                    value={formValues.salaryType}
                    onChange={(value) => handleChange('salaryType', value)}
                    required
                    error={errors.salaryType}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Salary Amount"
                    placeholder="Enter salary amount"
                    value={formValues.salary}
                    onChange={(value) => handleChange('salary', value)}
                    required
                    error={errors.salary}
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Group justify="apart" mb="md">
                <Title order={3} size={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}>
                  Additional Information
                </Title>
                <Badge color="blue" variant="light" size={getSize()}>
                  Optional
                </Badge>
              </Group>
              <Grid gutter={{ base: 5, sm: 'sm', md: 'md', lg: 'xl' }}>
                <Grid.Col span={12}>
                  <Textarea
                    label="Address"
                    placeholder="Enter complete address"
                    value={formValues.address}
                    onChange={(e) => handleChange('address', e.currentTarget.value)}
                    minRows={isMobile ? 2 : 3}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Country"
                    placeholder="Select country"
                    data={countries}
                    value={formValues.country}
                    onChange={(value) => handleChange('country', value)}
                    error={errors.country}
                    radius="md"
                    rightSection={
                      <Tooltip label="Select the country of residence">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  {formValues.country === 'IN' ? (
                    <Select
                      label="State"
                      placeholder="Select state"
                      data={indianStates}
                      value={formValues.state}
                      onChange={(value) => handleChange('state', value)}
                      error={errors.state}
                      radius="md"
                      rightSection={
                        <Tooltip label="State will be auto-filled based on postal code">
                          <ActionIcon size="sm" variant="subtle">
                            <IconInfoCircle size={isMobile ? 12 : 16} />
                          </ActionIcon>
                        </Tooltip>
                      }
                    />
                  ) : (
                    <TextInput
                      label="State"
                      placeholder="Enter state"
                      value={formValues.state}
                      onChange={(e) => handleChange('state', e.currentTarget.value)}
                      error={errors.state}
                      radius="md"
                    />
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="Postal Code"
                    placeholder="Enter postal code"
                    value={formValues.postalCode}
                    onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                    error={errors.postalCode}
                    radius="md"
                    rightSection={
                      isLoadingCity ? (
                        <IconInfoCircle size={isMobile ? 12 : 16} className="animate-spin" />
                      ) : (
                        <Tooltip label="Enter 6-digit postal code">
                          <ActionIcon size="sm" variant="subtle">
                            <IconInfoCircle size={isMobile ? 12 : 16} />
                          </ActionIcon>
                        </Tooltip>
                      )
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="City"
                    placeholder="Enter city"
                    value={formValues.city}
                    onChange={(e) => handleChange('city', e.currentTarget.value)}
                    error={errors.city}
                    radius="md"
                    rightSection={
                      <Tooltip label="City will be auto-filled based on postal code">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <DatePickerInput
                    label="Date of Birth"
                    placeholder="Select date of birth"
                    value={formValues.dateOfBirth}
                    onChange={(date) => handleChange('dateOfBirth', date)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    data={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                    value={formValues.gender}
                    onChange={(value) => handleChange('gender', value)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="Blood Group"
                    placeholder="Enter blood group"
                    value={formValues.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.currentTarget.value)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="Emergency Contact"
                    placeholder="Enter emergency contact"
                    value={formValues.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.currentTarget.value)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="Emergency Contact Name"
                    placeholder="Enter emergency contact name"
                    value={formValues.emergencyName}
                    onChange={(e) => handleChange('emergencyName', e.currentTarget.value)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Reporting Manager"
                    placeholder="Enter reporting manager"
                    data={managerList}
                    value={formValues.reportingManagerId}
                    onChange={(value) => handleChange('reportingManagerId', value)}
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Group justify="apart" mb="md">
                <Title order={3} size={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}>
                  Bank Details
                </Title>
                <Badge color="blue" variant="light" size={getSize()}>
                  Optional
                </Badge>
              </Group>
              <Grid gutter={{ base: 5, sm: 'sm', md: 'md', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Bank Account Number"
                    placeholder="Enter bank account number"
                    value={formValues.bankAccountNumber}
                    onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                    radius="md"
                    required
                    error={errors.bankAccountNumber}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Confirm Bank Account Number"
                    placeholder="Re-enter bank account number"
                    value={formValues.confirmBankAccountNumber}
                    onChange={(e) => handleChange('confirmBankAccountNumber', e.currentTarget.value)}
                    radius="md"
                    required
                    error={errors.confirmBankAccountNumber}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Bank IFSC"
                    placeholder="Enter bank IFSC"
                    value={formValues.bankIfsc}
                    onChange={(e) => handleChange('bankIfsc', e.currentTarget.value)}
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Bank Name"
                    placeholder="Enter bank name"
                    value={formValues.bankName}
                    onChange={(e) => handleChange('bankName', e.currentTarget.value)}
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Group justify="apart" mb="md">
                <Title order={3} size={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}>
                  Documents
                </Title>
                <Badge color="gray" variant="light" size={getSize()}>
                  Optional
                </Badge>
              </Group>
              <Grid gutter={{ base: 5, sm: 'sm', md: 'md', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Educational Documents"
                    placeholder="Upload educational documents"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(files) => handleFileChange('educationalDocs', files)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Upload certificates, degrees, etc.">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Professional Documents"
                    placeholder="Upload professional documents"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(files) => handleFileChange('professionalDocs', files)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Upload work experience, certifications, etc.">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Identity Documents"
                    placeholder="Upload identity documents"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(files) => handleFileChange('identityDocs', files)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Upload PAN card, Aadhaar card, etc.">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Address Documents"
                    placeholder="Upload address documents"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(files) => handleFileChange('addressDocs', files)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Upload utility bills, rent agreement, etc.">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Other Documents"
                    placeholder="Upload other documents"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(files) => handleFileChange('otherDocs', files)}
                    radius="md"
                    rightSection={
                      <Tooltip label="Upload any other relevant documents">
                        <ActionIcon size="sm" variant="subtle">
                          <IconInfoCircle size={isMobile ? 12 : 16} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Group justify="apart" mb="md">
                <Title order={3} size={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}>
                  Role and Status
                </Title>
                <Badge color="blue" variant="light" size={getSize()}>
                  Optional
                </Badge>
              </Group>
              <Grid gutter={{ base: 5, sm: 'sm', md: 'md', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Status"
                    placeholder="Select status"
                    data={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    value={formValues.status}
                    onChange={(value) => handleChange('status', value)}
                    required
                    error={errors.status}
                    radius="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Group justify="apart" mt="xl" gap="xs">
              <Button
                variant="light"
                color="red"
                onClick={handleCancel}
                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                size={getSize()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                color="blue"
                size={getSize()}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
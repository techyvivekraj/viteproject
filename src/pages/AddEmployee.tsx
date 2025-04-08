import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stepper,
  Select,
  MultiSelect,
  NumberInput,
  Textarea,
  FileInput,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconUser,
  IconAddressBook,
  IconBuildingBank,
  IconFileText,
  IconInfoCircle,
  IconUpload,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
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
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    joiningDate: null,
    departmentId: '',
    role: '',
    shiftIds: [] as string[],
    salaryType: '',
    salary: '',
    address: '',
    country: '',
    state: '',
    postalCode: '',
    city: '',
    dateOfBirth: null,
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

  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: string, files: File[]) => {
    console.log(`Files selected for ${field}:`, files);
  };

  const nextStep = () => setActive(current => Math.min(current + 1, 3));
  const prevStep = () => setActive(current => Math.max(current - 1, 0));

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
      setErrors({ general: 'Failed to save employee' });
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

  const roleList = [
    { value: 'developer', label: 'Developer' },
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
      <Stack gap="md">
        <Group justify="space-between" mb="md" wrap="wrap">
          <Stack gap={0}>
            <Title order={2} size={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}>
              Add New Employee
            </Title>
            <Text color="dimmed" size={isMobile ? 'xs' : 'sm'}>
              Fill in the employee details below
            </Text>
          </Stack>
          <Group gap="xs" grow={false}>
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
              {loading ? 'Saving...' : 'Save Employee'}
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

        <Stepper
          active={active}
          onStepClick={setActive}
          mb="xl"
          orientation="horizontal"
          size={getSize()}
        >
          <Stepper.Step label="Basic Info" icon={<IconUser size={isMobile ? 14 : 18} />} />
          <Stepper.Step label="Additional" icon={<IconAddressBook size={isMobile ? 14 : 18} />} />
          <Stepper.Step label="Bank" icon={<IconBuildingBank size={isMobile ? 14 : 18} />} />
          <Stepper.Step label="Docs" icon={<IconFileText size={isMobile ? 14 : 18} />} />
        </Stepper>

        <form id="employee-form" onSubmit={onSubmit}>
          <Stack gap="md">
            {active === 0 && (
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md" wrap="wrap">
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
                      value={formValues.firstName}
                      onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                      required
                      error={errors.firstName}
                      radius="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <TextInput
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formValues.lastName}
                      onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                      required
                      error={errors.lastName}
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
                    <DateInput
                      label="Joining Date"
                      placeholder="Select joining date"
                      value={formValues.joiningDate}
                      onChange={(date) => handleChange('joiningDate', date)}
                      required
                      error={errors.joiningDate}
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
                      value={formValues.departmentId}
                      onChange={(value) => handleChange('departmentId', value)}
                      required
                      error={errors.departmentId}
                      radius="md"
                      clearable
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Select
                      label="Role"
                      placeholder="Select role"
                      data={roleList}
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
            )}

            {active === 1 && (
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md" wrap="wrap">
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
                    <DateInput
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
            )}

            {active === 2 && (
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md" wrap="wrap">
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
            )}

            {active === 3 && (
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md" wrap="wrap">
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
                      leftSection={<IconUpload size={isMobile ? 12 : 14} />}
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
                      leftSection={<IconUpload size={isMobile ? 12 : 14} />}
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
                      leftSection={<IconUpload size={isMobile ? 12 : 14} />}
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
                      leftSection={<IconUpload size={isMobile ? 12 : 14} />}
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
                      leftSection={<IconUpload size={isMobile ? 12 : 14} />}
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
            )}

            <Group justify="space-between" mt="xl" wrap="wrap" gap="xs">
              <Button
                variant="light"
                color="red"
                onClick={handleCancel}
                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                size={getSize()}
              >
                Cancel
              </Button>
              <Group gap="xs">
                {active > 0 && (
                  <Button
                    variant="light"
                    onClick={prevStep}
                    disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                    size={getSize()}
                  >
                    Previous
                  </Button>
                )}
                {active < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                    size={getSize()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="employee-form"
                    loading={loading}
                    disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                    color="blue"
                    size={getSize()}
                  >
                    {loading ? 'Saving...' : 'Save Employee'}
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
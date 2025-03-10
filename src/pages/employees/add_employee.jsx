import { memo, useEffect, useMemo, Suspense, useCallback, lazy } from 'react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
// import { ErrorBoundary } from '../../components/ErrorBoundary';
import DOMPurify from 'dompurify';
import { 
  Button, 
  Divider, 
  Group, 
  Paper, 
  Select, 
  SimpleGrid, 
  Textarea, 
  TextInput, 
  Title,
  Text,
  Stepper,
  Card,
  Tooltip,
  Progress,
  Stack,
  Container,
  Box,
  Badge,
  List,
  ActionIcon,
  Menu,
  rem,
  LoadingOverlay
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconLoader, IconInfoCircle, IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { BiSave } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../store/actions/organisation/dept';
import { fetchDesignations } from '../../store/actions/organisation/designation';
import { fetchShifts } from '../../store/actions/organisation/shift';

// Lazy load modals for better initial load performance
const AddDepartments = lazy(() => import('../organisation/departments/add_departments'));
const AddRoles = lazy(() => import('../organisation/roles/add_roles'));
const AddShift = lazy(() => import('../organisation/shift/add_shift'));

// Memoized form field components for better performance
const FormField = memo(({ label, required, children }) => (
  <div>
    <Group gap="xs" mb={4}>
      <Text size="sm" fw={500}>{label}</Text>
      {!required && <OptionalLabel />}
    </Group>
    {children}
  </div>
));

const OptionalLabel = memo(() => (
  <Badge size="sm" variant="light" color="gray">Optional</Badge>
));

const ValidationSummary = memo(({ showValidationSummary, missingFields }) => {
  if (!showValidationSummary || missingFields.length === 0) return null;

  return (
    <Card withBorder shadow="sm" radius="md" p="md" mt="md" bg="red.0">
      <Group align="flex-start" gap="sm">
        <IconAlertCircle size={20} color="red" />
        <div>
          <Text fw={500} c="red" size="sm">Please fill in all required fields:</Text>
          <List size="sm" c="red" mt={4}>
            {missingFields.map((field, index) => (
              <List.Item key={index}>{DOMPurify.sanitize(field)}</List.Item>
            ))}
          </List>
          <Text size="xs" c="dimmed" mt={8}>
            Go back to previous steps to fill in the missing information
          </Text>
        </div>
      </Group>
    </Card>
  );
});

const AddEmployee = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  const {
    formValues,
    errors,
    loading,
    active,
    confirmBankAccount,
    showValidationSummary,
    deptModalOpened,
    roleModalOpened,
    shiftModalOpened,
    deptModalHandlers,
    roleModalHandlers,
    shiftModalHandlers,
    genderOptions,
    bloodGroups,
    salaryTypes,
    countries,
    indianStates,
    departments,
    designations,
    shifts,
    handleChange,
    handleEmailChange,
    handlePhoneChange,
    handleBankAccountChange,
    handleConfirmBankAccountChange,
    handleSubmit,
    handleReset,
    nextStep,
    prevStep,
    calculateProgress,
    getMissingRequiredFields,
    setActive,
    submitAttempts,
    isSubmitDisabled
  } = useAddEmployee();

  const isLoadingDepartments = useSelector(state => state.departments.loading);

  // Memoize options to prevent unnecessary re-renders
  const departmentOptions = useMemo(() => [
    { value: '', label: 'Select Department' },
    ...(departments?.map(dept => ({
      value: dept.id.toString(),
      label: dept.name
    })) || []),
    { value: 'add', label: '+ Add New Department', group: 'Actions' }
  ], [departments]);

  const designationOptions = useMemo(() => [
    { value: '', label: 'Select Designation' },
    ...(designations?.map(role => ({
      value: role.id.toString(),
      label: role.name
    })) || []),
    { value: 'add', label: '+ Add New Designation', group: 'Actions' }
  ], [designations]);

  const shiftOptions = useMemo(() => [
    { value: '', label: 'Select Shift' },
    ...(shifts?.map(shift => ({
      value: shift.id.toString(),
      label: shift.name
    })) || []),
    { value: 'add', label: '+ Add New Shift', group: 'Actions' }
  ], [shifts]);

  // Memoized handlers
  const handleDepartmentChange = useCallback((value) => {
    if (value === 'add') {
      deptModalHandlers.open();
      return;
    }
    handleChange('departmentId', value || '');
  }, [deptModalHandlers, handleChange]);

  const handleDesignationChange = useCallback((value) => {
    if (value === 'add') {
      roleModalHandlers.open();
      return;
    }
    handleChange('designationId', value || '');
  }, [roleModalHandlers, handleChange]);

  const handleShiftChange = useCallback((value) => {
    if (value === 'add') {
      shiftModalHandlers.open();
      return;
    }
    handleChange('shiftId', value || '');
  }, [shiftModalHandlers, handleChange]);

  // Cleanup effect
  useEffect(() => {
    const controller = new AbortController();
    
    dispatch(fetchDepartments(organizationId));
    dispatch(fetchDesignations(organizationId));
    dispatch(fetchShifts(organizationId));

    return () => {
      controller.abort();
    };
  }, [dispatch, organizationId]);

  // Memoized step content components
  const BasicDetailsStep = useMemo(() => (
    <Card withBorder shadow="sm" radius="md" p="md" mt="md">
      <Text fw={500} size="lg" mb="sm" c="blue">Required Information</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <FormField label="First Name" required>
          <TextInput
            placeholder="Enter first name"
            required
            rightSection={<IconInfoCircle size={16} color="gray" />}
            value={formValues.firstName}
            onChange={(e) => handleChange('firstName', DOMPurify.sanitize(e.target.value))}
            error={errors.firstName}
          />
        </FormField>
        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          required
          value={formValues.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={errors.lastName}
        />
        <TextInput
          label="Phone"
          placeholder="Enter 10-digit phone number"
          required
          value={formValues.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          error={errors.phone}
          rightSection={
            <Tooltip label="Enter 10-digit number without spaces or special characters">
              <IconInfoCircle size={16} color="gray" />
            </Tooltip>
          }
        />
        <TextInput
          label="Email"
          required
          placeholder="Enter email address"
          value={formValues.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          error={errors.email}
          rightSection={
            <Tooltip label="Enter a valid email address">
              <IconInfoCircle size={16} color="gray" />
            </Tooltip>
          }
        />
        <DateInput
          label="Joining Date"
          placeholder="Select joining date"
          required
          value={formValues.joiningDate}
          onChange={(value) => handleChange('joiningDate', value)}
          error={errors.joiningDate}
        />
      </SimpleGrid>
    </Card>
  ), [formValues, errors, handleChange, handleEmailChange, handlePhoneChange]);

  const WorkDetailsStep = useMemo(() => (
    <Card withBorder shadow="sm" radius="md" p="md" mt="md">
      <Text fw={500} size="lg" mb="sm" c="gray.7">Work Information</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <Select
          label="Department"
          placeholder="Select department"
          // data={departmentOptions}
          // value={formValues.departmentId}
          onChange={handleDepartmentChange}
          error={errors.departmentId}
          searchable
          clearable
        />
        <Select
          label="Designation"
          placeholder="Select designation"
          // data={designationOptions}
          // value={formValues.designationId}
          onChange={handleDesignationChange}
          error={errors.designationId}
          searchable
          clearable
        />
        <Select
          label="Shift"
          placeholder="Select shift"
          // data={shiftOptions}
          // value={formValues.shiftId}
          onChange={handleShiftChange}
          error={errors.shiftId}
          searchable
          clearable
        />
        <Select
          label="Reporting Manager"
          placeholder="Select reporting manager"
          data={[
            { value: '', label: 'Select Reporting Manager' },
            { value: '1', label: 'John Doe' },
            { value: '2', label: 'Jane Smith' }
          ]}
          value={formValues.reportingManagerId}
          onChange={(value) => handleChange('reportingManagerId', value)}
          clearable
        />
        <Select
          label="Project Manager"
          placeholder="Select project manager"
          data={[
            { value: '', label: 'Select Project Manager' },
            { value: '1', label: 'Alice Johnson' },
            { value: '2', label: 'Bob Wilson' }
          ]}
          value={formValues.projectManagerId}
          onChange={(value) => handleChange('projectManagerId', value)}
          clearable
        />
        <Select
          label="Salary Type"
          placeholder="Select salary type"
          data={salaryTypes}
          value={formValues.salaryType}
          onChange={(value) => handleChange('salaryType', value)}
          clearable
        />
      </SimpleGrid>
    </Card>
  ), [formValues, errors, departmentOptions, designationOptions, shiftOptions, handleDepartmentChange, handleDesignationChange, handleShiftChange, handleChange, salaryTypes]);

  return (
    // <ErrorBoundary>
      <Container size="xl">
        <Paper radius="md" p="xl" withBorder shadow="sm">
          <LoadingOverlay visible={loading} />
          <Stack spacing="xl">
            <Box>
              <Title order={2} size="h3" mb="xs">Add Employee</Title>
              <Progress value={calculateProgress()} size="sm" mb="md" color="blue" />
            </Box>

            {active === 4 && <ValidationSummary showValidationSummary={showValidationSummary} missingFields={getMissingRequiredFields()} />}

            <Stepper active={active} onStepClick={(step) => setActive(step)} breakpoint="sm">
              <Stepper.Step label="Basic details" description="Required">
                {BasicDetailsStep}
              </Stepper.Step>

              <Stepper.Step label="Personal Info" description="(Optional)">
                <Card withBorder shadow="sm" radius="md" p="md" mt="md">
                  <Group justify="space-between" mb="sm">
                    <Text fw={500} size="lg" c="gray.7">Personal Information</Text>
                    <Text size="sm" c="dimmed">All fields in this section are optional</Text>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    <TextInput
                      label={
                        <Group gap="xs">
                          <Text>Middle Name</Text>
                          <OptionalLabel />
                        </Group>
                      }
                      placeholder="Enter middle name"
                      value={formValues.middleName}
                      onChange={(e) => handleChange('middleName', e.target.value)}
                    />
                    <DateInput
                      label="Date of Birth"
                      placeholder="Select date of birth"
                      value={formValues.dateOfBirth}
                      onChange={(value) => handleChange('dateOfBirth', value)}
                      error={errors.dateOfBirth}
                    />
                    <TextInput
                      label="Employee Code"
                      placeholder="Enter employee code"
                      value={formValues.employeeCode}
                      onChange={(e) => handleChange('employeeCode', e.target.value)}
                      error={errors.employeeCode}
                    />
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      data={genderOptions}
                      value={formValues.gender}
                      onChange={(value) => handleChange('gender', value)}
                      error={errors.gender}
                    />
                    <Select
                      label="Blood Group"
                      placeholder="Select blood group"
                      data={[
                        { value: '', label: 'Select Blood Group' },
                        ...bloodGroups
                      ]}
                      value={formValues.bloodGroup}
                      onChange={(value) => handleChange('bloodGroup', value)}
                    />
                  </SimpleGrid>
                </Card>
              </Stepper.Step>

              <Stepper.Step label="Contact" description="(Optional)">
                <Card withBorder shadow="sm" radius="md" p="md" mt="md">
                  <Text fw={500} size="lg" mb="sm" c="gray.7">Contact Information</Text>
                  <SimpleGrid cols={1} spacing="md">
                    <Textarea
                      label="Address"
                      placeholder="Enter address"
                      value={formValues.addresss}
                      onChange={(e) => handleChange('addresss', e.target.value)}
                      error={errors.addresss}
                      minRows={2}
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                      <Select
                        label="Country"
                        placeholder="Select country"
                        data={countries}
                        value={formValues.country || 'IN'}
                        onChange={(value) => handleChange('country', value)}
                        error={errors.country}
                      />
                      {formValues.country === 'IN' ? (
                        <Select
                          label="State"
                          placeholder="Select state"
                          data={indianStates}
                          value={formValues.statee}
                          onChange={(value) => handleChange('statee', value)}
                        />
                      ) : (
                        <TextInput
                          label="State/Province/Region"
                          placeholder="Enter state/province/region"
                          value={formValues.statee}
                          onChange={(e) => handleChange('statee', e.target.value)}
                        />
                      )}
                      <TextInput
                        label="Postal Code"
                        placeholder="Enter postal code"
                        value={formValues.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                      />
                    </SimpleGrid>
                  </SimpleGrid>
                </Card>
              </Stepper.Step>

              <Stepper.Step label="Work Details" description="(Optional)">
                {WorkDetailsStep}
              </Stepper.Step>

              <Stepper.Step label="Bank Details" description="(Optional)">
                <Card withBorder shadow="sm" radius="md" p="md" mt="md">
                  <Text fw={500} size="lg" mb="sm" c="gray.7">Bank Details</Text>
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="lg">
                    <TextInput
                      label="Bank Account Number"
                      placeholder="Enter bank account number"
                      value={formValues.bankAccountNumber}
                      onChange={(e) => handleBankAccountChange(e.target.value)}
                      error={errors.bankAccountNumber}
                    />
                    <TextInput
                      label="Confirm Bank Account Number"
                      placeholder="Re-enter bank account number"
                      value={confirmBankAccount}
                      onChange={(e) => handleConfirmBankAccountChange(e.target.value)}
                      error={errors.bankAccountConfirm}
                    />
                    <TextInput
                      label={
                        <Group gap="xs">
                          <Text>Bank IFSC Code</Text>
                          <OptionalLabel />
                        </Group>
                      }
                      placeholder="Enter IFSC code"
                      value={formValues.bankIfscCode}
                      onChange={(e) => handleChange('bankIfscCode', e.target.value.toUpperCase())}
                    />
                  </SimpleGrid>
                </Card>
              </Stepper.Step>
            </Stepper>

            <Group justify="space-between" mt="xl">
              <Button 
                variant="light"
                onClick={prevStep}
                disabled={active === 0}
              >
                Back
              </Button>

              <Group>
                <Button 
                  variant="light" 
                  color="red" 
                  onClick={handleReset}
                >
                  Reset
                </Button>

                {active === 4 ? (
                  <Button 
                    onClick={handleSubmit}
                    leftSection={<BiSave size={14} />} 
                    variant='filled' 
                    color='green'
                    disabled={loading || isSubmitDisabled}
                  >
                    {loading ? <IconLoader /> : 'Save Employee'}
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    variant="filled"
                  >
                    Next Step
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </Paper>

        <Suspense fallback={<LoadingOverlay visible />}>
          {/* Modals */}
          <AddDepartments 
            opened={deptModalOpened} 
            closeModal={deptModalHandlers.close}
            onSuccess={() => {
              deptModalHandlers.close();
              dispatch(fetchDepartments(organizationId));
            }}
          />

          <AddRoles 
            opened={roleModalOpened} 
            closeModal={roleModalHandlers.close}
            onSuccess={() => {
              roleModalHandlers.close();
              dispatch(fetchDesignations(organizationId));
            }}
          />

          <AddShift 
            opened={shiftModalOpened} 
            closeModal={shiftModalHandlers.close}
            onSuccess={() => {
              shiftModalHandlers.close();
              dispatch(fetchShifts(organizationId));
            }}
          />
        </Suspense>
      </Container>
    // </ErrorBoundary>
  );
};

export default memo(AddEmployee);

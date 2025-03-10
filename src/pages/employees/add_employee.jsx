import { 
  TextInput, 
  Button, 
  Group, 
  Select, 
  Box, 
  Title, 
  Paper,
  Text,
  Stepper,
  rem,
  ActionIcon,
  Grid,
  Tooltip,
  Divider
} from '@mantine/core';
import { 
  IconUserPlus, 
  IconBriefcase, 
  IconAddressBook, 
  IconBuildingBank,
  IconChevronLeft,
  IconMail,
  IconPhone,
  IconId,
  IconCalendar,
  IconRefresh
} from '@tabler/icons-react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
import { DateInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' }
];

export default function AddEmployee() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const {
    formValues,
    errors,
    loading,
    departmentList,
    designationList,
    shiftList,
    handleChange,
    handleSubmit: onSubmit
  } = useAddEmployee(() => navigate('/employees'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  const nextStep = () => setActive((current) => Math.min(current + 1, 3));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  const resetSection = (fields) => {
    fields.forEach(field => handleChange(field, ''));
  };

  return (
    <Paper radius="md" p="md" m={{ sm: 'xs' }}>   
      {/* Header */}
      <Box>
        <Group justify="space-between" align="center" mb="md">
          <Group>
            <ActionIcon 
              variant="light" 
              size="lg" 
              onClick={() => navigate('/employees')}
              title="Back to Employees"
            >
              <IconChevronLeft style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
            <div>
              <Title order={2}>Add New Employee</Title>
              <Text c="dimmed" size="sm">Create a new employee profile</Text>
            </div>
          </Group>
        </Group>

        <form onSubmit={handleSubmit}>
          <Stepper 
            active={active} 
            onStepClick={setActive}
            breakpoint="sm"
            allowNextStepsSelect={false}
            mb="md"
          >
            {/* Required Information */}
            <Stepper.Step
              label="Required Information"
              description="Basic details"
              icon={<IconUserPlus style={{ width: rem(18), height: rem(18) }} />}
            >
              <Box p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Required Information</Title>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => resetSection([
                      'firstName', 'lastName', 'phone', 'email',
                      'joiningDate', 'departmentId', 'designationId', 'shiftId'
                    ])}
                  >
                    Reset Fields
                  </Button>
                </Group>
                
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="First Name"
                      placeholder="Enter first name"
                      value={formValues.firstName}
                      onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                      required
                      error={errors.firstName}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Middle Name"
                      placeholder="Enter middle name"
                      value={formValues.middleName}
                      onChange={(e) => handleChange('middleName', e.currentTarget.value)}
                      error={errors.middleName}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formValues.lastName}
                      onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                      required
                      error={errors.lastName}
                    />
                  </Grid.Col>
                </Grid>

                <Grid mt="xs">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Phone"
                      placeholder="Enter phone number"
                      value={formValues.phone}
                      onChange={(e) => handleChange('phone', e.currentTarget.value)}
                      required
                      error={errors.phone}
                      icon={<IconPhone size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Email"
                      placeholder="Enter email"
                      value={formValues.email}
                      onChange={(e) => handleChange('email', e.currentTarget.value)}
                      required
                      error={errors.email}
                      icon={<IconMail size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <DateInput
                      label="Joining Date"
                      placeholder="Select joining date"
                      value={formValues.joiningDate ? new Date(formValues.joiningDate) : null}
                      onChange={(value) => handleChange('joiningDate', value)}
                      required
                      error={errors.joiningDate}
                      icon={<IconCalendar size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Department"
                      placeholder="Select department"
                      data={departmentList}
                      value={formValues.departmentId}
                      onChange={(value) => handleChange('departmentId', value)}
                      required
                      error={errors.departmentId}
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Designation"
                      placeholder="Select designation"
                      value={formValues.designationId}
                      onChange={(value) => handleChange('designationId', value)}
                      data={designationList}
                      required
                      error={errors.designationId}
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Shift"
                      placeholder="Select shift"
                      value={formValues.shiftId}
                      onChange={(value) => handleChange('shiftId', value)}
                      data={shiftList}
                      required
                      error={errors.shiftId}
                      searchable
                    />
                  </Grid.Col>
                </Grid>

              </Box>
            </Stepper.Step>

            {/* Personal Details */}
            <Stepper.Step
              label="Personal Details"
              description="Additional information"
              icon={<IconBriefcase style={{ width: rem(18), height: rem(18) }} />}
            >
              <Box p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Personal Details</Title>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => resetSection([
                      'employeeCode', 'dateOfBirth', 'gender', 'bloodGroup'
                    ])}
                  >
                    Reset Fields
                  </Button>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Employee ID"
                      placeholder="Enter employee ID"
                      value={formValues.employeeCode}
                      onChange={(e) => handleChange('employeeCode', e.currentTarget.value)}
                      icon={<IconId size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <DateInput
                      label="Date of Birth"
                      placeholder="Select date of birth"
                      value={formValues.dateOfBirth ? new Date(formValues.dateOfBirth) : null}
                      onChange={(value) => handleChange('dateOfBirth', value)}
                      icon={<IconCalendar size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      data={genderOptions}
                      value={formValues.gender}
                      onChange={(value) => handleChange('gender', value)}
                    />
                  </Grid.Col>
                </Grid>

                <Grid mt="xs">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Blood Group"
                      placeholder="Select blood group"
                      data={bloodGroupOptions}
                      value={formValues.bloodGroup}
                      onChange={(value) => handleChange('bloodGroup', value)}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </Stepper.Step>

            {/* Address Information */}
            <Stepper.Step
              label="Address Details"
              description="Contact information"
              icon={<IconAddressBook style={{ width: rem(18), height: rem(18) }} />}
            >
              <Box p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Address Information</Title>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => resetSection([
                      'address', 'country', 'state', 'postalCode', 'reportingManagerId'
                    ])}
                  >
                    Reset Fields
                  </Button>
                </Group>

                <TextInput
                  label="Address"
                  placeholder="Enter complete address"
                  value={formValues.address}
                  onChange={(e) => handleChange('address', e.currentTarget.value)}
                />

                <Grid mt="xs">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Country"
                      placeholder="Enter country"
                      value={formValues.country}
                      onChange={(e) => handleChange('country', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="State"
                      placeholder="Enter state"
                      value={formValues.state}
                      onChange={(e) => handleChange('state', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Postal Code"
                      placeholder="Enter postal code"
                      value={formValues.postalCode}
                      onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                    />
                  </Grid.Col>
                </Grid>

                <Grid mt="xs">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Reporting Manager"
                      placeholder="Select reporting manager"
                      value={formValues.reportingManagerId}
                      onChange={(value) => handleChange('reportingManagerId', value)}
                      data={[]} // This will be populated from API
                      searchable
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </Stepper.Step>

            {/* Bank Details */}
            <Stepper.Step
              label="Bank Details"
              description="Financial information"
              icon={<IconBuildingBank style={{ width: rem(18), height: rem(18) }} />}
            >
              <Box p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Bank Information</Title>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => resetSection([
                      'bankAccountNumber', 'bankIfscCode'
                    ])}
                  >
                    Reset Fields
                  </Button>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Bank Account Number"
                      placeholder="Enter account number"
                      value={formValues.bankAccountNumber}
                      onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Tooltip label="IFSC code format: ABCD0123456">
                      <TextInput
                        label="IFSC Code"
                        placeholder="Enter IFSC code"
                        value={formValues.bankIfscCode}
                        onChange={(e) => handleChange('bankIfscCode', e.currentTarget.value)}
                        error={errors.bankIfscCode}
                      />
                    </Tooltip>
                  </Grid.Col>
                </Grid>
              </Box>
            </Stepper.Step>
          </Stepper>

          {/* Footer Actions */}
          <Paper 
            p="md" 
            style={{ 
              position: 'sticky', 
              bottom: 0, 
              background: 'white', 
              borderTop: '1px solid #eee',
              marginTop: '1rem'
            }}
          >
            <Group justify="space-between">
              <Group>
                <Button 
                  variant="default" 
                  onClick={prevStep}
                  disabled={active === 0}
                >
                  Back
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
              </Group>
              {active === 3 ? (
                <Button 
                  type="submit" 
                  loading={loading}
                >
                  Save Employee
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next Step
                </Button>
              )}
            </Group>
          </Paper>
        </form>
      </Box>
    </Paper>
  );
}

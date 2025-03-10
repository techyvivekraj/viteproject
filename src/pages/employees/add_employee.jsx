import { TextInput, Button, Group, Select, Divider, Box, Card, Container, Title } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
import { DateInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Container size="xl" py="xl">
      <Box mb="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Add New Employee</Title>
          <Group>
            <Button variant="light" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Save Employee
            </Button>
          </Group>
        </Group>
      </Box>

      {errors.general && (
        <Box mb="md" style={{ color: 'red' }}>{errors.general}</Box>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <Card withBorder shadow="sm" radius="md" mb="lg">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={3}>Basic Information</Title>
          </Card.Section>
          
          <Box p="md">
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                value={formValues.firstName}
                onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                required
                error={errors.firstName}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                value={formValues.lastName}
                onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                required
                error={errors.lastName}
              />
            </Group>

            <Group grow mt="md">
              <TextInput
                label="Phone"
                placeholder="Enter phone number"
                value={formValues.phone}
                onChange={(e) => handleChange('phone', e.currentTarget.value)}
                required
                error={errors.phone}
              />
              <TextInput
                label="Email"
                placeholder="Enter email"
                value={formValues.email}
                onChange={(e) => handleChange('email', e.currentTarget.value)}
                required
                error={errors.email}
              />
            </Group>

            <Group grow mt="md">
              <TextInput
                label="Employee ID"
                placeholder="Enter employee ID"
                value={formValues.employeeCode}
                onChange={(e) => handleChange('employeeCode', e.currentTarget.value)}
              />
              <DateInput
                label="Date of Birth"
                placeholder="Select date"
                value={formValues.dateOfBirth ? new Date(formValues.dateOfBirth) : null}
                onChange={(value) => handleChange('dateOfBirth', value)}
              />
            </Group>

            <Group grow mt="md">
              <Select
                label="Gender"
                placeholder="Select gender"
                data={genderOptions}
                value={formValues.gender}
                onChange={(value) => handleChange('gender', value)}
              />
              <Select
                label="Blood Group"
                placeholder="Select blood group"
                data={bloodGroupOptions}
                value={formValues.bloodGroup}
                onChange={(value) => handleChange('bloodGroup', value)}
              />
            </Group>
          </Box>
        </Card>

        {/* Employment Details Section */}
        <Card withBorder shadow="sm" radius="md" mb="lg">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={3}>Employment Details</Title>
          </Card.Section>
          
          <Box p="md">
            <Group grow>
              <DateInput
                label="Joining Date"
                placeholder="Select date"
                value={formValues.joiningDate ? new Date(formValues.joiningDate) : null}
                onChange={(value) => handleChange('joiningDate', value)}
                required
                error={errors.joiningDate}
              />
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
            </Group>

            <Group grow mt="md">
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
            </Group>
          </Box>
        </Card>

        {/* Contact Details Section */}
        <Card withBorder shadow="sm" radius="md" mb="lg">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={3}>Contact Details</Title>
          </Card.Section>
          
          <Box p="md">
            <TextInput
              label="Address"
              placeholder="Enter address"
              value={formValues.address}
              onChange={(e) => handleChange('address', e.currentTarget.value)}
            />

            <Group grow mt="md">
              <TextInput
                label="Country"
                placeholder="Enter country"
                value={formValues.country}
                onChange={(e) => handleChange('country', e.currentTarget.value)}
              />
              <TextInput
                label="State"
                placeholder="Enter state"
                value={formValues.state}
                onChange={(e) => handleChange('state', e.currentTarget.value)}
              />
              <TextInput
                label="Postal Code"
                placeholder="Enter postal code"
                value={formValues.postalCode}
                onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
              />
            </Group>
          </Box>
        </Card>

        {/* Bank Details Section */}
        <Card withBorder shadow="sm" radius="md" mb="lg">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={3}>Bank Details</Title>
          </Card.Section>
          
          <Box p="md">
            <Group grow>
              <TextInput
                label="Bank Account Number"
                placeholder="Enter bank account number"
                value={formValues.bankAccountNumber}
                onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
              />
              <TextInput
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={formValues.bankIfscCode}
                onChange={(e) => handleChange('bankIfscCode', e.currentTarget.value)}
              />
            </Group>
          </Box>
        </Card>

        <Group justify="center" mt="xl">
          <Button variant="light" size="md" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
          <Button type="submit" size="md" loading={loading}>
            Save Employee
          </Button>
        </Group>
      </form>
    </Container>
  );
}

import { memo } from 'react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
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
  Text
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconLoader } from '@tabler/icons-react';
import { BiSave } from 'react-icons/bi';

const AddEmployee = () => {
  const {
    formValues,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleReset,
  } = useAddEmployee();

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
  ];

  // const salaryTypes = [
  //   { value: 'monthly', label: 'Monthly' },
  //   { value: 'daily', label: 'Daily' },
  //   { value: 'hourly', label: 'Hourly' },
  // ];

  const countries = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    // Add more countries as needed
  ];

  const indianStates = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ];

  // const initialFormValues = {
  //   // ... other initial values ...
  //   country: 'IN', // Set India as default
  //   // ... rest of the values
  // };

  return (
    <Paper radius="md" p="lg" m={{ sm: 'xs' }}>
      <Title order={2} size="h3" mb="md">Add Employee</Title>
      
      {/* Required Fields Section */}
      <Text fw={500} size="lg" mb="sm" c="blue">Required Information</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'md' }}>
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          required
          value={formValues.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={errors.firstName}
        />
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
          placeholder="Enter phone number"
          required
          value={formValues.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />
         <TextInput
          label="Email"
          required
          placeholder="Enter email address"
          value={formValues.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />
        <DateInput
          label="Joining Date"
          placeholder="Select joining date"
          required
          value={formValues.joiningDate}
          onChange={(value) => handleChange('joiningDate', value)}
          error={errors.joiningDate}
        />
        <Select
          label="Department"
          placeholder="Select department"
          required
          data={[
            { value: '', label: 'Select Department' },
            { value: '1', label: 'IT' },
            { value: '2', label: 'HR' },
            { value: '3', label: 'Finance' },
            { value: '4', label: 'Marketing' }
          ]}
          value={formValues.departmentId}
          onChange={(value) => handleChange('departmentId', value)}
          error={errors.departmentId}
        />
      </SimpleGrid>

      {/* Optional Fields Section */}
      <Text fw={500} size="lg" mt="xl" mb="sm" c="gray.7">Additional Information</Text>
      
      {/* Personal Information */}
      <Divider my="md" variant='dashed' label="Personal Details" labelPosition="center" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'md' }}>
        <TextInput
          label="Middle Name"
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

      {/* Address Information */}
      <Divider my="md" variant='dashed' label="Address Information" labelPosition="center" />
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
          data={[
            { value: '', label: 'Select Country' },
            ...countries
          ]}
          value={formValues.country || 'IN'}
          onChange={(value) => handleChange('country', value)}
          error={errors.country}
        />
          {formValues.country === 'IN' ? (
            <Select
              label="State"
              placeholder="Select state"
              data={[
                { value: '', label: 'Select State' },
                ...indianStates
              ]}
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

      {/* Emergency Contact */}
      <Divider my="md" variant='dashed' label="Emergency Contact" labelPosition="center" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing={{ base: 10, sm: 'md' }}>
        <TextInput
          label="Emergency Contact Name"
          placeholder="Enter emergency contact name"
          value={formValues.emergencyContactName}
          onChange={(e) => handleChange('emergencyContactName', e.target.value)}
        />
        <TextInput
          label="Emergency Contact Phone"
          placeholder="Enter emergency contact phone"
          value={formValues.emergencyContactPhone}
          onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
        />
      </SimpleGrid>

      {/* Work Information */}
      <Divider my="md" variant='dashed' label="Additional Work Information" labelPosition="center" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 10, sm: 'md' }}>
        <Select
          label="Designation"
          placeholder="Select designation"
          data={[
            { value: '', label: 'Select Designation' },
            { value: '1', label: 'Software Engineer' },
            { value: '2', label: 'Senior Engineer' },
            { value: '3', label: 'Team Lead' },
            { value: '4', label: 'Manager' }
          ]}
          value={formValues.designationId}
          onChange={(value) => handleChange('designationId', value)}
        />
        <Select
          label="Shift"
          placeholder="Select shift"
          data={[
            { value: '', label: 'Select Shift' },
            { value: '1', label: 'Morning (9 AM - 6 PM)' },
            { value: '2', label: 'Evening (2 PM - 11 PM)' },
            { value: '3', label: 'Night (10 PM - 7 AM)' }
          ]}
          value={formValues.shiftId}
          onChange={(value) => handleChange('shiftId', value)}
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
        />
      </SimpleGrid>

      {/* Bank Details */}
      <Divider my="md" variant='dashed' label="Bank Details" labelPosition="center" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing={{ base: 10, sm: 'md' }}>
        <TextInput
          label="Bank Account Number"
          placeholder="Enter bank account number"
          value={formValues.bankAccountNumber}
          onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
        />
        <TextInput
          label="Bank IFSC Code"
          placeholder="Enter IFSC code"
          value={formValues.bankIfscCode}
          onChange={(e) => handleChange('bankIfscCode', e.target.value.toUpperCase())}
        />
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Button 
          onClick={handleSubmit} 
          leftSection={<BiSave size={14} />} 
          variant='light' 
          color='green' 
          mt="md" 
          disabled={loading}
        >
          {loading ? <IconLoader /> : 'Save'}
        </Button>
        <Button 
          variant="light" 
          color="red" 
          onClick={handleReset} 
          mt='md'
        >
          Reset
        </Button>
      </Group>
    </Paper>
  );
};

export default memo(AddEmployee);

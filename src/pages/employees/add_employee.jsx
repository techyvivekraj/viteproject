import { 
  TextInput, 
  Button, 
  Group, 
  Select, 
  Title, 
  Paper,
  Stepper,
  rem,
  ActionIcon,
  Alert,
  Grid,
  Card,
  Textarea,
  NumberInput,
  Text,
  FileInput
} from '@mantine/core';
import { 
  IconUserPlus, 
  IconAddressBook, 
  IconChevronLeft,
  IconAlertCircle,
  IconFileUpload,
  IconUpload,
  IconX
} from '@tabler/icons-react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
import { DateInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showError } from '../../components/api';

// Constants
const MAX_FILES_PER_CATEGORY = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function AddEmployee() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const {
    formValues,
    errors,
    setErrors,
    loading,
    departmentList,
    designationList,
    shiftList,
    managerList,
    handleChange,
    handleSubmit: onSubmit,
    handleDocumentChange,
    removeDocument,
    genderOptions,
    bloodGroupOptions,
    countryOptions,
    indianStates,
    salaryTypeOptions
  } = useAddEmployee(() => navigate('/employees'));

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate all steps before submitting
    const allErrors = {};
    
    // Temporarily set active to each step and validate
    const originalActive = active;
    
    // Validate step 0
    setActive(0);
    const step0Errors = validateCurrentStep();
    Object.assign(allErrors, step0Errors);
    
    // Validate step 1
    setActive(1);
    const step1Errors = validateCurrentStep();
    Object.assign(allErrors, step1Errors);
    
    // Validate step 2
    setActive(2);
    const step2Errors = validateCurrentStep();
    Object.assign(allErrors, step2Errors);
    
    // Restore original active step
    setActive(originalActive);
    
    if (Object.keys(allErrors).length > 0) {
      // Set errors to display to the user
      setErrors(prev => ({ ...prev, ...allErrors }));
      
      // Show the first error as a toast for better visibility
      const firstError = Object.values(allErrors)[0];
      showError(firstError);
      
      // Navigate to the first step with errors
      if (Object.keys(step0Errors).length > 0) {
        setActive(0);
      } else if (Object.keys(step1Errors).length > 0) {
        setActive(1);
      } else if (Object.keys(step2Errors).length > 0) {
        setActive(2);
      }
      
      return; // Don't submit if there are errors
    }
    
    // If no errors, submit the form
    console.log('Submitting form with all data:', formValues);
    await onSubmit();
  };

  const nextStep = (e) => {
    // Prevent form submission if this is triggered by a button click
    if (e) {
      e.preventDefault();
    }
    
    const currentStepErrors = validateCurrentStep();
    
    if (Object.keys(currentStepErrors).length > 0) {
      // Set errors to display to the user
      setErrors(prev => ({ ...prev, ...currentStepErrors }));
      
      // Show the first error as a toast for better visibility
      const firstError = Object.values(currentStepErrors)[0];
      showError(firstError);
      return; // Don't proceed if there are errors
    }
    
    // If no errors, proceed to next step
    setActive((current) => Math.min(current + 1, 2));
  };
  
  const prevStep = (e) => {
    // Prevent form submission if this is triggered by a button click
    if (e) {
      e.preventDefault();
    }
    setActive((current) => Math.max(current - 1, 0));
  };

  // Validate only the fields in the current step
  const validateCurrentStep = () => {
    const currentStepErrors = {};
    
    if (active === 0) {
      // Required information step - only validate fields that are truly required by the API
      if (!formValues.employeeCode?.trim()) currentStepErrors.employeeCode = 'Employee code is required';
      if (!formValues.firstName?.trim()) currentStepErrors.firstName = 'First name is required';
      if (!formValues.lastName?.trim()) currentStepErrors.lastName = 'Last name is required';
      if (!formValues.phone?.trim()) currentStepErrors.phone = 'Phone number is required';
      if (!formValues.email?.trim()) currentStepErrors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
        currentStepErrors.email = 'Invalid email address';
      }
      if (!formValues.joiningDate) currentStepErrors.joiningDate = 'Joining date is required';
      
      // Department, designation, and shift can be either a specific value or 'default'
      if (!formValues.departmentId) currentStepErrors.departmentId = 'Department is required';
      if (!formValues.designationId) currentStepErrors.designationId = 'Designation is required';
      if (!formValues.shiftId) currentStepErrors.shiftId = 'Shift is required';
      
      if (!formValues.salaryType) currentStepErrors.salaryType = 'Salary type is required';
      if (!formValues.salary) currentStepErrors.salary = 'Salary amount is required';
      else if (isNaN(formValues.salary) || Number(formValues.salary) <= 0) {
        currentStepErrors.salary = 'Please enter a valid salary amount';
      }
    } else if (active === 1) {
      // Additional details step - only validate format if a value is provided
      // Don't make these fields required
      
      // Only validate email format if provided
      if (formValues.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
        currentStepErrors.email = 'Invalid email address';
      }
      
      // Only validate phone format if provided
      if (formValues.phone && formValues.phone.trim().length < 6) {
        currentStepErrors.phone = 'Phone number is too short';
      }
      
      // Only validate postal code format if provided
      if (formValues.postalCode && formValues.postalCode.trim().length < 4) {
        currentStepErrors.postalCode = 'Postal code is too short';
      }
      
      // Only validate bank account format if provided
      if (formValues.bankAccountNumber && formValues.bankAccountNumber.trim().length < 8) {
        currentStepErrors.bankAccountNumber = 'Bank account number is too short';
      }
      
      // Only validate IFSC code format if provided
      if (formValues.bankIfscCode && formValues.bankIfscCode.trim().length < 8) {
        currentStepErrors.bankIfscCode = 'IFSC code is too short';
      }
    } else if (active === 2) {
      // Document validation
      Object.entries(formValues.documents).forEach(([category, files]) => {
        if (files.length > MAX_FILES_PER_CATEGORY) {
          currentStepErrors[`documents.${category}`] = `Maximum ${MAX_FILES_PER_CATEGORY} files allowed`;
        }
        
        // Check file sizes
        files.forEach(file => {
          if (file.size > MAX_FILE_SIZE) {
            currentStepErrors[`documents.${category}`] = `File ${file.name} exceeds maximum size of 5MB`;
          }
        });
      });
    }
    
    return currentStepErrors;
  };

  return (
    <Paper radius="md" p={{ base: "md", sm: "xl" }} maw={1200} mx="auto">
      <Group justify="space-between" align="center" mb="xl" wrap="wrap" gap="md">
        <Group>
          <ActionIcon 
            variant="light" 
            size="lg" 
            onClick={() => navigate('/employees')}
            title="Back to Employees"
          >
            <IconChevronLeft style={{ width: rem(20), height: rem(20) }} />
          </ActionIcon>
          <Title order={2} size={{ base: "h3", sm: "h2" }}>Add New Employee</Title>
        </Group>
        <Group>
          <Button variant="light" onClick={() => navigate('/employees')} type="button">
            Cancel
          </Button>
          <Button form="employee-form" type="submit" loading={loading}>
            Save Employee
          </Button>
        </Group>
      </Group>

      {errors.general && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" mb="xl">
          {errors.general}
        </Alert>
      )}

      <form id="employee-form" onSubmit={handleSubmit}>
        <Stepper 
          active={active} 
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
          mb="xl"
        >
          <Stepper.Step
            label="Required Information"
            description="Basic details"
            icon={<IconUserPlus size="1.2rem" />}
          >
            <Card withBorder radius="md" p="xl" mb="xl">
              <Grid gutter={{ base: "md", sm: "xl" }}>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Employee Code"
                    placeholder="EMP12345"
                    value={formValues.employeeCode}
                    onChange={(e) => handleChange('employeeCode', e.currentTarget.value)}
                    required
                    error={errors.employeeCode}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    value={formValues.firstName}
                    onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                    required
                    error={errors.firstName}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Middle Name"
                    placeholder="Doe"
                    value={formValues.middleName}
                    onChange={(e) => handleChange('middleName', e.currentTarget.value)}
                    error={errors.middleName}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    value={formValues.lastName}
                    onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                    required
                    error={errors.lastName}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <TextInput
                    label="Phone"
                    placeholder="+1 234 567 890"
                    value={formValues.phone}
                    onChange={(e) => handleChange('phone', e.currentTarget.value)}
                    required
                    error={errors.phone}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Email"
                    placeholder="john.doe@example.com"
                    value={formValues.email}
                    onChange={(e) => handleChange('email', e.currentTarget.value)}
                    required
                    error={errors.email}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <DateInput
                    label="Joining Date"
                    placeholder="Select date"
                    value={formValues.joiningDate ? new Date(formValues.joiningDate) : null}
                    onChange={(value) => handleChange('joiningDate', value)}
                    required
                    error={errors.joiningDate}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Department"
                    placeholder="Select department"
                    data={departmentList.length > 0 ? departmentList : [{ value: '', label: 'Loading departments...' }]}
                    value={formValues.departmentId}
                    onChange={(value) => handleChange('departmentId', value)}
                    required
                    error={errors.departmentId}
                    searchable
                    disabled={departmentList.length === 0}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Designation"
                    placeholder="Select designation"
                    data={designationList.length > 0 ? designationList : [{ value: '', label: 'Loading designations...' }]}
                    value={formValues.designationId}
                    onChange={(value) => handleChange('designationId', value)}
                    required
                    error={errors.designationId}
                    searchable
                    disabled={designationList.length === 0}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Shift"
                    placeholder="Select shift"
                    data={shiftList.length > 0 ? shiftList : [{ value: '', label: 'Loading shifts...' }]}
                    value={formValues.shiftId}
                    onChange={(value) => handleChange('shiftId', value)}
                    required
                    error={errors.shiftId}
                    searchable
                    disabled={shiftList.length === 0}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Reporting Manager"
                    placeholder="Select reporting manager"
                    data={managerList.length > 0 ? managerList : [{ value: '', label: 'Loading managers...' }]}
                    value={formValues.reportingManagerId}
                    onChange={(value) => handleChange('reportingManagerId', value)}
                    error={errors.reportingManagerId}
                    searchable
                    clearable
                    disabled={managerList.length === 0}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Salary Type"
                    placeholder="Select salary type"
                    data={salaryTypeOptions}
                    value={formValues.salaryType}
                    onChange={(value) => handleChange('salaryType', value)}
                    required
                    error={errors.salaryType}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <NumberInput
                    label="Salary Amount"
                    placeholder="Enter amount"
                    value={formValues.salary}
                    onChange={(value) => handleChange('salary', value)}
                    required
                    error={errors.salary}
                    min={0}
                    precision={2}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Additional Details"
            description="Contact & Bank info"
            icon={<IconAddressBook size="1.2rem" />}
          >
            <Card withBorder radius="md" p="xl" mb="xl">
              <Grid gutter={{ base: "md", sm: "xl" }}>
                <Grid.Col span={12}>
                  <Textarea
                    label="Address"
                    placeholder="Enter your complete address"
                    value={formValues.address}
                    onChange={(e) => handleChange('address', e.currentTarget.value)}
                    minRows={3}
                    error={errors.address}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Country"
                    placeholder="Select country"
                    data={countryOptions}
                    value={formValues.country}
                    onChange={(value) => {
                      handleChange('country', value);
                      handleChange('state', '');
                    }}
                    error={errors.country}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  {formValues.country === 'IN' ? (
                    <Select
                      label="State"
                      placeholder="Select state"
                      data={indianStates}
                      value={formValues.state}
                      onChange={(value) => handleChange('state', value)}
                      searchable
                      error={errors.state}
                    />
                  ) : (
                    <TextInput
                      label="State"
                      placeholder="Enter state/province"
                      value={formValues.state}
                      onChange={(e) => handleChange('state', e.currentTarget.value)}
                      error={errors.state}
                    />
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Postal Code"
                    placeholder="90001"
                    value={formValues.postalCode}
                    onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                    error={errors.postalCode}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <DateInput
                    label="Date of Birth"
                    placeholder="Select date"
                    value={formValues.dateOfBirth ? new Date(formValues.dateOfBirth) : null}
                    onChange={(value) => handleChange('dateOfBirth', value)}
                    error={errors.dateOfBirth}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    data={genderOptions}
                    value={formValues.gender}
                    onChange={(value) => handleChange('gender', value)}
                    error={errors.gender}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Blood Group"
                    placeholder="Select blood group"
                    data={bloodGroupOptions}
                    value={formValues.bloodGroup}
                    onChange={(value) => handleChange('bloodGroup', value)}
                    error={errors.bloodGroup}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Bank Account Number"
                    placeholder="1234567890"
                    value={formValues.bankAccountNumber}
                    onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                    error={errors.bankAccountNumber}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="IFSC Code"
                    placeholder="ABCD1234567"
                    value={formValues.bankIfscCode}
                    onChange={(e) => handleChange('bankIfscCode', e.currentTarget.value)}
                    error={errors.bankIfscCode}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Documents"
            description="Upload documents"
            icon={<IconFileUpload size="1.2rem" />}
          >
            <Card withBorder radius="md" p="xl" mb="xl">
              <Text size="sm" c="dimmed" mb="xl">
                Note: Maximum 5 files per category. Each file should be less than 5MB. Images will be automatically compressed if needed.
              </Text>
              <Grid gutter={{ base: "md", sm: "xl" }}>
                {['educational', 'professional', 'identity', 'address', 'others'].map((category) => (
                  <Grid.Col span={12} key={category}>
                    <Card withBorder p="sm">
                      <Group position="apart" mb="xs">
                        <Text size="sm" fw={500} transform="capitalize">
                          {category} Documents ({formValues.documents[category]?.length || 0}/5)
                        </Text>
                      </Group>
                      
                      {formValues.documents[category]?.length > 0 && (
                        <Group mb="sm" wrap="wrap">
                          {formValues.documents[category].map((file, index) => (
                            <Button 
                              key={index}
                              variant="light"
                              size="xs"
                              rightIcon={
                                <ActionIcon 
                                  size="xs" 
                                  color="red" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeDocument(category, index);
                                  }}
                                >
                                  <IconX size={rem(14)} />
                                </ActionIcon>
                              }
                            >
                              {file.name}
                            </Button>
                          ))}
                        </Group>
                      )}

                      <FileInput
                        placeholder={`Upload ${category} documents (${5 - (formValues.documents[category]?.length || 0)} remaining)`}
                        multiple
                        accept="application/pdf,image/*"
                        icon={<IconUpload size={rem(14)} />}
                        onChange={(files) => {
                          if (files) {
                            handleDocumentChange(category, files);
                          }
                        }}
                        error={errors[`documents.${category}`]}
                        disabled={formValues.documents[category]?.length >= 5}
                      />
                      {formValues.documents[category]?.length >= 5 && (
                        <Text size="xs" c="dimmed" mt="xs">
                          Maximum number of files reached
                        </Text>
                      )}
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Card>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button 
            variant="default" 
            onClick={prevStep}
            disabled={active === 0}
            type="button" // Explicitly set type to button to prevent form submission
          >
            Back
          </Button>
          {active === 2 ? (
            <Button type="submit" loading={loading}>
              Save Employee
            </Button>
          ) : (
            <Button onClick={nextStep} type="button"> {/* Explicitly set type to button */}
              Next
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
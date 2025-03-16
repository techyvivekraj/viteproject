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
    handleSubmit: onSubmit,
    genderOptions,
    bloodGroupOptions,
    countryOptions,
    indianStates,
    salaryTypeOptions
  } = useAddEmployee(() => navigate('/employees'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

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
          <Button variant="light" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Save Employee
          </Button>
        </Group>
      </Group>

      {errors.general && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" mb="xl">
          {errors.general}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
                    data={[{ value: '', label: 'Select department' }, ...departmentList]}
                    value={formValues.departmentId}
                    onChange={(value) => handleChange('departmentId', value)}
                    required
                    error={errors.departmentId}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Designation"
                    placeholder="Select designation"
                    data={[{ value: '', label: 'Select designation' }, ...designationList]}
                    value={formValues.designationId}
                    onChange={(value) => handleChange('designationId', value)}
                    required
                    error={errors.designationId}
                    searchable
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Shift"
                    placeholder="Select shift"
                    data={[{ value: '', label: 'Select shift' }, ...shiftList]}
                    value={formValues.shiftId}
                    onChange={(value) => handleChange('shiftId', value)}
                    required
                    error={errors.shiftId}
                    searchable
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
                    />
                  ) : (
                    <TextInput
                      label="State"
                      placeholder="Enter state/province"
                      value={formValues.state}
                      onChange={(e) => handleChange('state', e.currentTarget.value)}
                    />
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Postal Code"
                    placeholder="90001"
                    value={formValues.postalCode}
                    onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                  />
                </Grid.Col>
<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Employee ID"
                    placeholder="EMP12345"
                    value={formValues.employeeCode}
                    onChange={(e) => handleChange('employeeCode', e.currentTarget.value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <DateInput
                    label="Date of Birth"
                    placeholder="Select date"
                    value={formValues.dateOfBirth ? new Date(formValues.dateOfBirth) : null}
                    onChange={(value) => handleChange('dateOfBirth', value)}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    data={genderOptions}
                    value={formValues.gender}
                    onChange={(value) => handleChange('gender', value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    label="Blood Group"
                    placeholder="Select blood group"
                    data={bloodGroupOptions}
                    value={formValues.bloodGroup}
                    onChange={(value) => handleChange('bloodGroup', value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="Bank Account Number"
                    placeholder="1234567890"
                    value={formValues.bankAccountNumber}
                    onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    label="IFSC Code"
                    placeholder="ABCD1234567"
                    value={formValues.bankIfscCode}
                    onChange={(e) => handleChange('bankIfscCode', e.currentTarget.value)}
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
                                    handleChange('documents', {
                                      ...formValues.documents,
                                      [category]: formValues.documents[category].filter((_, i) => i !== index)
                                    });
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
                            handleChange('documents', {
                              ...formValues.documents,
                              [category]: [
                                ...(formValues.documents[category] || []),
                                ...files.slice(0, 5 - (formValues.documents[category]?.length || 0))
                              ]
                            });
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
          >
            Back
          </Button>
          {active === 2 ? (
            <Button type="submit" loading={loading}>
              Save Employee
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
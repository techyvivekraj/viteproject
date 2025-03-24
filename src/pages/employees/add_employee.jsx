import { useNavigate } from 'react-router-dom';
import {
    TextInput,
    Button,
    Grid,
    Select,
    Textarea,
    NumberInput,
    FileInput,
    Stack,
    Paper,
    Title,
    Group,
    Card,
    Text,
    Badge,
    Tooltip,
    ActionIcon,
    Stepper,
    useMantineTheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconLoader, IconInfoCircle, IconUpload, IconUser, IconFileText, IconAddressBook, IconBuildingBank } from '@tabler/icons-react';
import { useAddEmployee } from '../../hooks/useAddEmployee';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

export default function AddEmployee() {
    const navigate = useNavigate();
    const [active, setActive] = useState(0);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const {
        formValues,
        errors,
        loading,
        isLoadingCity,
        isLoadingDepartments,
        isLoadingDesignations,
        isLoadingShifts,
        departmentList,
        designationList,
        shiftList,
        managerList,
        countries,
        indianStates,
        handleChange,
        handleFileChange,
        handleSubmit,
    } = useAddEmployee();

    const getSize = () => (isMobile ? 'xs' : isTablet ? 'sm' : 'md');

    const onSubmit = async (e) => {
        await handleSubmit(e);
    };

    const handleCancel = () => {
        modals.openConfirmModal({
            title: 'Confirm Cancel',
            children: <Text size="sm">Are you sure you want to cancel? All unsaved changes will be lost.</Text>,
            labels: { confirm: 'Yes, Cancel', cancel: 'Continue Editing' },
            confirmProps: { color: 'red' },
            onConfirm: () => navigate(-1),
        });
    };

    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
       
        <Paper radius="md" p="lg" bg="var(--mantine-color-body)">
                <Stack spacing={{ base: 'sm', md: 'md' }}>
                    <Group position="apart" mb="xl" wrap="wrap">
                        <Stack spacing="xs">
                            <Title order={2} size={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}>
                                Add New Employee
                            </Title>
                            <Text color="dimmed" size={isMobile ? 'xs' : 'sm'}>
                                Fill in the employee details below
                            </Text>
                        </Stack>
                        <Group spacing="xs" grow={false}>
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
                        <Card withBorder p="sm" mb="md" bg="red.0" radius="md">
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
                        <Stack spacing={{ base: 'md', md: 'xl' }}>
                            {active === 0 && (
                                <Card withBorder p={{ base: 'sm', md: 'md' }} radius="md" shadow="sm">
                                    <Group position="apart" mb="md" wrap="wrap">
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                clearable={false}
                                                valueFormat="DD/MM/YYYY"
                                                minDate={new Date(2000, 0, 1)}
                                                maxDate={new Date(2100, 0, 1)}
                                                size={getSize()}
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
                                                data={
                                                    departmentList.length > 0
                                                        ? departmentList
                                                        : [{ value: '', label: 'Loading departments...' }]
                                                }
                                                value={formValues.departmentId}
                                                onChange={(value) => handleChange('departmentId', value)}
                                                required
                                                error={errors.departmentId}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                            <Select
                                                label="Designation"
                                                placeholder="Enter designation"
                                                data={
                                                    designationList.length > 0
                                                        ? designationList
                                                        : [{ value: '', label: 'Loading designation...' }]
                                                }
                                                value={formValues.designationId}
                                                onChange={(value) => handleChange('designationId', value)}
                                                required
                                                error={errors.designationId}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                            <Select
                                                label="Shift"
                                                placeholder="Select shift"
                                                data={
                                                    shiftList.length > 0
                                                        ? shiftList
                                                        : [{ value: '', label: 'Loading shifts...' }]
                                                }
                                                value={formValues.shiftId}
                                                onChange={(value) => handleChange('shiftId', value)}
                                                required
                                                error={errors.shiftId}
                                                size={getSize()}
                                                radius="md"
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
                                                size={getSize()}
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
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}

                            {active === 1 && (
                                <Card withBorder p={{ base: 'sm', md: 'md' }} radius="md" shadow="sm">
                                    <Group position="apart" mb="md" wrap="wrap">
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                    size={getSize()}
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
                                                    size={getSize()}
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
                                                size={getSize()}
                                                radius="md"
                                                rightSection={
                                                    isLoadingCity ? (
                                                        <IconLoader size={isMobile ? 12 : 16} className="animate-spin" />
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                            <TextInput
                                                label="Blood Group"
                                                placeholder="Enter blood group"
                                                value={formValues.bloodGroup}
                                                onChange={(e) => handleChange('bloodGroup', e.currentTarget.value)}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                            <TextInput
                                                label="Emergency Contact"
                                                placeholder="Enter emergency contact"
                                                value={formValues.emergencyContact}
                                                onChange={(e) => handleChange('emergencyContact', e.currentTarget.value)}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                            <TextInput
                                                label="Emergency Contact Name"
                                                placeholder="Enter emergency contact name"
                                                value={formValues.emergencyName}
                                                onChange={(e) => handleChange('emergencyName', e.currentTarget.value)}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                            <Select
                                                label="Reporting Manager"
                                                placeholder="Enter reporting manager"
                                                data={
                                                    managerList.length > 0
                                                        ? managerList
                                                        : [{ value: '', label: 'Loading managers...' }]
                                                }
                                                value={formValues.reportingManagerId}
                                                onChange={(value) => handleChange('reportingManagerId', value)}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}

                            {active === 2 && (
                                <Card withBorder p={{ base: 'sm', md: 'md' }} radius="md" shadow="sm">
                                    <Group position="apart" mb="md" wrap="wrap">
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
                                                size={getSize()}
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
                                                size={getSize()}
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
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                            <TextInput
                                                label="Bank Name"
                                                placeholder="Enter bank name"
                                                value={formValues.bankName}
                                                onChange={(e) => handleChange('bankName', e.currentTarget.value)}
                                                size={getSize()}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            )}

                            {active === 3 && (
                                <Card withBorder p={{ base: 'sm', md: 'md' }} radius="md" shadow="sm">
                                    <Group position="apart" mb="md" wrap="wrap">
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
                                                icon={<IconUpload size={isMobile ? 12 : 14} />}
                                                size={getSize()}
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
                                                icon={<IconUpload size={isMobile ? 12 : 14} />}
                                                size={getSize()}
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
                                                icon={<IconUpload size={isMobile ? 12 : 14} />}
                                                size={getSize()}
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
                                                icon={<IconUpload size={isMobile ? 12 : 14} />}
                                                size={getSize()}
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
                                                icon={<IconUpload size={isMobile ? 12 : 14} />}
                                                size={getSize()}
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
                                </Card>
                            )}

                            <Group position="apart" mt="xl" wrap="wrap" spacing="xs">
                                <Button
                                    variant="light"
                                    color="red"
                                    onClick={handleCancel}
                                    disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                                    size={getSize()}
                                >
                                    Cancel
                                </Button>
                                <Group spacing="xs">
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

AddEmployee.propTypes = {
    // Add any necessary prop types here
};
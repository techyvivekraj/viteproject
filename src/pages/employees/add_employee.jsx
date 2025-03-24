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
    Container
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconLoader, IconInfoCircle, IconUpload, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { useAddEmployee } from '../../hooks/useAddEmployee'
import { modals } from '@mantine/modals';

export default function AddEmployee() {
    const navigate = useNavigate();
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
        handleSubmit
    } = useAddEmployee();

    // Handle form submission
    const onSubmit = async (e) => {
        await handleSubmit(e);
    };

    const handleCancel = () => {
        modals.openConfirmModal({
            title: 'Confirm Cancel',
            children: (
                <Text size="sm">
                    Are you sure you want to cancel? All unsaved changes will be lost.
                </Text>
            ),
            labels: { confirm: 'Yes, Cancel', cancel: 'Continue Editing' },
            confirmProps: { color: 'red' },
            onConfirm: () => navigate(-1)
        });
    };
    return (
        <Container size="xl">
            <Paper p="xl" radius="md" shadow="sm">
                <Group position="apart" mb="xl">
                    <div>
                        <Title order={2}>Add New Employee</Title>
                        <Text color="dimmed" size="sm">Fill in the employee details below</Text>
                    </div>
                    <Group>
                            <Button 
                                variant="light" 
                                color="red"
                                onClick={handleCancel}
                                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                                leftIcon={<IconX size={18} />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="employee-form"
                                loading={loading}
                                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                                color="blue"
                                leftIcon={<IconDeviceFloppy size={18} />}
                            >
                                {loading ? 'Saving...' : 'Save Employee'}
                            </Button>
                        </Group>
                </Group>
                
                {errors.general && (
                    <Card withBorder p="md" mb="md" bg="red.0" radius="md">
                        <Group>
                            <IconInfoCircle size={20} color="red" />
                            <Text color="red" size="sm">{errors.general}</Text>
                        </Group>
                    </Card>
                )}

                <form id="employee-form" onSubmit={onSubmit}>
                    <Stack spacing="xl">
                        {/* Required Fields Section */}
                        <Card withBorder p="md" radius="md" shadow="sm">
                            <Group position="apart" mb="md">
                                <Title order={3}>Required Information</Title>
                                <Badge color="red" variant="light" size="lg">Required</Badge>
                            </Group>
                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="First Name"
                                        placeholder="Enter first name"
                                        value={formValues.firstName}
                                        onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                                        required
                                        error={errors.firstName}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        value={formValues.lastName}
                                        onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                                        required
                                        error={errors.lastName}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Phone"
                                        placeholder="Enter phone number"
                                        value={formValues.phone}
                                        onChange={(e) => handleChange('phone', e.currentTarget.value)}
                                        required
                                        error={errors.phone}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Email"
                                        placeholder="Enter email"
                                        value={formValues.email}
                                        onChange={(e) => handleChange('email', e.currentTarget.value)}
                                        required
                                        error={errors.email}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <DateInput
                                        label="Joining Date"
                                        placeholder="Select joining date"
                                        value={formValues.joiningDate}
                                        onChange={(date) => handleChange('joiningDate', date)}
                                        required
                                        error={errors.joiningDate}
                                        // valueFormat="YYYY-MM-DD"
                                        size="md"
                                        radius="md"
                                        clearable={true}
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Department"
                                        placeholder="Select department"
                                        data={departmentList.length > 0 ? departmentList : [{ value: '', label: 'Loading departments...' }]}
                                        value={formValues.departmentId}
                                        onChange={(value) => handleChange('departmentId', value)}
                                        required
                                        error={errors.departmentId}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Designation"
                                        placeholder="Enter designation"
                                        data={designationList.length > 0 ? designationList : [{ value: '', label: 'Loading designation...' }]}
                                        value={formValues.designationId}
                                        onChange={(value) => handleChange('designationId', value)}
                                        required
                                        error={errors.designationId}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Shift"
                                        placeholder="Select shift"
                                        data={shiftList.length > 0 ? shiftList : [{ value: '', label: 'Loading shifts...' }]}
                                        value={formValues.shiftId}
                                        onChange={(value) => handleChange('shiftId', value)}
                                        required
                                        error={errors.shiftId}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Salary Type"
                                        placeholder="Select salary type"
                                        data={[
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'hourly', label: 'Hourly' },
                                            { value: 'daily', label: 'Daily' }
                                        ]}
                                        value={formValues.salaryType}
                                        onChange={(value) => handleChange('salaryType', value)}
                                        required
                                        error={errors.salaryType}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <NumberInput
                                        label="Salary Amount"
                                        placeholder="Enter salary amount"
                                        value={formValues.salary}
                                        onChange={(value) => handleChange('salary', value)}
                                        required
                                        error={errors.salary}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card>

                        {/* Additional Information Section */}
                        <Card withBorder p="md" radius="md" shadow="sm">
                            <Group position="apart" mb="md">
                                <Title order={3}>Additional Information</Title>
                                <Badge color="blue" variant="light" size="lg">Optional</Badge>
                            </Group>
                            <Grid>
                                <Grid.Col span={12}>
                                    <Textarea
                                        label="Address"
                                        placeholder="Enter complete address"
                                        value={formValues.address}
                                        onChange={(e) => handleChange('address', e.currentTarget.value)}
                                        minRows={3}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select
                                        label="Country"
                                        placeholder="Select country"
                                        data={countries}
                                        value={formValues.country}
                                        onChange={(value) => handleChange('country', value)}
                                        error={errors.country}
                                        rightSection={
                                            <Tooltip label="Select the country of residence">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    {formValues.country === 'IN' ? (
                                        <Select
                                            label="State"
                                            placeholder="Select state"
                                            data={indianStates}
                                            value={formValues.state}
                                            onChange={(value) => handleChange('state', value)}
                                            error={errors.state}
                                            rightSection={
                                                <Tooltip label="State will be auto-filled based on postal code">
                                                    <ActionIcon size="sm" variant="subtle">
                                                        <IconInfoCircle size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            }
                                            size="md"
                                            radius="md"
                                            styles={(theme) => ({
                                                input: {
                                                    '&:focus': {
                                                        borderColor: theme.colors.blue[5]
                                                    }
                                                },
                                                label: {
                                                    marginBottom: 4
                                                }
                                            })}
                                        />
                                    ) : (
                                        <TextInput
                                            label="State"
                                            placeholder="Enter state"
                                            value={formValues.state}
                                            onChange={(e) => handleChange('state', e.currentTarget.value)}
                                            error={errors.state}
                                            size="md"
                                            radius="md"
                                            styles={(theme) => ({
                                                input: {
                                                    '&:focus': {
                                                        borderColor: theme.colors.blue[5]
                                                    }
                                                },
                                                label: {
                                                    marginBottom: 4
                                                }
                                            })}
                                        />
                                    )}
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <TextInput
                                        label="Postal Code"
                                        placeholder="Enter postal code"
                                        value={formValues.postalCode}
                                        onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                                        error={errors.postalCode}
                                        rightSection={
                                            isLoadingCity ? 
                                                <IconLoader size={16} className="animate-spin" /> : 
                                                <Tooltip label="Enter 6-digit postal code">
                                                    <ActionIcon size="sm" variant="subtle">
                                                        <IconInfoCircle size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <TextInput
                                        label="City"
                                        placeholder="Enter city"
                                        value={formValues.city}
                                        onChange={(e) => handleChange('city', e.currentTarget.value)}
                                        error={errors.city}
                                        rightSection={
                                            <Tooltip label="City will be auto-filled based on postal code">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <DateInput
                                        label="Date of Birth"
                                        placeholder="Select date of birth"
                                        value={formValues.dateOfBirth}
                                        onChange={(date) => handleChange('dateOfBirth', date)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Gender"
                                        placeholder="Select gender"
                                        data={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'other', label: 'Other' }
                                        ]}
                                        value={formValues.gender}
                                        onChange={(value) => handleChange('gender', value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Blood Group"
                                        placeholder="Enter blood group"
                                        value={formValues.bloodGroup}
                                        onChange={(e) => handleChange('bloodGroup', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Emergency Contact"
                                        placeholder="Enter emergency contact"
                                        value={formValues.emergencyContact}
                                        onChange={(e) => handleChange('emergencyContact', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Emergency Contact Name"
                                        placeholder="Enter emergency contact name"
                                        value={formValues.emergencyName}
                                        onChange={(e) => handleChange('emergencyName', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Reporting Manager"
                                        placeholder="Enter reporting manager"
                                        data={managerList.length > 0 ? managerList : [{ value: '', label: 'Loading managers...' }]}
                                        value={formValues.reportingManagerId}
                                        onChange={(value) => handleChange('reportingManagerId', value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput
                                        label="Bank Account Number"
                                        placeholder="Enter bank account number"
                                        value={formValues.bankAccountNumber}
                                        onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput
                                        label="Bank IFSC"
                                        placeholder="Enter bank IFSC"
                                        value={formValues.bankIfsc}
                                        onChange={(e) => handleChange('bankIfsc', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput
                                        label="Bank Name"
                                        placeholder="Enter bank name"
                                        value={formValues.bankName}
                                        onChange={(e) => handleChange('bankName', e.currentTarget.value)}
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card>

                        {/* Documents Section */}
                        <Card withBorder p="md" radius="md" shadow="sm">
                            <Group position="apart" mb="md">
                                <Title order={3}>Documents</Title>
                                <Badge color="gray" variant="light" size="lg">Optional</Badge>
                            </Group>
                            <Grid>
                                <Grid.Col span={6}>
                                    <FileInput
                                        label="Educational Documents"
                                        placeholder="Upload educational documents"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        onChange={(files) => handleFileChange('educationalDocs', files)}
                                        icon={<IconUpload size={14} />}
                                        rightSection={
                                            <Tooltip label="Upload certificates, degrees, etc.">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <FileInput
                                        label="Professional Documents"
                                        placeholder="Upload professional documents"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        // maxFiles={5}
                                        onChange={(files) => handleFileChange('professionalDocs', files)}
                                        icon={<IconUpload size={14} />}
                                        rightSection={
                                            <Tooltip label="Upload work experience, certifications, etc.">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <FileInput
                                        label="Identity Documents"
                                        placeholder="Upload identity documents"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        // maxFiles={5}
                                        onChange={(files) => handleFileChange('identityDocs', files)}
                                        icon={<IconUpload size={14} />}
                                        rightSection={
                                            <Tooltip label="Upload PAN card, Aadhaar card, etc.">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <FileInput
                                        label="Address Documents"
                                        placeholder="Upload address documents"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        // maxFiles={5}
                                        onChange={(files) => handleFileChange('addressDocs', files)}
                                        icon={<IconUpload size={14} />}
                                        rightSection={
                                            <Tooltip label="Upload utility bills, rent agreement, etc.">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <FileInput
                                        label="Other Documents"
                                        placeholder="Upload other documents"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        onChange={(files) => handleFileChange('otherDocs', files)}
                                        icon={<IconUpload size={14} />}
                                        rightSection={
                                            <Tooltip label="Upload any other relevant documents">
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconInfoCircle size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        }
                                        size="md"
                                        radius="md"
                                        styles={(theme) => ({
                                            input: {
                                                '&:focus': {
                                                    borderColor: theme.colors.blue[5]
                                                }
                                            },
                                            label: {
                                                marginBottom: 4
                                            }
                                        })}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card>

                        <Group position="apart" mt="xl">
                            <Button 
                                variant="light" 
                                color="red"
                                onClick={handleCancel}
                                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                                leftIcon={<IconX size={18} />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="employee-form"
                                loading={loading}
                                disabled={loading || isLoadingDepartments || isLoadingDesignations || isLoadingShifts}
                                color="blue"
                                leftIcon={<IconDeviceFloppy size={18} />}
                            >
                                {loading ? 'Saving...' : 'Save Employee'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}

AddEmployee.propTypes = {
    // Add any necessary prop types here
}; 
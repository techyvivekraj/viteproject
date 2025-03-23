import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextInput,
    Button,
    Grid,
    Select,
    DateInput,
    Textarea,
    NumberInput,
    FileInput,
    Stack,
    Paper,
    Title,
    Group
} from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddEmployee } from '../../../hooks/organisation/useAddEmployee';

export default function AddEmployee() {
    const navigate = useNavigate();
    const {
        formValues,
        errors,
        loading,
        departmentListWithDefault,
        designationListWithDefault,
        shiftListWithDefault,
        salaryTypeListWithDefault,
        handleChange,
        handleFileChange,
        handleSubmit
    } = useAddEmployee();

    return (
        <Paper p="md" radius="md">
            <Title order={2} mb="md">Add New Employee</Title>
            
            {errors.general && (
                <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                    {/* Required Fields Section */}
                    <Title order={3}>Required Information</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="First Name"
                                placeholder="Enter first name"
                                value={formValues.firstName}
                                onChange={(e) => handleChange('firstName', e.currentTarget.value)}
                                required
                                error={errors.firstName}
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
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Department"
                                placeholder="Select department"
                                data={departmentListWithDefault}
                                value={formValues.departmentId}
                                onChange={(value) => handleChange('departmentId', value)}
                                required
                                error={errors.departmentId}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Designation"
                                placeholder="Select designation"
                                data={designationListWithDefault}
                                value={formValues.designationId}
                                onChange={(value) => handleChange('designationId', value)}
                                required
                                error={errors.designationId}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Shift"
                                placeholder="Select shift"
                                data={shiftListWithDefault}
                                value={formValues.shiftId}
                                onChange={(value) => handleChange('shiftId', value)}
                                required
                                error={errors.shiftId}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Salary Type"
                                placeholder="Select salary type"
                                data={salaryTypeListWithDefault}
                                value={formValues.salaryType}
                                onChange={(value) => handleChange('salaryType', value)}
                                required
                                error={errors.salaryType}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Salary Amount"
                                placeholder="Enter salary amount"
                                value={formValues.salaryAmount}
                                onChange={(value) => handleChange('salaryAmount', value)}
                                required
                                error={errors.salaryAmount}
                            />
                        </Grid.Col>
                    </Grid>

                    {/* Optional Fields Section */}
                    <Title order={3}>Additional Information</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Middle Name"
                                placeholder="Enter middle name"
                                value={formValues.middleName}
                                onChange={(e) => handleChange('middleName', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Employee Code"
                                placeholder="Enter unique employee code"
                                value={formValues.employeeCode}
                                onChange={(e) => handleChange('employeeCode', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Textarea
                                label="Address"
                                placeholder="Enter address"
                                value={formValues.address}
                                onChange={(e) => handleChange('address', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="Country"
                                placeholder="Enter country"
                                value={formValues.country}
                                onChange={(e) => handleChange('country', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="State"
                                placeholder="Enter state"
                                value={formValues.state}
                                onChange={(e) => handleChange('state', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="Postal Code"
                                placeholder="Enter postal code"
                                value={formValues.postalCode}
                                onChange={(e) => handleChange('postalCode', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <DateInput
                                label="Date of Birth"
                                placeholder="Select date of birth"
                                value={formValues.dateOfBirth}
                                onChange={(date) => handleChange('dateOfBirth', date)}
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
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Blood Group"
                                placeholder="Enter blood group"
                                value={formValues.bloodGroup}
                                onChange={(e) => handleChange('bloodGroup', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Emergency Contact"
                                placeholder="Enter emergency contact"
                                value={formValues.emergencyContact}
                                onChange={(e) => handleChange('emergencyContact', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Emergency Contact Name"
                                placeholder="Enter emergency contact name"
                                value={formValues.emergencyName}
                                onChange={(e) => handleChange('emergencyName', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Reporting Manager"
                                placeholder="Enter reporting manager"
                                value={formValues.reportingManager}
                                onChange={(e) => handleChange('reportingManager', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="Bank Account Number"
                                placeholder="Enter bank account number"
                                value={formValues.bankAccountNumber}
                                onChange={(e) => handleChange('bankAccountNumber', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="Bank IFSC"
                                placeholder="Enter bank IFSC"
                                value={formValues.bankIfsc}
                                onChange={(e) => handleChange('bankIfsc', e.currentTarget.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="Bank Name"
                                placeholder="Enter bank name"
                                value={formValues.bankName}
                                onChange={(e) => handleChange('bankName', e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>

                    {/* Documents Section */}
                    <Title order={3}>Documents</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            <FileInput
                                label="Educational Documents"
                                placeholder="Upload educational documents"
                                multiple
                                accept=".pdf,.doc,.docx"
                                maxFiles={5}
                                onChange={(files) => handleFileChange('educationalDocs', files)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <FileInput
                                label="Professional Documents"
                                placeholder="Upload professional documents"
                                multiple
                                accept=".pdf,.doc,.docx"
                                maxFiles={5}
                                onChange={(files) => handleFileChange('professionalDocs', files)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <FileInput
                                label="Identity Documents"
                                placeholder="Upload identity documents"
                                multiple
                                accept=".pdf,.doc,.docx"
                                maxFiles={5}
                                onChange={(files) => handleFileChange('identityDocs', files)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <FileInput
                                label="Address Documents"
                                placeholder="Upload address documents"
                                multiple
                                accept=".pdf,.doc,.docx"
                                maxFiles={5}
                                onChange={(files) => handleFileChange('addressDocs', files)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <FileInput
                                label="Other Documents"
                                placeholder="Upload other documents"
                                multiple
                                accept=".pdf,.doc,.docx"
                                maxFiles={5}
                                onChange={(files) => handleFileChange('otherDocs', files)}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group position="right" mt="xl">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            {loading ? <IconLoader /> : 'Save Employee'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}

AddEmployee.propTypes = {
    // Add any necessary prop types here
}; 
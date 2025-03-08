import { Modal, TextInput, Button, Select, Group } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddRole } from '../../../hooks/organisation/useAddRole';
import AddDepartments from '../departments/add_departments';
import PropTypes from 'prop-types';

export default function AddRoles({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        departmentList,
        showDepartmentModal,
        handleChange,
        handleSubmit,
        handleDepartmentModalClose,
        handleDepartmentAdded
    } = useAddRole(closeModal);

    return (
        <>
            <Modal
                opened={opened}
                onClose={closeModal}
                title="Add Role"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                radius={10}
            >
                {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

                <TextInput
                    label="Role Name"
                    placeholder="Enter role name"
                    value={formValues.name}
                    onChange={(e) => handleChange('name', e.currentTarget.value)}
                    required
                    error={errors.name}
                    pb={10}
                />

                <Select
                    label="Select Department"
                    placeholder="Choose a department"
                    value={formValues.departmentId}
                    onChange={(value) => handleChange('departmentId', value)}
                    data={departmentList}
                    required
                    error={errors.departmentId}
                    pb={10}
                    // searchable
                />

                {/* <Select
                    label="Select Level (Optional)"
                    placeholder="Choose a Level"
                    value={formValues.levelId}
                    onChange={(value) => handleChange('levelId', value)}
                    data={levels.map((level) => ({
                        value: String(level.id),
                        label: level.value
                    }))}
                    error={errors.levelId}
                    pb={10}
                /> */}

                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeModal}>Cancel</Button>
                    
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <IconLoader /> : 'Save'}
            </Button>
                </Group>
            </Modal>

            {/* Department Modal */}
            <AddDepartments 
                opened={showDepartmentModal} 
                closeModal={handleDepartmentModalClose}
                onSuccess={handleDepartmentAdded}
            />
        </>
    );
}

AddRoles.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

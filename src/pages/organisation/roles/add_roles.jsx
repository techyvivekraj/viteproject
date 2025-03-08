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
        levels,
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
                    value={formValues.roleName}
                    onChange={(e) => handleChange('roleName', e.currentTarget.value)}
                    required
                    error={errors.roleName}
                    pb={10}
                />

                <Select
                    label="Select Department"
                    placeholder="Choose a department"
                    value={formValues.deptId}
                    onChange={(value) => handleChange('deptId', value)}
                    data={departmentList?.map((dept) => ({
                        value: String(dept.deptId),
                        label: dept.departmentName,
                        disabled: dept.deptId === 'add_new' && departmentList.length > 1
                    }))}
                    required
                    error={errors.deptId}
                    pb={10}
                    searchable
                    // nothingFound="No departments found"
                />

                <Select
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
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeModal}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={loading}>
                        Save
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

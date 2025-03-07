import { Modal, TextInput, Button, Select } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddRole } from '../../../hooks/organisation/useAddRole';

export default function AddRoles({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        departmentList,
        levels,
        handleChange,
        handleSubmit
    } = useAddRole(closeModal);

    return (
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
                    label: String(dept.departmentName)
                }))}
                required
                error={errors.deptId}
                pb={10}
            />

            <Select
                label="Select Level (Optional)"
                placeholder="Choose a Level"
                value={formValues.levelId}
                onChange={(value) => handleChange('levelId', value)}
                data={levels.map((level) => ({
                    value: String(level.id),
                    label: String(level.value)
                }))}
                error={errors.levelId}
                pb={10}
            />

            <Button onClick={handleSubmit} fullWidth mt="md" disabled={loading}>
                {loading ? <IconLoader /> : 'Save'}
            </Button>
        </Modal>
    );
}

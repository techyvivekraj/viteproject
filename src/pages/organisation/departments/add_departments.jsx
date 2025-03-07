import { Modal, TextInput, Button } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddDepartment } from '../../../hooks/organisation/useAddDepartment';
import PropTypes from 'prop-types';

export default function AddDepartments({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        handleChange,
        handleSubmit
    } = useAddDepartment(closeModal);

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title="Add Department"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius={10}
        >
            {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

            <TextInput
                label="Department Name"
                placeholder="Enter department name"
                value={formValues.departmentName}
                onChange={(e) => handleChange('departmentName', e.currentTarget.value)}
                required
                error={errors.departmentName}
                pb={10}
            />

            <TextInput
                label="Casual Leave (Per Annum)"
                placeholder="Enter casual leave days"
                value={formValues.casualLeave}
                onChange={(e) => handleChange('casualLeave', e.currentTarget.value)}
                error={errors.casualLeave}
                type="number"
                pb={10}
            />

            <TextInput
                label="Sick Leave (Per Annum)"
                placeholder="Enter sick leave days"
                value={formValues.sickLeave}
                onChange={(e) => handleChange('sickLeave', e.currentTarget.value)}
                error={errors.sickLeave}
                type="number"
                pb={10}
            />

            <TextInput
                label="Earned Leave (Per Annum)"
                placeholder="Enter earned leave days"
                value={formValues.earnedLeave}
                onChange={(e) => handleChange('earnedLeave', e.currentTarget.value)}
                error={errors.earnedLeave}
                type="number"
                pb={10}
            />

            <TextInput
                label="Maternity Leave (Per Annum)"
                placeholder="Enter maternity leave days"
                value={formValues.maternityLeave}
                onChange={(e) => handleChange('maternityLeave', e.currentTarget.value)}
                error={errors.maternityLeave}
                type="number"
                pb={10}
            />

            <TextInput
                label="Paternity Leave (Per Annum)"
                placeholder="Enter paternity leave days"
                value={formValues.paternityLeave}
                onChange={(e) => handleChange('paternityLeave', e.currentTarget.value)}
                error={errors.paternityLeave}
                type="number"
                pb={10}
            />

            <TextInput
                label="Notice Period"
                placeholder="Enter notice period"
                value={formValues.noticePeriod}
                onChange={(e) => handleChange('noticePeriod', e.currentTarget.value)}
                error={errors.noticePeriod}
                type="number"
                pb={10}
            />

            <Button onClick={handleSubmit} mt="md" fullWidth disabled={loading}>
                {loading ? <IconLoader /> : 'Save'}
            </Button>
        </Modal>
    );
}

AddDepartments.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

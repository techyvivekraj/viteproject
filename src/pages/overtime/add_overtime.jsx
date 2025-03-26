import { Modal, TextInput, Button, Select, NumberInput } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddOvertime } from '../../hooks/useAddOvertime';
import { useSelector } from 'react-redux';
import { selectLoading as selectEmployeesLoading } from '../../store/slices/employeeSlice';
import PropTypes from 'prop-types';

export default function AddOvertime({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        employeeOptions,
        handleChange,
        handleSubmit
    } = useAddOvertime(closeModal);

    const employeesLoading = useSelector(selectEmployeesLoading);

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title="Add Overtime"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius={10}
        >
            {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

            <Select
                label="Employee"
                placeholder={employeesLoading ? "Loading employees..." : "Select employee"}
                data={employeeOptions}
                value={formValues.employeeId}
                onChange={(value) => handleChange('employeeId', value)}
                error={errors.employeeId}
                searchable
                required
                disabled={employeesLoading}
                pb={10}
            />

            <TextInput
                label="Date"
                type="date"
                value={formValues.date}
                onChange={(e) => handleChange('date', e.currentTarget.value)}
                error={errors.date}
                required
                pb={10}
            />

            <NumberInput
                label="Hours"
                placeholder="Enter overtime hours"
                value={formValues.hours}
                onChange={(value) => handleChange('hours', value)}
                error={errors.hours}
                min={0}
                max={24}
                required
                pb={10}
            />

            <TextInput
                label="Reason"
                placeholder="Enter reason for overtime"
                value={formValues.reason}
                onChange={(e) => handleChange('reason', e.currentTarget.value)}
                error={errors.reason}
                required
                pb={10}
            />

            <Button onClick={handleSubmit} mt="md" fullWidth disabled={loading}>
                {loading ? <IconLoader className="animate-spin" /> : 'Save'}
            </Button>
        </Modal>
    );
}

AddOvertime.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
}; 
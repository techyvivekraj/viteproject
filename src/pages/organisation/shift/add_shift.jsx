import { useMemo } from 'react';
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { useAddShift } from '../../../hooks/organisation/useAddShift';
import PropTypes from 'prop-types';

export default function AddShift({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        daysOfWeek,
        handleChange,
        handleWorkingDayChange,
        handleSubmit
    } = useAddShift(closeModal);

    const dayButtons = useMemo(() => {
        return daysOfWeek.map((day) => (
            <Button
                key={day.value}
                variant="filled"
                color={formValues.workingDays[day.value] ? 'blue' : 'gray'}
                onClick={() => handleWorkingDayChange(day.value)}
            >
                {day.label}
            </Button>
        ));
    }, [formValues.workingDays, handleWorkingDayChange]);

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title="Add Shift"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius={10}
        >
            {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

            <TextInput
                label="Shift Name"
                placeholder="e.g.: morning, evening"
                value={formValues.shiftName}
                onChange={(e) => handleChange('shiftName', e.currentTarget.value)}
                required
                error={errors.shiftName}
                pb={10}
            />

            <TextInput
                label="Start Time"
                placeholder="Enter start time"
                value={formValues.startTime}
                type="time"
                onChange={(e) => handleChange('startTime', e.currentTarget.value)}
                required
                error={errors.startTime}
                pb={10}
            />

            <TextInput
                label="End Time"
                placeholder="Enter end time"
                value={formValues.endTime}
                type="time"
                onChange={(e) => handleChange('endTime', e.currentTarget.value)}
                required
                error={errors.endTime}
                pb={10}
            />

            <div>
                <label>Working Days</label>
                <Group spacing="xs" direction="row" style={{ flexWrap: 'wrap' }}>
                    {dayButtons}
                </Group>
                {errors.workingDays && <div style={{ color: 'red', marginTop: 5 }}>{errors.workingDays}</div>}
            </div>

            <Button onClick={handleSubmit} mt="md" fullWidth disabled={loading}>
                {loading ? <IconLoader /> : 'Save'}
            </Button>
        </Modal>
    );
}

AddShift.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

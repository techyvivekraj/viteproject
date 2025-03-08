import { useMemo } from 'react';
import { Modal, TextInput, Button, Group, Stack, Text, Select } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { useAddShift } from '../../../hooks/organisation/useAddShift';
import PropTypes from 'prop-types';

export default function AddShift({ opened, closeModal, onSuccess }) {
    const {
        formValues,
        errors,
        loading,
        daysOfWeek,
        handleChange,
        handleWorkingDayChange,
        handleSubmit: handleFormSubmit
    } = useAddShift(() => {
        closeModal();
        onSuccess?.();
    });

    const dayButtons = useMemo(() => {
        return daysOfWeek.map((day) => (
            <Button
                key={day.value}
                variant={formValues.workingDays[day.value] ? 'filled' : 'light'}
                color={formValues.workingDays[day.value] ? 'blue' : 'gray'}
                onClick={() => handleWorkingDayChange(day.value)}
                size="sm"
                radius="md"
            >
                {day.label}
            </Button>
        ));
    }, [formValues.workingDays, handleWorkingDayChange, daysOfWeek]);

    const handleSubmit = async () => {
        const success = await handleFormSubmit();
        if (success) {
            onSuccess?.();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title={<Text size="lg" fw={600}>Add New Shift</Text>}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius={10}
            size="md"
            padding="lg"
        >
            <Stack spacing="md">
                {errors.general && (
                    <Text color="red" size="sm" mb={-10}>
                        {errors.general}
                    </Text>
                )}

                <TextInput
                    label="Shift Name"
                    placeholder="e.g.: Morning Shift, Evening Shift"
                    value={formValues.shiftName}
                    onChange={(e) => handleChange('shiftName', e.currentTarget.value)}
                    required
                    error={errors.shiftName}
                />

                <Group grow>
                    <TimeInput
                        label="Start Time"
                        placeholder="Select start time"
                        value={formValues.startTime}
                        onChange={(e) => handleChange('startTime', e.target.value)}
                        required
                        error={errors.startTime}
                        icon={<IconClock size={16} />}
                    />

                    <TimeInput
                        label="End Time"
                        placeholder="Select end time"
                        value={formValues.endTime}
                        onChange={(e) => handleChange('endTime', e.target.value)}
                        required
                        error={errors.endTime}
                        icon={<IconClock size={16} />}
                    />
                </Group>

                <Stack spacing="xs">
                    <Text size="sm" fw={500}>Working Days</Text>
                    <Group spacing={8}>
                        {dayButtons}
                    </Group>
                    {errors.workingDays && (
                        <Text color="red" size="sm">
                            {errors.workingDays}
                        </Text>
                    )}
                </Stack>

                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        loading={loading}
                        color="blue"
                    >
                        {loading ? 'Saving...' : 'Save Shift'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

AddShift.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};

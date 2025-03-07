import { Modal, TextInput, Switch, Button, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAddHoliday } from '../../../hooks/organisation/useAddHoliday';

export default function AddHoliday({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        handleChange,
        handleSubmit
    } = useAddHoliday(closeModal);

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title="Add Holiday"
            size="md"
        >
            {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

            <TextInput
                label="Holiday Name"
                placeholder="Enter holiday name"
                value={formValues.holidayName}
                onChange={(e) => handleChange('holidayName', e.target.value)}
                error={errors.holidayName}
                required
                mb="md"
            />

            <DateInput
                label="Holiday Date"
                placeholder="Select date"
                value={formValues.holidayDate}
                onChange={(date) => handleChange('holidayDate', date)}
                error={errors.holidayDate}
                required
                mb="md"
            />

            <Textarea
                label="Description"
                placeholder="Enter holiday description"
                value={formValues.description}
                onChange={(e) => handleChange('description', e.target.value)}
                mb="md"
            />

            <Switch
                label="Optional Holiday"
                checked={formValues.isOptional}
                onChange={(e) => handleChange('isOptional', e.currentTarget.checked)}
                mb="md"
            />

            <Button onClick={handleSubmit} loading={loading} fullWidth>
                Save Holiday
            </Button>
        </Modal>
    );
} 
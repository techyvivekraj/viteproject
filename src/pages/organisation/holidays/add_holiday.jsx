import { Modal, TextInput, Button, Group, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAddHoliday } from '../../../hooks/organisation/useAddHoliday';
import PropTypes from 'prop-types';

const typeOptions = [
  { value: 'full', label: 'Full Day' },
  { value: 'half', label: 'Half Day' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

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
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
    >
      {errors.general && (
        <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>
      )}

      <TextInput
        label="Holiday Name"
        placeholder="Enter holiday name"
        value={formValues.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        mb="md"
      />

      <DateInput
        label="Holiday Date"
        placeholder="Select date"
        value={formValues.date}
        onChange={(date) => handleChange('date', date)}
        error={errors.date}
        required
        mb="md"
      />

      <Select
        label="Holiday Type"
        placeholder="Select holiday type"
        data={typeOptions}
        value={formValues.type}
        onChange={(value) => handleChange('type', value)}
        error={errors.type}
        required
        mb="md"
      />

      <Select
        label="Status"
        placeholder="Select status"
        data={statusOptions}
        value={formValues.status}
        onChange={(value) => handleChange('status', value)}
        error={errors.status}
        mb="md"
      />

      <Textarea
        label="Description"
        placeholder="Enter holiday description"
        value={formValues.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        mb="xl"
      />

      <Group justify="flex-end">
        <Button variant="light" onClick={closeModal}>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleSubmit}>
          Add Holiday
        </Button>
      </Group>
    </Modal>
  );
}

AddHoliday.propTypes = {
  opened: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}; 
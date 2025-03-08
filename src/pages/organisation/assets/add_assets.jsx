import { Modal, TextInput, Button, Select, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAddAsset } from '../../../hooks/organisation/useAddAsset';
import PropTypes from 'prop-types';

const conditions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'damaged', label: 'Damaged' },
];

const status = [
    { value: 'active', label: 'Active' },
    { value: 'returned', label: 'Returned' },
    { value: 'lost', label: 'Lost' },
];

export default function AddAsset({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        handleChange,
        handleSubmit
    } = useAddAsset(closeModal);

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            title="Add Asset"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius={10}
        >
            {errors.general && <div style={{ color: 'red', marginBottom: 10 }}>{errors.general}</div>}

            <TextInput
                label="Asset Name"
                placeholder="e.g.: Laptop, Desk"
                value={formValues.assetName}
                onChange={(e) => handleChange('assetName', e.currentTarget.value)}
                required
                error={errors.assetName}
                pb={10}
            />

            <TextInput
                label="Assigned To (Employee ID)"
                placeholder="Enter employee ID"
                value={formValues.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.currentTarget.value)}
                error={errors.assignedTo}
                pb={10}
            />

            <DateInput
                label="Purchase Date"
                maxDate={new Date()}
                value={formValues.purchaseDate}
                onChange={(date) => handleChange('purchaseDate', date)}
                required
                error={errors.purchaseDate}
                pb={10}
            />

            <Select
                label="Condition"
                placeholder="Select asset condition"
                value={formValues.condition}
                onChange={(value) => handleChange('condition', value)}
                data={conditions}
                required
                error={errors.condition}
                pb={10}
            />

            <Select
                label="Status"
                placeholder="Select asset status"
                value={formValues.status}
                onChange={(value) => handleChange('status', value)}
                data={status}
                required
                error={errors.status}
                pb={10}
            />

            <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSubmit} loading={loading}>
                    Save
                </Button>
            </Group>
        </Modal>
    );
}

AddAsset.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

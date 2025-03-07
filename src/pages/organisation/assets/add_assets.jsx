import { useEffect } from 'react';
import { Modal, TextInput, Button, Select } from '@mantine/core';
import { useSelector } from 'react-redux';
import { IconLoader } from '@tabler/icons-react';
import { selectDepartments } from '../../../store/slices/organisation/deptSlice';
import { DateInput } from '@mantine/dates';
import { useAddAsset } from '../../../hooks/organisation/useAddAsset';
import PropTypes from 'prop-types';

const assetTypes = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'technology', label: 'Technology' },
    { value: 'custom', label: 'Custom' }
];

const conditions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'damaged', label: 'Damaged' },
];

export default function AddAsset({ opened, closeModal }) {
    const {
        formValues,
        errors,
        loading,
        handleChange,
        handleSubmit,
        handleReset
    } = useAddAsset(closeModal);

    const departmentList = useSelector(selectDepartments) || [];

    useEffect(() => {
        if (!opened) {
            handleReset();
        }
    }, [opened, handleReset]);

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

            <Select
                label="Asset Type"
                placeholder="Select asset type"
                value={formValues.assetType}
                onChange={(value) => handleChange('assetType', value)}
                data={assetTypes}
                required
                error={errors.assetType}
                pb={10}
            />

            {formValues.assetType === 'custom' && (
                <TextInput
                    label="Custom Asset Type"
                    placeholder="Enter custom asset type"
                    value={formValues.customAssetType}
                    onChange={(e) => handleChange('customAssetType', e.currentTarget.value)}
                    required
                    error={errors.customAssetType}
                    pb={10}
                />
            )}

            <TextInput
                label="Assigned To (optional)"
                placeholder="Employee ID (optional)"
                value={formValues.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.currentTarget.value)}
                error={errors.assignedTo}
                pb={10}
            />

            <Select
                label="Department"
                placeholder="Select department"
                value={formValues.departmentId}
                onChange={(value) => handleChange('departmentId', value)}
                data={Array.isArray(departmentList) 
                    ? departmentList
                        .filter(dep => dep?.deptId && dep?.departmentName)
                        .map(dep => ({
                            value: String(dep.deptId),
                            label: dep.departmentName
                        }))
                    : []
                }
                required
                error={errors.departmentId}
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
                value={formValues.conditionn}
                onChange={(value) => handleChange('conditionn', value)}
                data={conditions}
                required
                error={errors.condition}
                pb={10}
            />

            <Button onClick={handleSubmit} mt="md" fullWidth disabled={loading}>
                {loading ? <IconLoader /> : 'Save'}
            </Button>
        </Modal>
    );
}

AddAsset.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

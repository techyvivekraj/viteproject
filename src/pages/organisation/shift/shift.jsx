import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/datatable';
import AddShift from './add_shift';
import { useShift } from '../../../hooks/organisation/useShift';

export default function Shift() {
    const [opened, { open, close }] = useDisclosure(false);
    const { shifts, loading, columns, handleDelete } = useShift();
    
      const processedData = useMemo(() =>
        Array.isArray(shifts)
          ? shifts.map(shift => ({ ...shift }))
          : [],
        [shifts]);

    const openDeleteModal = useCallback((shiftId) => {
        modals.openConfirmModal({
            title: 'Confirm Deletion',
            centered: true,
            children: (
                <Text size="sm">
                    Deleting this shift will also remove all related data. This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete Shift', cancel: 'Cancel' },
            withOverlay: true,
            draggable: true,
            radius: 'md',
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleDelete(shiftId),
        });
    }, [handleDelete]);

    const handleEditClick = (item) => {
        // Implement edit functionality
        console.log('Edit:', item);
    };

    return (
        <div>
            <DataTable
                title="Shift List"
                data={processedData}
                columns={columns}
                searchPlaceholder="Search shifts..."
                pagination={true}
                onAddClick={open}
                onDeleteClick={(item) => openDeleteModal(item.shiftId)}
                onEditClick={handleEditClick}
                isLoading={loading}
                hideMonthPicker={true}
            />
            <AddShift opened={opened} closeModal={close} />
        </div>
    );
}

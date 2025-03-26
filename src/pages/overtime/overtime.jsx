import { useCallback, useMemo } from 'react';
import { Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../components/DataTable/datatable';
import AddOvertime from './add_overtime';
import { useOvertime } from '../../hooks/overtime/useOvertime';

export default function Overtime() {
    const [opened, { open, close }] = useDisclosure(false);
    const { overtimeData, loading, columns, handleDelete } = useOvertime();

    const processedData = useMemo(() =>
        Array.isArray(overtimeData)
            ? overtimeData.map(ot => ({ ...ot }))
            : [],
        [overtimeData]);
        
    const openDeleteModal = useCallback((overtimeId) => {
        modals.openConfirmModal({
            title: 'Confirm Deletion',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this overtime record? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleDelete(overtimeId),
        });
    }, [handleDelete]);

    const handleEditClick = (item) => {
        console.log('Edit:', item);
    };

    const handleDeleteClick = (item) => {
        openDeleteModal(item.id);
    };

    return (
        <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
            <DataTable
                title="Overtime Records"
                data={processedData}
                columns={columns}
                searchPlaceholder="Search overtime records..."
                pagination={true}
                onAddClick={open}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                isLoading={loading}
            />
            <AddOvertime opened={opened} closeModal={close} />
        </Paper>
    );
} 
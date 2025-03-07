import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/datatable';
import AddDepartments from './add_departments';
import { useDepartment } from '../../../hooks/organisation/useDepartment';

export default function Departments() {
    const [opened, { open, close }] = useDisclosure(false);
    const { departments, loading, columns, handleDelete } = useDepartment();

    const processedData = useMemo(() =>
        Array.isArray(departments)
            ? departments.map(dept => ({ ...dept }))
            : [],
        [departments]);
        
    const openDeleteModal = useCallback((deptId) => {
        modals.openConfirmModal({
            title: 'Confirm Deletion',
            centered: true,
            children: (
                <Text size="sm">
                    Deleting this department will also remove all related data. This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete department', cancel: 'Cancel' },
            withOverlay: true,
            draggable: true,
            radius: 'md',
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleDelete(deptId),
        });
    }, [handleDelete]);

    const handleEditClick = (item) => {
        // Implement edit functionality
        console.log('Edit:', item);
    };

    const handleDeleteClick = (item) => {
        openDeleteModal(item.deptId);
    };

    return (
        <div>
            <DataTable
                title="Department List"
                data={processedData}
                columns={columns}
                searchPlaceholder="Search departments..."
                pagination={true}
                onAddClick={open}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                isLoading={loading}
                hideMonthPicker={true}
            />
            <AddDepartments opened={opened} closeModal={close} />
        </div>
    );
}

import { useCallback, useMemo } from 'react';
import { Text, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/datatable';
import AddHoliday from './add_holiday';
import { useHoliday } from '../../../hooks/organisation/useHoliday';

export default function Holidays() {
    const [opened, { open, close }] = useDisclosure(false);
    const { holidays, loading, columns, handleDelete } = useHoliday();

    const processedData = useMemo(() => 
        Array.isArray(holidays?.data) 
            ? holidays.data.map(holiday => ({
                id: holiday.id,
                name: holiday.name,
                description: holiday.description,
                date: holiday.date,
                type: holiday.type,
                status: holiday.status
            }))
            : [], 
        [holidays]);

    const openDeleteModal = useCallback((id) => {
        modals.openConfirmModal({
            title: 'Delete Holiday',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this holiday? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete Holiday', cancel: 'Cancel' },
            withOverlay: true,
            draggable: true,
            radius: 'md',
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleDelete(id),
        });
    }, [handleDelete]);

    const handleEditClick = useCallback((item) => {
        console.log('Edit clicked', item);
        // Implement edit functionality
    }, []);

    return (
        <div>
            <DataTable
                title="Holiday List"
                data={processedData}
                columns={columns}
                searchPlaceholder="Search holidays..."
                pagination={true}
                onAddClick={open}
                onDeleteClick={(item) => openDeleteModal(item.id)}
                onEditClick={handleEditClick}
                isLoading={loading}
                hideMonthPicker={true}
            />
            <AddHoliday opened={opened} closeModal={close} />
        </div>
    );
} 
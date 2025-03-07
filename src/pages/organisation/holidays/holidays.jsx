import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/datatable';
import AddHoliday from './add_holiday';
import { useHoliday } from '../../../hooks/organisation/useHoliday';

export default function Holidays() {
    const [opened, { open, close }] = useDisclosure(false);
    const { holidays, loading, columns, handleDelete } = useHoliday();

      const processedData = useMemo(() => 
        Array.isArray(holidays) 
          ? holidays.map(holiday => ({ ...holiday }))
          : [], 
        [holidays]);

    const openDeleteModal = useCallback((holidayId) => {
        modals.openConfirmModal({
            title: 'Confirm Deletion',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this holiday? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete holiday', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDelete(holidayId),
        });
    }, [handleDelete]);

    return (
        <div>
            <DataTable
                title="Holidays List"
                data={processedData}
                columns={columns}
                searchPlaceholder="Search holidays..."
                pagination={true}
                onAddClick={open}
                onDeleteClick={(item) => openDeleteModal(item.holidayId)}
                isLoading={loading}
            />
            <AddHoliday opened={opened} closeModal={close} />
        </div>
    );
} 
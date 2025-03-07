import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/datatable';
import AddRoles from './add_roles';
import { useRole } from '../../../hooks/organisation/useRole';

export default function Roles() {
  const [opened, { open, close }] = useDisclosure(false);
  const { roles, loading, columns, handleDelete } = useRole();

  const processedData = useMemo(() =>
    Array.isArray(roles)
      ? roles.map(role => ({ ...role }))
      : [],
    [roles]);

  const openDeleteModal = useCallback((roleId) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
      centered: true,
      children: (
        <Text size="sm">
          Deleting this role will also remove all related data. This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete Role', cancel: 'Cancel' },
      withOverlay: true,
      draggable: true,
      radius: 'md',
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(roleId),
    });
  }, [handleDelete]);

  const handleEditClick = (item) => {
    // Implement edit functionality
    console.log('Edit:', item);
  };

  return (
    <div>
      <DataTable
        title="Role List"
        data={processedData}
        columns={columns}
        searchPlaceholder="Search roles..."
        pagination={true}
        onAddClick={open}
        onDeleteClick={(item) => openDeleteModal(item.roleId)}
        onEditClick={handleEditClick}
        isLoading={loading}
        hideMonthPicker={true}
      />
      <AddRoles opened={opened} closeModal={close} />
    </div>
  );
}

import { useCallback, useMemo } from 'react';
import { Text, Badge, Paper } from '@mantine/core';
import { modals } from '@mantine/modals';
import DataTable from '../../components/DataTable/datatable';
import { useEmployee } from '../../hooks/useEmployee';
import { capitalizeFirstLetter } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
    const navigate = useNavigate();
    const { employees, loading, handleDelete } = useEmployee();

    const columns = useMemo(() => [
        {
            header: 'Employee Name',
            accessor: 'firstName',
            render: (item) => (
                <Text size="sm" fw={500}>
                    {`${capitalizeFirstLetter(item.firstName)} ${capitalizeFirstLetter(item.lastName)}`}
                </Text>
            )
        },
        {
            header: 'Department',
            accessor: 'departmentName',
            render: (item) => (
                <Text size="sm">
                    {capitalizeFirstLetter(item.departmentName) || 'N/A'}
                </Text>
            )
        },
        {
            header: 'Designation',
            accessor: 'designationName',
            render: (item) => (
                <Text size="sm">
                    {capitalizeFirstLetter(item.designationName) || 'N/A'}
                </Text>
            )
        },
        {
            header: 'Contact',
            accessor: 'contact',
            render: (item) => (
                <div>
                    <Text size="sm">{item.email}</Text>
                    <Text size="xs" color="dimmed">{item.phone}</Text>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <Badge 
                    color={item.status === 'active' ? 'green' : 'red'}
                    variant="light"
                >
                    {capitalizeFirstLetter(item.status || 'inactive')}
                </Badge>
            )
        }
    ], []);

    const openDeleteModal = useCallback((item) => {
        modals.openConfirmModal({
            title: 'Confirm Deletion',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this employee? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete employee', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDelete(item.id),
        });
    }, [handleDelete]);

    const handleEditClick = useCallback((item) => {
        navigate(`/employees/edit/${item.id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((item) => {
        openDeleteModal(item);
    }, [openDeleteModal]);

    const handleAddClick = useCallback(() => {
        navigate('/employees/add');
    }, [navigate]);

    return (
        <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
                <DataTable
                    title="Employee List"
                    data={employees?.data || []}
                    columns={columns}
                    searchPlaceholder="Search employees..."
                    pagination={true}
                    onAddClick={handleAddClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    isLoading={loading}
                />
        </Paper>
    );
} 
import { Box,Divider, Group, Loader, Pagination, Table, Text, TextInput, Select, Alert } from "@mantine/core";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { DateInput } from '@mantine/dates';
import PropTypes from 'prop-types';

const AttendanceDataTable = ({ title, data = [], columns, searchPlaceholder, isLoading, onDateRangeChange, selectedDate, error }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); 
    const itemsPerPage = 5;
    const [statusFilter, setStatusFilter] = useState('');

    const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

    // Search filter logic
    const filteredData = useMemo(() => {
        return safeData.filter(item => {
            const matchesSearch = Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Apply status filter if one is selected
            const matchesStatus = statusFilter 
                ? item.status === statusFilter
                : true;

            return matchesSearch && matchesStatus;
        });
    }, [safeData, searchTerm, statusFilter]);

    // Sorting logic
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Handle custom render column logic
                if (columns.find(col => col.accessor === sortConfig.key && col.render)) {
                    const column = columns.find(col => col.accessor === sortConfig.key);
                    const getValue = column?.sortBy ? column.sortBy(a) : a[sortConfig.key]; // Use sortBy function if available
                    const getBValue = column?.sortBy ? column.sortBy(b) : b[sortConfig.key];
                    return sortConfig.direction === 'asc' ? (getValue < getBValue ? -1 : 1) : (getValue > getBValue ? -1 : 1);
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig, columns]);

    // Paginated data
    const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const rows = paginatedData.map((item, index) => (
        <Table.Tr key={index}>
            {columns.map((column) => (
                <Table.Td key={column.accessor}>
                    {column.render ? column.render(item) : item[column.accessor]}
                </Table.Td>
            ))}
        </Table.Tr>
    ));

    if (error) {
        return (
            <Alert color="red" mb="md">
                {error}
            </Alert>
        );
    }

    const EmptyState = () => (
        <Box py="xl" ta="center">
            <Text c="dimmed">No attendance records found</Text>
        </Box>
    );

    return (
        <Box>
            <Group position="apart" mb="md">
                <Text size="lg" weight={500} style={{ marginRight: 'auto' }}>
                    {title}
                </Text>
                <Group>
                    <DateInput
                        placeholder="Pick date"
                        value={selectedDate}
                        onChange={(newDate) => {
                            if (newDate) {
                                onDateRangeChange(newDate);
                            }
                        }}
                        maxDate={new Date()}
                        clearable={false}
                    />
                    <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        clearable
                        data={[
                            { value: 'Present', label: 'Present' },
                            { value: 'Absent', label: 'Absent' },
                            { value: 'Halfday', label: 'Half day' },
                            { value: 'Not Set', label: 'Not Set' },
                        ]}
                    />
                </Group>
                <TextInput
                    placeholder={searchPlaceholder || 'Search...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
            </Group>
            <Divider variant="dashed" my="md" />
            <Table.ScrollContainer minWidth={800}>
                {isLoading ? (
                    <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <Loader />
                    </Box>
                ) : !paginatedData.length ? (
                    <EmptyState />
                ) : (
                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                {columns.map((column) => (
                                    <Table.Th key={column.accessor} onClick={() => handleSort(column.accessor)}>
                                        <Group spacing={4} position="apart">
                                            <Text>{column.header}</Text>
                                            {sortConfig.key === column.accessor && (
                                                sortConfig.direction === 'asc' ? (
                                                    <IconArrowUp size={16} />
                                                ) : (
                                                    <IconArrowDown size={16} />
                                                )
                                            )}
                                        </Group>
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                )}
            </Table.ScrollContainer>
            {paginatedData.length > 0 && (
                <Group position="apart" mt="md">
                    <Pagination
                        page={page}
                        onChange={setPage}
                        total={Math.ceil(sortedData.length / itemsPerPage)}
                    />
                </Group>
            )}
        </Box>
    );
};

AttendanceDataTable.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func
    })).isRequired,
    searchPlaceholder: PropTypes.string,
    isLoading: PropTypes.bool,
    onDateRangeChange: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    error: PropTypes.string
};

export default AttendanceDataTable;
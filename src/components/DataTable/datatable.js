import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Loader,
    Pagination,
    rem,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import { IconPencil, IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconEye } from "@tabler/icons-react";
import { MonthPickerInput } from "@mantine/dates"; // Import MonthPickerInput
import { useMemo, useState } from "react";

const DataTable = ({
    title,
    data = [],
    columns,
    onAddClick,
    onEditClick,
    onViewClick,
    onDeleteClick,
    searchPlaceholder,
    isLoading,
    onMonthChange,
    onMonthClear,
    monthPickerPlaceholder,
    hideMonthPicker,
    loading,
    error
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
    const [selectedMonth, setSelectedMonth] = useState(null);
    const itemsPerPage = 10;

    // Search filter logic
    const filteredData = useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

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
            <Table.Td>
                {/* Center the action buttons */}
                <Group gap={0} position="center">
                    {/* Conditional rendering for "View" action */}
                    {onViewClick && (
                        <ActionIcon variant="subtle" color="gray" onClick={() => onViewClick(item)}>
                            <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}

                    {/* Conditional rendering for "Edit" action */}
                    {onEditClick && (
                        <ActionIcon variant="subtle" color="gray" onClick={() => onEditClick(item)}>
                            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}

                    {/* Conditional rendering for "Delete" action */}
                    {onDeleteClick && (
                        <ActionIcon variant="subtle" color="red" onClick={() => onDeleteClick(item)}>
                            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        if (onMonthChange) {
            onMonthChange(month);
        }
    };

    const handleMonthClear = () => {
        setSelectedMonth(null);
        if (onMonthClear) {
            onMonthClear();
        }
    };

    return (
        <Box>
            <Group position="apart" mb="md">
                <Text size="lg" weight={500} style={{ marginRight: 'auto' }}>
                    {title}
                </Text>
                <Group>
                    <Button variant="light" onClick={onAddClick} leftSection={<IconPlus size={14} />}>
                        Add
                    </Button>
                    {
                        hideMonthPicker ? <div></div> : <MonthPickerInput
                            placeholder={monthPickerPlaceholder ?? "Pick a month"}
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            style={{ minWidth: '150px' }}
                            clearButtonProps={{
                                'aria-label': 'Clear month selection',
                                onClick: handleMonthClear,
                            }}
                            clearable
                        />
                    }

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
                                {/* Add the "Action" column */}
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>)}
            </Table.ScrollContainer>
            <Group position="apart" mt="md">
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={Math.ceil(sortedData.length / itemsPerPage)}
                />
            </Group>
        </Box>
    );
};

export default DataTable;
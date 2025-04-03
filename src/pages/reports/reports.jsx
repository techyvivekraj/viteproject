import React, { useState, useMemo } from 'react';
import { Container, Stack, Button, Group, Paper, Text, Grid, Card, Select, Tabs, RingProgress } from '@mantine/core';
import { IconDownload, IconChartBar, IconFileSpreadsheet, IconPrinter, IconFilter, IconCalendar } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { MonthPickerInput } from '@mantine/dates';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Mock data for demonstration
const reportsData = {
    financial: [
        {
            id: 1,
            category: 'Revenue',
            amount: 150000,
            previousAmount: 120000,
            change: '+25%',
            trend: 'up'
        },
        {
            id: 2,
            category: 'Expenses',
            amount: 80000,
            previousAmount: 75000,
            change: '+6.7%',
            trend: 'up'
        },
        {
            id: 3,
            category: 'Profit',
            amount: 70000,
            previousAmount: 45000,
            change: '+55.6%',
            trend: 'up'
        }
    ],
    employee: [
        {
            id: 1,
            department: 'Engineering',
            totalEmployees: 25,
            activeEmployees: 23,
            turnoverRate: '8%',
            newHires: 3
        },
        {
            id: 2,
            department: 'Marketing',
            totalEmployees: 15,
            activeEmployees: 15,
            turnoverRate: '0%',
            newHires: 0
        },
        {
            id: 3,
            department: 'Sales',
            totalEmployees: 20,
            activeEmployees: 18,
            turnoverRate: '10%',
            newHires: 2
        }
    ],
    performance: [
        {
            id: 1,
            metric: 'Average Response Time',
            value: '2.5s',
            target: '3s',
            status: 'good'
        },
        {
            id: 2,
            metric: 'Customer Satisfaction',
            value: '4.8/5',
            target: '4.5/5',
            status: 'good'
        },
        {
            id: 3,
            metric: 'System Uptime',
            value: '99.9%',
            target: '99.5%',
            status: 'good'
        }
    ]
};

const Reports = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [reportType, setReportType] = useState('financial');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    // Get unique departments for filter
    const departments = useMemo(() => {
        const uniqueDepts = [...new Set(reportsData.employee.map(item => item.department))];
        return ['all', ...uniqueDepts];
    }, [reportsData.employee]);

    const handleExportExcel = () => {
        // Prepare data for export based on selected report type
        let exportData = [];
        let fileName = '';

        switch (reportType) {
            case 'financial':
                exportData = reportsData.financial;
                fileName = 'financial_report';
                break;
            case 'employee':
                exportData = reportsData.employee;
                fileName = 'employee_report';
                break;
            case 'performance':
                exportData = reportsData.performance;
                fileName = 'performance_report';
                break;
        }

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create download link
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}_${selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handlePrintReport = () => {
        const generateReportPDF = () => {
            const doc = new jsPDF();
            
            // Add company header
            doc.setFontSize(20);
            doc.text('Company Name', 105, 20, { align: 'center' });
            doc.setFontSize(16);
            doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 105, 30, { align: 'center' });
            
            // Add date
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
            
            // Add data based on report type
            let data = [];
            let headers = [];
            
            switch (reportType) {
                case 'financial':
                    data = reportsData.financial.map(item => [
                        item.category,
                        `$${item.amount.toLocaleString()}`,
                        `$${item.previousAmount.toLocaleString()}`,
                        item.change
                    ]);
                    headers = ['Category', 'Amount', 'Previous Amount', 'Change'];
                    break;
                case 'employee':
                    data = reportsData.employee.map(item => [
                        item.department,
                        item.totalEmployees.toString(),
                        item.activeEmployees.toString(),
                        item.turnoverRate,
                        item.newHires.toString()
                    ]);
                    headers = ['Department', 'Total Employees', 'Active Employees', 'Turnover Rate', 'New Hires'];
                    break;
                case 'performance':
                    data = reportsData.performance.map(item => [
                        item.metric,
                        item.value,
                        item.target,
                        item.status
                    ]);
                    headers = ['Metric', 'Value', 'Target', 'Status'];
                    break;
            }
            
            doc.autoTable({
                startY: 50,
                head: [headers],
                body: data,
                theme: 'grid',
                headStyles: { fillColor: [71, 71, 71] }
            });
            
            return doc;
        };

        modals.openConfirmModal({
            title: 'Print Report',
            children: (
                <Text size="sm">
                    This will generate a PDF report for the selected report type.
                    The report will include:
                    • Company information
                    • Report type and date
                    • Detailed data and metrics
                    
                    Do you want to proceed?
                </Text>
            ),
            labels: { confirm: 'Print', cancel: 'Cancel' },
            onConfirm: () => {
                const doc = generateReportPDF();
                doc.save(`${reportType}_report_${selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}.pdf`);

                notifications.show({
                    title: 'Report Generated',
                    message: 'Successfully generated PDF report',
                    color: 'green'
                });
            }
        });
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleMonthClear = () => {
        setSelectedMonth(null);
    };

    return (
        <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
            <Stack spacing="xl">
                {/* Header Section */}
                <Group position="apart" align="center">
                    <Stack spacing={0}>
                        <Text size="xl" fw={700}>Reports & Analytics</Text>
                        <Text size="sm" c="dimmed">View and analyze various business metrics</Text>
                    </Stack>
                    <Group>
                        <Button 
                            leftIcon={<IconFileSpreadsheet size={16} />} 
                            onClick={handleExportExcel}
                            variant="light"
                            size="sm"
                        >
                            Export Excel
                        </Button>
                        <Button 
                            leftIcon={<IconPrinter size={16} />} 
                            onClick={handlePrintReport}
                            variant="light"
                            size="sm"
                        >
                            Print Report
                        </Button>
                    </Group>
                </Group>

                {/* Filters Section */}
                <Paper withBorder p="md" radius="md">
                    <Group grow align="flex-start" spacing="md">
                        <MonthPickerInput
                            label="Month"
                            placeholder="Select month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            clearButtonProps={{
                                'aria-label': 'Clear month selection',
                                onClick: handleMonthClear,
                            }}
                            clearable
                        />
                        <Select
                            label="Department"
                            placeholder="Select department"
                            data={departments}
                            value={departmentFilter}
                            onChange={setDepartmentFilter}
                        />
                    </Group>
                </Paper>

                {/* Report Type Tabs */}
                <Tabs value={reportType} onTabChange={setReportType}>
                    <Tabs.List>
                        <Tabs.Tab value="financial" icon={<IconChartBar size={14} />}>Financial</Tabs.Tab>
                        <Tabs.Tab value="employee" icon={<IconChartBar size={14} />}>Employee</Tabs.Tab>
                        <Tabs.Tab value="performance" icon={<IconChartBar size={14} />}>Performance</Tabs.Tab>
                    </Tabs.List>

                    {/* Financial Report Content */}
                    <Tabs.Panel value="financial" pt="md">
                        <Grid gutter="md">
                            {reportsData.financial.map((item) => (
                                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <Card withBorder p="md" radius="md" shadow="sm">
                                        <Stack align="center" spacing="xs">
                                            <Text size="sm" c="dimmed">{item.category}</Text>
                                            <Text fw={700} size="xl">${item.amount.toLocaleString()}</Text>
                                            <Group spacing="xs">
                                                <Text size="sm" c={item.trend === 'up' ? 'green' : 'red'}>
                                                    {item.change}
                                                </Text>
                                                <Text size="sm" c="dimmed">vs last period</Text>
                                            </Group>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Tabs.Panel>

                    {/* Employee Report Content */}
                    <Tabs.Panel value="employee" pt="md">
                        <Grid gutter="md">
                            {reportsData.employee.map((item) => (
                                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <Card withBorder p="md" radius="md" shadow="sm">
                                        <Stack align="center" spacing="xs">
                                            <Text size="sm" c="dimmed">{item.department}</Text>
                                            <Group position="center" spacing="xs">
                                                <RingProgress
                                                    size={50}
                                                    thickness={6}
                                                    sections={[
                                                        { value: (item.activeEmployees / item.totalEmployees) * 100, color: 'green' },
                                                        { value: ((item.totalEmployees - item.activeEmployees) / item.totalEmployees) * 100, color: 'red' }
                                                    ]}
                                                />
                                                <Stack spacing={0}>
                                                    <Text fw={700} size="lg">{item.activeEmployees}/{item.totalEmployees}</Text>
                                                    <Text size="sm" c="dimmed">Active</Text>
                                                </Stack>
                                            </Group>
                                            <Group spacing="xs">
                                                <Text size="sm" c="dimmed">Turnover:</Text>
                                                <Text size="sm" c={item.turnoverRate === '0%' ? 'green' : 'red'}>
                                                    {item.turnoverRate}
                                                </Text>
                                            </Group>
                                            <Text size="sm" c="dimmed">New Hires: {item.newHires}</Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Tabs.Panel>

                    {/* Performance Report Content */}
                    <Tabs.Panel value="performance" pt="md">
                        <Grid gutter="md">
                            {reportsData.performance.map((item) => (
                                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <Card withBorder p="md" radius="md" shadow="sm">
                                        <Stack align="center" spacing="xs">
                                            <Text size="sm" c="dimmed">{item.metric}</Text>
                                            <Text fw={700} size="xl">{item.value}</Text>
                                            <Group spacing="xs">
                                                <Text size="sm" c="dimmed">Target:</Text>
                                                <Text size="sm">{item.target}</Text>
                                            </Group>
                                            <Text size="sm" c={item.status === 'good' ? 'green' : 'red'}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Paper>
    );
};

export default Reports; 
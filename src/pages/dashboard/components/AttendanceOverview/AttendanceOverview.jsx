import { useEffect, useState } from 'react';
import { Paper, Title, Text, Group, SimpleGrid } from '@mantine/core';
import { IconUserCheck, IconUserExclamation, IconUserOff } from '@tabler/icons-react';
import { LineChart } from '@mantine/charts';
import { useAttendance } from '../../../../hooks/useAttendance.jsx';
import classes from './AttendanceOverview.module.css';

export default function AttendanceOverview() {
    const { stats } = useAttendance();
    const [chartData, setChartData] = useState([]);

    // Generate last 7 days data
    useEffect(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        // For demo purposes, generate random data
        // In production, this should come from your API
        const data = last7Days.map(date => ({
            date,
            present: Math.floor(Math.random() * 50) + 150, // 150-200 range
            absent: Math.floor(Math.random() * 20) + 10,   // 10-30 range
            late: Math.floor(Math.random() * 15) + 5      // 5-20 range
        }));

        setChartData(data);
    }, []);

    const summaryData = [
        { 
            title: 'Present Today', 
            value: stats.presentCount || '0', 
            icon: IconUserCheck, 
            color: 'teal' 
        },
        { 
            title: 'Late Entries', 
            value: stats.lateCount || '0', 
            icon: IconUserExclamation, 
            color: 'yellow' 
        },
        { 
            title: 'Absent', 
            value: stats.absentCount || '0', 
            icon: IconUserOff, 
            color: 'red' 
        },
    ];

    const statCards = summaryData.map((stat) => {
        const Icon = stat.icon;
        
        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="xs" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size="1.4rem" stroke={1.5} color={stat.color} />
                </Group>
                <Text className={classes.value} mt={25}>
                    {stat.value}
                </Text>
            </Paper>
        );
    });

    return (
        <Paper withBorder p="md" radius="md">
            <Title order={2} size="h3" mb="md">Attendance Overview</Title>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                {statCards}
            </SimpleGrid>

            <Paper withBorder p="md" radius="md">
                <Title order={3} size="h4" mb="md">Weekly Trend</Title>
                <LineChart
                    h={300}
                    data={chartData}
                    dataKey="date"
                    series={[
                        { name: 'present', color: 'teal' },
                        { name: 'absent', color: 'red' },
                        { name: 'late', color: 'yellow' },
                    ]}
                    tickLine="y"
                />
            </Paper>
        </Paper>
    );
} 
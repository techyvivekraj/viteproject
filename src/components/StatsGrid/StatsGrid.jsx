import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconUsers,
  IconUserOff,
  IconClipboardCheck,
  IconReportMoney,
  IconAlertCircle,
  IconChecklist,
  IconBuildingFactory,
  IconClock,
  IconArrowUpRight,
  IconArrowDownRight,
  IconUserCheck,
  IconClockPause,
} from '@tabler/icons-react';
import PropTypes from 'prop-types';
import classes from './StatsGrid.module.css';

const icons = {
  users: IconUsers,
  leave: IconUserOff,
  tasks: IconChecklist,
  departments: IconBuildingFactory,
  attendance: IconClock,
  pending: IconClipboardCheck,
  payroll: IconReportMoney,
  alerts: IconAlertCircle,
  userCheck: IconUserCheck,
  clock: IconClock,
  userOff: IconUserOff,
  clockPause: IconClockPause,
};

const defaultData = [
  { title: 'Total Employees', icon: 'users', value: '234', diff: 12 },
  { title: 'Today Attendance', icon: 'attendance', value: '205', diff: 8 },
  { title: 'Pending Tasks', icon: 'tasks', value: '15', diff: -5 },
  { title: 'Active Departments', icon: 'departments', value: '8', diff: 0 },
  { title: 'Pending Approvals', icon: 'alerts', value: '7', diff: -2 },
];

export default function StatsGrid({ data = defaultData, showDiff = false, vertical = false }) {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon 
            className={classes.icon} 
            size="1.4rem" 
            stroke={1.5} 
            style={stat.color ? { color: `var(--mantine-color-${stat.color}-6)` } : undefined}
          />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          {showDiff && stat.diff && (
            <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
              <span>{stat.diff}%</span>
              <DiffIcon size="1rem" stroke={1.5} />
            </Text>
          )}
        </Group>

        {showDiff && (
          <Text fz="xs" c="dimmed" mt={7}>
            Compared to previous month
          </Text>
        )}
      </Paper>
    );
  });

  return (
    <SimpleGrid 
      cols={{ base: 1, xs: 2, sm: 3, md: 5 }} 
      spacing="md"
    >
      {stats}
    </SimpleGrid>
  );
}

StatsGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      diff: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  showDiff: PropTypes.bool,
  vertical: PropTypes.bool
};
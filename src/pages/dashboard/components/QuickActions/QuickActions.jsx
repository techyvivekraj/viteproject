import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { 
  IconUserPlus, 
  IconClipboardCheck, 
  IconReportMoney, 
  IconClock,
  IconChartBar
} from '@tabler/icons-react';
import classes from './QuickActions.module.css';

const actions = [
  { title: 'Add Employee', icon: IconUserPlus, color: 'blue' },
  { title: 'Mark Attendance', icon: IconClock, color: 'teal' },
  { title: 'Leave Requests', icon: IconClipboardCheck, color: 'violet' },
  { title: 'Process Payroll', icon: IconReportMoney, color: 'orange' },
  { title: 'Reports', icon: IconChartBar, color: 'grape' }
];

export default function QuickActions() {
  return (
    <Group gap="xs" justify="end" mb="md">
      {actions.map((action) => (
        <Tooltip key={action.title} label={action.title}>
          <ActionIcon 
            variant="light" 
            color={action.color} 
            size="lg"
            className={classes.actionIcon}
          >
            <action.icon style={{ width: '1.2rem', height: '1.2rem' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      ))}
    </Group>
  );
} 
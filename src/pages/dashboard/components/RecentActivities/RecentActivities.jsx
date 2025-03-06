import { Paper, Title, Timeline, Text } from '@mantine/core';
import { 
  IconUserPlus, 
  IconClock, 
  IconReportMoney, 
  IconClipboardCheck 
} from '@tabler/icons-react';
// import classes from './RecentActivities.module.css';

const activities = [
  {
    title: 'New Employee Added',
    description: 'John Doe was added to IT Department',
    date: '2 hours ago',
    icon: IconUserPlus,
    color: 'blue'
  },
  {
    title: 'Attendance Marked',
    description: 'Bulk attendance marked for 45 employees',
    date: '4 hours ago',
    icon: IconClock,
    color: 'teal'
  },
  {
    title: 'Payroll Generated',
    description: 'Monthly payroll processed for Finance dept',
    date: '6 hours ago',
    icon: IconReportMoney,
    color: 'violet'
  },
  {
    title: 'Leave Approved',
    description: 'Vacation request approved for Jane Smith',
    date: '8 hours ago',
    icon: IconClipboardCheck,
    color: 'orange'
  },
];

export default function RecentActivities() {
  return (
    <Paper withBorder p="md" radius="md">
      <Title order={2} size="h3" mb="md">Recent Activities</Title>
      <Timeline active={activities.length - 1} bulletSize={24} lineWidth={2}>
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <Timeline.Item
              key={index}
              bullet={<Icon size="0.8rem" />}
              title={activity.title}
              color={activity.color}
            >
              <Text size="sm" mt={4}>{activity.description}</Text>
              <Text size="xs" mt={4} c="dimmed">{activity.date}</Text>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Paper>
  );
} 
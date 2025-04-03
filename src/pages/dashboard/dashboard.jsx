import { Grid, SimpleGrid, Container, Paper, Tabs, Text, Group, Stack } from '@mantine/core';
import { IconUser, IconCash, IconCalendarTime, IconChartBar, IconClipboardList, IconSchool, IconBell, IconSettings, IconFileText, IconMessage, IconScale, IconUsers, IconBellRinging, IconHelp } from '@tabler/icons-react';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import EmployeeProfile from './components/EmployeeProfile/EmployeeProfile';
import PayrollOverview from './components/PayrollOverview/PayrollOverview';
import AttendanceLeave from './components/AttendanceLeave/AttendanceLeave';
import PerformanceMetrics from './components/PerformanceMetrics/PerformanceMetrics';
import TaskOverview from './components/TaskOverview/TaskOverview';
import TrainingDevelopment from './components/TrainingDevelopment/TrainingDevelopment';
// import Announcements from './components/Announcements/Announcements';
// import SelfService from './components/SelfService/SelfService';
// import Analytics from './components/Analytics/Analytics';
// import Feedback from './components/Feedback/Feedback';
// import Compliance from './components/Compliance/Compliance';
// import TeamCollaboration from './components/TeamCollaboration/TeamCollaboration';
// import Notifications from './components/Notifications/Notifications';
// import Support from './components/Support/Support';

const Dashboard = () => {
  const dashboardStats = [
    { title: 'Total Employees', icon: 'users', value: '234', color: 'blue' },
    { title: 'Present Today', icon: 'userCheck', value: '205', color: 'green' },
    { title: 'Late Today', icon: 'clock', value: '15', color: 'yellow' },
    { title: 'Absent Today', icon: 'userOff', value: '14', color: 'red' },
    { title: 'On Leave', icon: 'calendar', value: '12', color: 'violet' },
    { title: 'New Hires', icon: 'userPlus', value: '5', color: 'teal' },
    { title: 'Pending Approvals', icon: 'clipboardCheck', value: '8', color: 'orange' },
    { title: 'Upcoming Reviews', icon: 'star', value: '15', color: 'indigo' },
  ];

  return (
    <Container fluid p="md" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Stack spacing="md">
        {/* Quick Stats */}
        <Paper p="md" radius="md" withBorder>
          <StatsGrid data={dashboardStats} />
        </Paper>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="profile" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="profile" icon={<IconUser size={14} />}>Profile</Tabs.Tab>
            <Tabs.Tab value="payroll" icon={<IconCash size={14} />}>Payroll</Tabs.Tab>
            <Tabs.Tab value="attendance" icon={<IconCalendarTime size={14} />}>Attendance</Tabs.Tab>
            <Tabs.Tab value="performance" icon={<IconChartBar size={14} />}>Performance</Tabs.Tab>
            <Tabs.Tab value="tasks" icon={<IconClipboardList size={14} />}>Tasks</Tabs.Tab>
            <Tabs.Tab value="training" icon={<IconSchool size={14} />}>Training</Tabs.Tab>
            <Tabs.Tab value="announcements" icon={<IconBell size={14} />}>Announcements</Tabs.Tab>
            <Tabs.Tab value="self-service" icon={<IconSettings size={14} />}>Self Service</Tabs.Tab>
            <Tabs.Tab value="analytics" icon={<IconFileText size={14} />}>Analytics</Tabs.Tab>
            <Tabs.Tab value="feedback" icon={<IconMessage size={14} />}>Feedback</Tabs.Tab>
            <Tabs.Tab value="compliance" icon={<IconScale size={14} />}>Compliance</Tabs.Tab>
            <Tabs.Tab value="team" icon={<IconUsers size={14} />}>Team</Tabs.Tab>
            <Tabs.Tab value="notifications" icon={<IconBellRinging size={14} />}>Notifications</Tabs.Tab>
            <Tabs.Tab value="support" icon={<IconHelp size={14} />}>Support</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <EmployeeProfile />
          </Tabs.Panel>

          <Tabs.Panel value="payroll" pt="md">
            <PayrollOverview />
          </Tabs.Panel>

          <Tabs.Panel value="attendance" pt="md">
            <AttendanceLeave />
          </Tabs.Panel>

          <Tabs.Panel value="performance" pt="md">
            <PerformanceMetrics />
          </Tabs.Panel>

          <Tabs.Panel value="tasks" pt="md">
            <TaskOverview />
          </Tabs.Panel>

          <Tabs.Panel value="training" pt="md">
            <TrainingDevelopment />
          </Tabs.Panel>

          {/* <Tabs.Panel value="announcements" pt="md">
            <Announcements />
          </Tabs.Panel>

          <Tabs.Panel value="self-service" pt="md">
            <SelfService />
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <Analytics />
          </Tabs.Panel>

          <Tabs.Panel value="feedback" pt="md">
            <Feedback />
          </Tabs.Panel>

          <Tabs.Panel value="compliance" pt="md">
            <Compliance />
          </Tabs.Panel>

          <Tabs.Panel value="team" pt="md">
            <TeamCollaboration />
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="md">
            <Notifications />
          </Tabs.Panel>

          <Tabs.Panel value="support" pt="md">
            <Support />
          </Tabs.Panel> */}
        </Tabs>
      </Stack>
    </Container>
  );
};

export default Dashboard;
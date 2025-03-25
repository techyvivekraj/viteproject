import { Grid, SimpleGrid } from '@mantine/core';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import AttendanceOverview from './components/AttendanceOverview/AttendanceOverview';
// import PayrollSummary from './components/PayrollSummary/PayrollSummary';
// import EmployeeStats from './components/EmployeeStats/EmployeeStats';
// import RecentActivities from './components/RecentActivities/RecentActivities';
// import Notifications from './components/Notifications/Notifications';
// import TaskManagement from './components/TaskManagement/TaskManagement';
// import RecruitmentPipeline from './components/RecruitmentPipeline/RecruitmentPipeline';
// import QuickConnect from './components/QuickConnect/QuickConnect';

const Dashboard = () => {
  const dashboardStats = [
    { title: 'Total Employees', icon: 'users', value: '234', color: 'blue' },
    { title: 'Present Today', icon: 'userCheck', value: '205', color: 'green' },
    { title: 'Late Today', icon: 'clock', value: '15', color: 'yellow' },
    { title: 'Absent Today', icon: 'userOff', value: '14', color: 'red' },
    { title: 'Not Set', icon: 'clockPause', value: '7', color: 'gray' },
  ];

  return (
    // <Container fluid mt="md">
      <Grid gutter="md">
        <Grid.Col span={12}>
          <StatsGrid data={dashboardStats} />
        </Grid.Col>

        <Grid.Col span={12}>
          <AttendanceOverview />
        </Grid.Col>

        <Grid.Col span={12}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {/* <TaskManagement /> */}
          </SimpleGrid>
        </Grid.Col>

        <Grid.Col span={12}>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {/* <EmployeeStats />
            <QuickConnect />
            <PayrollSummary /> */}
          </SimpleGrid>
        </Grid.Col>

        <Grid.Col span={12}>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {/* <RecruitmentPipeline />
            <Notifications />
            <RecentActivities /> */}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    // </Container>
  );
};

export default Dashboard;
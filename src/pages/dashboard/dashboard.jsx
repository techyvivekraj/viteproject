import { Grid, SimpleGrid } from '@mantine/core';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
// import PayrollSummary from './components/PayrollSummary/PayrollSummary';
// import EmployeeStats from './components/EmployeeStats/EmployeeStats';
// import RecentActivities from './components/RecentActivities/RecentActivities';
// import Notifications from './components/Notifications/Notifications';
// import AttendanceOverview from './components/AttendanceOverview/AttendanceOverview';
// import TaskManagement from './components/TaskManagement/TaskManagement';
// import RecruitmentPipeline from './components/RecruitmentPipeline/RecruitmentPipeline';
// import QuickConnect from './components/QuickConnect/QuickConnect';

const Dashboard = () => {
  return (
    // <Container fluid mt="md">
      <Grid gutter="md">
        <Grid.Col span={12}>
          <StatsGrid />
        </Grid.Col>

        <Grid.Col span={12}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {/* <TaskManagement />
            <AttendanceOverview /> */}
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
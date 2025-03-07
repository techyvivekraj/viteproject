import { Tabs, Grid, Paper, } from '@mantine/core';
import Departments from './departments/departments';
import Asstes from './assets/assets';
import Roles from './roles/roles';
import Shift from './shift/shift';
import Holidays from './holidays/holidays';

const Organisation = () => {
  return (
    <Paper radius="md" p="lg" bg="var(--mantine-color-body)">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
          <Tabs defaultValue="departments">
            <Tabs.List>
              <Tabs.Tab value="departments">Departments</Tabs.Tab>
              <Tabs.Tab value="roles">Roles</Tabs.Tab>
              <Tabs.Tab value="assets">Assets</Tabs.Tab>
              <Tabs.Tab value="shifts">Shifts</Tabs.Tab>
              <Tabs.Tab value="holidays">Holidays</Tabs.Tab>
              <Tabs.Tab value="templates">Templates</Tabs.Tab>
              <Tabs.Tab value="locations">Locations</Tabs.Tab>
              <Tabs.Tab value="policies">Policies</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="departments" pt="xs">
              <Departments />
            </Tabs.Panel>
            <Tabs.Panel value="roles" pt="xs">
              <Roles />
            </Tabs.Panel>
            <Tabs.Panel value="assets" pt="xs">
              <Asstes />
            </Tabs.Panel>
            <Tabs.Panel value="shifts" pt="xs">
              <Shift />
            </Tabs.Panel>
            <Tabs.Panel value="holidays" pt="xs">
              <Holidays />
            </Tabs.Panel>
            <Tabs.Panel value="templates" pt="xs"></Tabs.Panel>
            <Tabs.Panel value="locations" pt="xs"></Tabs.Panel>
            <Tabs.Panel value="policies" pt="xs"></Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default Organisation;
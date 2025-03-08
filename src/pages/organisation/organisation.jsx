import { Tabs, Grid, Paper, } from '@mantine/core';
import { useState } from 'react';
import Departments from './departments/departments';
import Asstes from './assets/assets';
import Roles from './roles/roles';
import Shift from './shift/shift';
import Holidays from './holidays/holidays';

const Organisation = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const renderTabContent = (tab) => {
    if (tab !== activeTab) return null;
    
    switch (tab) {
      case 'departments':
        return <Departments />;
      case 'roles':
        return <Roles />;
      case 'assets':
        return <Asstes />;
      case 'shifts':
        return <Shift />;
      case 'holidays':
        return <Holidays />;
      default:
        return null;
    }
  };

  return (
    <Paper radius="md" p="lg" bg="var(--mantine-color-body)">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
          <Tabs value={activeTab} onChange={setActiveTab}>
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
              {renderTabContent('departments')}
            </Tabs.Panel>
            <Tabs.Panel value="roles" pt="xs">
              {renderTabContent('roles')}
            </Tabs.Panel>
            <Tabs.Panel value="assets" pt="xs">
              {renderTabContent('assets')}
            </Tabs.Panel>
            <Tabs.Panel value="shifts" pt="xs">
              {renderTabContent('shifts')}
            </Tabs.Panel>
            <Tabs.Panel value="holidays" pt="xs">
              {renderTabContent('holidays')}
            </Tabs.Panel>
            <Tabs.Panel value="templates" pt="xs">
              {renderTabContent('templates')}
            </Tabs.Panel>
            <Tabs.Panel value="locations" pt="xs">
              {renderTabContent('locations')}
            </Tabs.Panel>
            <Tabs.Panel value="policies" pt="xs">
              {renderTabContent('policies')}
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default Organisation;
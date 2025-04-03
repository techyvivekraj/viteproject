import { SimpleGrid, Paper, Text, Group } from '@mantine/core';
import { IconUsers, IconUserCheck, IconClock, IconUserOff, IconCalendar, IconUserPlus, IconClipboardCheck, IconStar } from '@tabler/icons-react';
import PropTypes from 'prop-types';

const StatsGrid = ({ data }) => {
  const getIcon = (iconName, color) => {
    const iconProps = {
      size: 20,
      stroke: 1.5,
      color: `var(--mantine-color-${color}-6)`
    };

    switch (iconName) {
      case 'users':
        return <IconUsers {...iconProps} />;
      case 'userCheck':
        return <IconUserCheck {...iconProps} />;
      case 'clock':
        return <IconClock {...iconProps} />;
      case 'userOff':
        return <IconUserOff {...iconProps} />;
      case 'calendar':
        return <IconCalendar {...iconProps} />;
      case 'userPlus':
        return <IconUserPlus {...iconProps} />;
      case 'clipboardCheck':
        return <IconClipboardCheck {...iconProps} />;
      case 'star':
        return <IconStar {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {data.map((stat) => (
        <Paper
          key={stat.title}
          p="md"
          radius="sm"
          withBorder
          style={{
            borderLeft: `4px solid var(--mantine-color-${stat.color}-6)`,
            backgroundColor: 'white'
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              {stat.title}
            </Text>
            {getIcon(stat.icon, stat.color)}
          </Group>
          <Text fw={600} size="xl" c={`${stat.color}.7`}>
            {stat.value}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
};

StatsGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
};

export default StatsGrid;
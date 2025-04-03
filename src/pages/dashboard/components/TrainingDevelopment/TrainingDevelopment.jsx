import { Grid, Paper, Text, Group, Stack, Divider, Button, Badge, Progress, Card, ActionIcon } from '@mantine/core';
import { IconSchool, IconCertificate, IconBook, IconVideo, IconDownload, IconClock, IconCheck, IconPlus, IconStar } from '@tabler/icons-react';

const TrainingDevelopment = () => {
  // Mock data - replace with actual data from your backend
  const trainingData = {
    enrolledPrograms: [
      {
        title: 'Advanced React Development',
        provider: 'Udemy',
        progress: 75,
        duration: '8 weeks',
        deadline: '2024-04-30',
        type: 'Online Course'
      },
      {
        title: 'Leadership Fundamentals',
        provider: 'Internal Training',
        progress: 40,
        duration: '12 weeks',
        deadline: '2024-06-15',
        type: 'Workshop'
      },
      {
        title: 'AWS Cloud Practitioner',
        provider: 'AWS',
        progress: 20,
        duration: '6 weeks',
        deadline: '2024-05-20',
        type: 'Certification'
      }
    ],
    completedCertifications: [
      {
        title: 'React Fundamentals',
        provider: 'Udemy',
        date: '2024-02-15',
        certificateId: 'REACT-2024-001'
      },
      {
        title: 'Project Management Basics',
        provider: 'Coursera',
        date: '2024-01-20',
        certificateId: 'PM-2024-002'
      }
    ],
    recommendedCourses: [
      {
        title: 'TypeScript Mastery',
        provider: 'Udemy',
        duration: '6 weeks',
        level: 'Intermediate',
        rating: 4.8
      },
      {
        title: 'DevOps Fundamentals',
        provider: 'Coursera',
        duration: '8 weeks',
        level: 'Beginner',
        rating: 4.6
      }
    ],
    learningStats: {
      totalHours: 45,
      completedCourses: 5,
      certificatesEarned: 3,
      currentStreak: 7
    }
  };

  return (
    <Grid gutter="md">
      {/* Learning Stats */}
      <Grid.Col span={12}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Learning Progress</Text>
              <IconSchool size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Divider />
            <Grid>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600}>{trainingData.learningStats.totalHours}</Text>
                  <Text size="sm" c="dimmed">Total Learning Hours</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600}>{trainingData.learningStats.completedCourses}</Text>
                  <Text size="sm" c="dimmed">Completed Courses</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600}>{trainingData.learningStats.certificatesEarned}</Text>
                  <Text size="sm" c="dimmed">Certificates Earned</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600}>{trainingData.learningStats.currentStreak}</Text>
                  <Text size="sm" c="dimmed">Day Streak</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Enrolled Programs */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Enrolled Programs</Text>
              <Button variant="light" size="xs" leftIcon={<IconPlus size={14} />}>
                Enroll New
              </Button>
            </Group>
            <Divider />
            <Stack spacing="md">
              {trainingData.enrolledPrograms.map((program, index) => (
                <Card key={index} withBorder>
                  <Stack spacing="xs">
                    <Group position="apart">
                      <Text size="sm" fw={500}>{program.title}</Text>
                      <Badge color="blue">{program.type}</Badge>
                    </Group>
                    <Text size="xs" c="dimmed">{program.provider}</Text>
                    <Progress value={program.progress} color="blue" />
                    <Group position="apart">
                      <Text size="xs" c="dimmed">
                        <IconClock size={12} style={{ marginRight: 4 }} />
                        {program.duration}
                      </Text>
                      <Text size="xs" fw={500}>{program.progress}% Complete</Text>
                    </Group>
                    <Group position="apart">
                      <Text size="xs" c="dimmed">Deadline: {program.deadline}</Text>
                      <Button variant="light" size="xs" leftIcon={<IconDownload size={12} />}>
                        Download Materials
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Completed Certifications and Recommended Courses */}
      <Grid.Col span={12} md={4}>
        <Stack spacing="md">
          {/* Completed Certifications */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Completed Certifications</Text>
                <IconCertificate size={20} color="var(--mantine-color-green-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {trainingData.completedCertifications.map((cert, index) => (
                  <Card key={index} withBorder>
                    <Stack spacing="xs">
                      <Text size="sm" fw={500}>{cert.title}</Text>
                      <Text size="xs" c="dimmed">{cert.provider}</Text>
                      <Group position="apart">
                        <Text size="xs" c="dimmed">ID: {cert.certificateId}</Text>
                        <Text size="xs" fw={500}>{cert.date}</Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Recommended Courses */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Recommended Courses</Text>
                <IconBook size={20} color="var(--mantine-color-violet-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {trainingData.recommendedCourses.map((course, index) => (
                  <Card key={index} withBorder>
                    <Stack spacing="xs">
                      <Text size="sm" fw={500}>{course.title}</Text>
                      <Text size="xs" c="dimmed">{course.provider}</Text>
                      <Group position="apart">
                        <Badge color="violet" variant="light">{course.level}</Badge>
                        <Text size="xs" fw={500}>
                          <IconStar size={12} style={{ marginRight: 4 }} />
                          {course.rating}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        <IconClock size={12} style={{ marginRight: 4 }} />
                        {course.duration}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default TrainingDevelopment; 
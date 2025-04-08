import React, { useState } from 'react';
import {
  Title,
  Paper,
  Stack,
  Text,
  Accordion,
  Button,
  Group,
  TextInput,
  Textarea,
  Alert,
  Anchor,
  List,
  ThemeIcon,
  Container,
  Grid,
  Card,
  rem,
  Divider,
} from '@mantine/core';
import {
  Mail,
  MessageSquare,
  FileText,
  Book,
  Video,
  AlertTriangle,
  Check,
  Search,
} from 'lucide-react';

export default function Help() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    description: '',
  });

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.',
    },
    {
      question: 'How do I add a new employee?',
      answer: 'To add a new employee, go to the Organization page, click on the "Add Employee" button, and fill out the required information in the form.',
    },
    {
      question: 'How do I approve a leave request?',
      answer: 'To approve a leave request, go to the Leave Management page, find the pending request, and click the "Approve" button. You can also add comments before approving.',
    },
    {
      question: 'How do I generate reports?',
      answer: 'Reports can be generated from various pages. Look for the "Generate Report" button, select the desired parameters, and click "Generate" to download the report.',
    },
  ];

  const documentation = [
    {
      title: 'User Guide',
      description: 'Complete guide to using the HR management system',
      icon: <Book style={{ width: rem(16), height: rem(16) }} />,
      link: '/docs/user-guide',
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for API integration',
      icon: <FileText style={{ width: rem(16), height: rem(16) }} />,
      link: '/docs/api',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: <Video style={{ width: rem(16), height: rem(16) }} />,
      link: '/docs/videos',
    },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Support ticket submitted successfully');
      setSupportTicket({ subject: '', description: '' });
    } catch (error) {
      setError('Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Help & Support</Title>
          <TextInput
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search style={{ width: rem(16), height: rem(16) }} />}
            style={{ width: 300 }}
          />
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="xl">
                  <Stack>
                    <Title order={3}>Frequently Asked Questions</Title>
                    <Text c="dimmed">Find answers to common questions about using the system</Text>
                  </Stack>

                  <Accordion variant="separated">
                    {filteredFaqs.map((faq, index) => (
                      <Accordion.Item key={index} value={index.toString()}>
                        <Accordion.Control>{faq.question}</Accordion.Control>
                        <Accordion.Panel>{faq.answer}</Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Stack>
              </Paper>

              <Paper withBorder radius="md" p="md">
                <Stack gap="xl">
                  <Stack>
                    <Title order={3}>Contact Support</Title>
                    <Text c="dimmed">Need help? Submit a support ticket or reach out to our team</Text>
                  </Stack>

                  {error && (
                    <Alert
                      icon={<AlertTriangle style={{ width: rem(16), height: rem(16) }} />}
                      title="Error"
                      color="red"
                      variant="light"
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      icon={<Check style={{ width: rem(16), height: rem(16) }} />}
                      title="Success"
                      color="green"
                      variant="light"
                    >
                      {success}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmitTicket}>
                    <Stack gap="md">
                      <TextInput
                        label="Subject"
                        value={supportTicket.subject}
                        onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.currentTarget.value })}
                        required
                        placeholder="Brief description of your issue"
                      />
                      <Textarea
                        label="Description"
                        value={supportTicket.description}
                        onChange={(e) => setSupportTicket({ ...supportTicket, description: e.currentTarget.value })}
                        required
                        placeholder="Detailed description of your issue"
                        minRows={4}
                      />
                      <Group justify="flex-end">
                        <Button type="submit" loading={loading}>
                          Submit Ticket
                        </Button>
                      </Group>
                    </Stack>
                  </form>

                  <Divider />

                  <Stack gap="md">
                    <Text fw={500}>Other ways to reach us:</Text>
                    <List spacing="sm">
                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <Mail style={{ width: rem(16), height: rem(16) }} />
                          </ThemeIcon>
                        }
                      >
                        <Anchor href="mailto:support@example.com">
                          support@example.com
                        </Anchor>
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <MessageSquare style={{ width: rem(16), height: rem(16) }} />
                          </ThemeIcon>
                        }
                      >
                        <Anchor href="https://example.com/chat" target="_blank">
                          Live Chat
                        </Anchor>
                      </List.Item>
                    </List>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="xl">
                  <Stack>
                    <Title order={3}>Documentation</Title>
                    <Text c="dimmed">Access guides and resources to help you get started</Text>
                  </Stack>

                  <Stack gap="md">
                    {documentation.map((doc, index) => (
                      <Card key={index} withBorder padding="md" radius="md">
                        <Group gap="md">
                          <ThemeIcon color="blue" size={32} radius="md">
                            {doc.icon}
                          </ThemeIcon>
                          <Stack gap={4}>
                            <Anchor href={doc.link} target="_blank" fw={500}>
                              {doc.title}
                            </Anchor>
                            <Text size="sm" c="dimmed">
                              {doc.description}
                            </Text>
                          </Stack>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
} 
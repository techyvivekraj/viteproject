import { Paper, Title, TextInput, Textarea, Button, Select, Group } from '@mantine/core';
import { IconSend, IconMail } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import classes from './QuickConnect.module.css';

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'hr', label: 'HR Department' },
  { value: 'it', label: 'IT Department' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

export default function QuickConnect() {
  const form = useForm({
    initialValues: {
      to: 'all',
      subject: '',
      message: '',
    },
    validate: {
      subject: (value) => (value.length < 3 ? 'Subject must be at least 3 characters' : null),
      message: (value) => (value.length < 10 ? 'Message must be at least 10 characters' : null),
    },
  });

  const handleSubmit = (values) => {
    console.log('Sending message:', values);
    // Add your email sending logic here
    form.reset();
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={2} size="h3" mb="md">Quick Connect</Title>

      <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
        <Select
          label="To"
          placeholder="Select department"
          data={departments}
          {...form.getInputProps('to')}
          mb="sm"
        />

        <TextInput
          label="Subject"
          placeholder="Enter message subject"
          icon={<IconMail size="1rem" />}
          {...form.getInputProps('subject')}
          mb="sm"
        />

        <Textarea
          label="Message"
          placeholder="Type your message here..."
          minRows={3}
          maxRows={4}
          {...form.getInputProps('message')}
          mb="md"
        />

        <Group justify="flex-end">
          <Button 
            type="submit" 
            leftSection={<IconSend size="1rem" />}
            className={classes.submitButton}
          >
            Send Message
          </Button>
        </Group>
      </form>
    </Paper>
  );
} 
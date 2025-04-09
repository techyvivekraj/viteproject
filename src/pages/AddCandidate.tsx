import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Paper,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  FileInput,
  LoadingOverlay,
} from '@mantine/core';

export default function AddCandidate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    experience_years: 0,
    resume_url: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically make an API call to save the candidate
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to the recruitment page
      navigate('/recruitment');
    } catch (error) {
      console.error('Error adding candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruitment');
  };

  return (
    <Container size="md">
      <Paper withBorder radius="md" p="xl" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Title order={2}>Add New Candidate</Title>
            
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
            </Group>
            
            <Group grow>
              <TextInput
                label="Email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <TextInput
                label="Phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </Group>
            
            <Group grow>
              <TextInput
                label="Position"
                placeholder="Enter position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              />
              <Select
                label="Department"
                placeholder="Select department"
                data={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Finance', label: 'Finance' },
                ]}
                value={formData.department}
                onChange={(value) => handleChange('department', value)}
                required
              />
            </Group>
            
            <NumberInput
              label="Years of Experience"
              placeholder="Enter years of experience"
              value={formData.experience_years}
              onChange={(value) => handleChange('experience_years', value)}
              min={0}
              required
            />
            
            <FileInput
              label="Resume"
              placeholder="Upload resume"
              accept=".pdf,.doc,.docx"
              onChange={(file) => {
                // In a real app, you would upload the file to a server
                // and get back a URL to store in resume_url
                if (file) {
                  handleChange('resume_url', URL.createObjectURL(file));
                }
              }}
              required
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Add Candidate
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 
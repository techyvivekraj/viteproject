import React, { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Tabs,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Card,
  Grid,
  Avatar,
  Tooltip,
  TextInput,
  Modal,
  Textarea,
  Select,
  FileInput,
  Image,
  Anchor,
  Divider,
  Box,
  Flex,
  TextareaProps,
  TextInputProps,
  SelectProps,
  FileInputProps,
  Table,
} from '@mantine/core';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen,
  Link,
  Image as ImageIcon,
  Video,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { TrainingContent, TrainingCategory } from '../types';

// Mock data for training categories
const mockCategories: TrainingCategory[] = [
  {
    id: '1',
    name: 'Onboarding',
    description: 'Training materials for new employees',
    department: 'All',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Technical Skills',
    description: 'Technical training for developers',
    department: 'Engineering',
    created_at: '2024-03-02T11:00:00Z',
    updated_at: '2024-03-02T11:00:00Z',
  },
  {
    id: '3',
    name: 'Soft Skills',
    description: 'Communication and leadership training',
    department: 'All',
    created_at: '2024-03-03T12:00:00Z',
    updated_at: '2024-03-03T12:00:00Z',
  },
  {
    id: '4',
    name: 'Compliance',
    description: 'Legal and regulatory compliance training',
    department: 'All',
    created_at: '2024-03-04T13:00:00Z',
    updated_at: '2024-03-04T13:00:00Z',
  },
];

// Mock data for training content
const mockTrainingContent: TrainingContent[] = [
  {
    id: '1',
    title: 'Introduction to Company Culture',
    description: 'Learn about our company values and culture',
    content_type: 'text',
    content: 'Our company culture is built on the following principles:\n\n1. Innovation\n2. Collaboration\n3. Integrity\n4. Excellence\n\nWe believe in fostering an environment where employees can thrive and grow.',
    department: 'All',
    category: '1',
    created_by: '101',
    created_by_name: 'John Manager',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
    is_published: true,
    published_at: '2024-03-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    content_type: 'url',
    content: 'https://reactjs.org/docs/getting-started.html',
    department: 'Engineering',
    category: '2',
    created_by: '102',
    created_by_name: 'Sarah Tech Lead',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
    is_published: true,
    published_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Effective Communication',
    description: 'Tips for improving workplace communication',
    content_type: 'video',
    content: 'https://example.com/videos/effective-communication.mp4',
    thumbnail_url: 'https://example.com/thumbnails/communication.jpg',
    department: 'All',
    category: '3',
    created_by: '103',
    created_by_name: 'Michael HR',
    created_at: '2024-03-20T11:00:00Z',
    updated_at: '2024-03-20T11:00:00Z',
    is_published: true,
    published_at: '2024-03-20T11:00:00Z',
  },
  {
    id: '4',
    title: 'Data Privacy Guidelines',
    description: 'Understanding data privacy regulations',
    content_type: 'image',
    content: 'https://example.com/images/data-privacy-guidelines.jpg',
    department: 'All',
    category: '4',
    created_by: '104',
    created_by_name: 'Lisa Compliance',
    created_at: '2024-03-25T12:00:00Z',
    updated_at: '2024-03-25T12:00:00Z',
    is_published: false,
  },
];

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <FileText size={16} />;
    case 'url':
      return <Link size={16} />;
    case 'image':
      return <ImageIcon size={16} />;
    case 'video':
      return <Video size={16} />;
    default:
      return <FileText size={16} />;
  }
};

const getContentTypeColor = (type: string) => {
  switch (type) {
    case 'text':
      return 'blue';
    case 'url':
      return 'green';
    case 'image':
      return 'violet';
    case 'video':
      return 'red';
    default:
      return 'gray';
  }
};

export default function Training() {
  const [activeTab, setActiveTab] = useState<string | null>('content');
  const [trainingContent, setTrainingContent] = useState<TrainingContent[]>([]);
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<TrainingContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text',
    content: '',
    department: '',
    category: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterContentType, setFilterContentType] = useState<string | null>(null);
  const userRole = useOrganizationStore((state) => state.userRole);
  const userDepartment = 'Engineering'; // This would come from user profile in a real app

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTrainingContent(mockTrainingContent);
      setCategories(mockCategories);
      setLoading(false);
    };

    fetchData();
  }, []);

  const canManageTraining = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      description: '',
      content_type: 'text',
      content: '',
      department: userDepartment,
      category: '',
    });
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (content: TrainingContent) => {
    setSelectedContent(content);
    setFormData({
      title: content.title,
      description: content.description,
      content_type: content.content_type,
      content: content.content,
      department: content.department,
      category: content.category,
    });
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (content: TrainingContent) => {
    setSelectedContent(content);
    setDeleteModalOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddContent = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newContent: TrainingContent = {
        id: (trainingContent.length + 1).toString(),
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type as 'text' | 'url' | 'image' | 'video',
        content: formData.content,
        department: formData.department,
        category: formData.category,
        created_by: '101', // This would come from user profile in a real app
        created_by_name: 'Current User', // This would come from user profile in a real app
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_published: false,
      };
      
      setTrainingContent(prev => [...prev, newContent]);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = async () => {
    if (!selectedContent) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the content in the state
      setTrainingContent(prev => 
        prev.map(content => 
          content.id === selectedContent.id 
            ? { 
                ...content, 
                title: formData.title,
                description: formData.description,
                content_type: formData.content_type as 'text' | 'url' | 'image' | 'video',
                content: formData.content,
                department: formData.department,
                category: formData.category,
                updated_at: new Date().toISOString()
              } 
            : content
        )
      );
      
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedContent) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the content from the state
      setTrainingContent(prev => prev.filter(content => content.id !== selectedContent.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishContent = async (content: TrainingContent) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the content in the state
      setTrainingContent(prev => 
        prev.map(item => 
          item.id === content.id 
            ? { 
                ...item, 
                is_published: true,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : item
        )
      );
    } catch (error) {
      console.error('Error publishing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublishContent = async (content: TrainingContent) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the content in the state
      setTrainingContent(prev => 
        prev.map(item => 
          item.id === content.id 
            ? { 
                ...item, 
                is_published: false,
                published_at: undefined,
                updated_at: new Date().toISOString()
              } 
            : item
        )
      );
    } catch (error) {
      console.error('Error unpublishing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = trainingContent.filter(content => {
    // Filter by search query
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = !filterDepartment || content.department === filterDepartment;
    
    // Filter by category
    const matchesCategory = !filterCategory || content.category === filterCategory;
    
    // Filter by content type
    const matchesContentType = !filterContentType || content.content_type === filterContentType;
    
    return matchesSearch && matchesDepartment && matchesCategory && matchesContentType;
  });

  const renderContentPreview = (content: TrainingContent) => {
    switch (content.content_type) {
      case 'text':
        return (
          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
              {content.content}
            </Text>
          </Paper>
        );
      case 'url':
        return (
          <Anchor href={content.content} target="_blank" rel="noopener noreferrer">
            {content.content}
          </Anchor>
        );
      case 'image':
        return (
          <Box>
            <Image
              src={content.content}
              alt={content.title}
              height={200}
              fallbackSrc="https://placehold.co/600x400?text=Image+not+found"
            />
          </Box>
        );
      case 'video':
        return (
          <Box>
            {content.thumbnail_url ? (
              <Image
                src={content.thumbnail_url}
                alt={content.title}
                height={200}
                fallbackSrc="https://placehold.co/600x400?text=Video+thumbnail+not+found"
              />
            ) : (
              <Paper withBorder p="xl" radius="md" bg="gray.0" h={200} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={48} />
              </Paper>
            )}
            <Anchor href={content.content} target="_blank" rel="noopener noreferrer" mt="xs">
              Watch Video
            </Anchor>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Training</Title>
          {canManageTraining && (
            <Button leftSection={<Plus size={20} />} onClick={handleOpenAddModal}>
              Add Training Content
            </Button>
          )}
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="content" leftSection={<BookOpen size={16} />}>
              Training Content
            </Tabs.Tab>
            <Tabs.Tab value="categories" leftSection={<FileText size={16} />}>
              Categories
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="content" pt="md">
            <Paper withBorder radius="md" p="md">
              <Stack mb="md">
                <TextInput
                  placeholder="Search training content..."
                  leftSection={<Search size={20} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
                <Group grow>
                  <Select
                    placeholder="Department"
                    data={['All', 'Engineering', 'Marketing', 'HR', 'Finance']}
                    leftSection={<Filter size={20} />}
                    value={filterDepartment}
                    onChange={setFilterDepartment}
                    clearable
                  />
                  <Select
                    placeholder="Category"
                    data={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    leftSection={<Filter size={20} />}
                    value={filterCategory}
                    onChange={setFilterCategory}
                    clearable
                  />
                  <Select
                    placeholder="Content Type"
                    data={[
                      { value: 'text', label: 'Text' },
                      { value: 'url', label: 'URL' },
                      { value: 'image', label: 'Image' },
                      { value: 'video', label: 'Video' },
                    ]}
                    leftSection={<Filter size={20} />}
                    value={filterContentType}
                    onChange={setFilterContentType}
                    clearable
                  />
                </Group>
              </Stack>

              <Grid>
                {filteredContent.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No training content found
                    </Text>
                  </Grid.Col>
                ) : (
                  filteredContent.map((content) => (
                    <Grid.Col key={content.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                color={getContentTypeColor(content.content_type)}
                              >
                                {getContentTypeIcon(content.content_type)}
                              </Avatar>
                              <div>
                                <Text fw={500} size="sm">
                                  {content.title}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {categories.find(cat => cat.id === content.category)?.name || 'Uncategorized'}
                                </Text>
                              </div>
                            </Group>
                            {canManageTraining && (
                              <Menu withinPortal position="bottom-end">
                                <Menu.Target>
                                  <ActionIcon variant="subtle">
                                    <MoreVertical size={16} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    leftSection={<Edit size={16} />}
                                    onClick={() => handleOpenEditModal(content)}
                                  >
                                    Edit
                                  </Menu.Item>
                                  {content.is_published ? (
                                    <Menu.Item
                                      leftSection={<EyeOff size={16} />}
                                      onClick={() => handleUnpublishContent(content)}
                                    >
                                      Unpublish
                                    </Menu.Item>
                                  ) : (
                                    <Menu.Item
                                      leftSection={<Eye size={16} />}
                                      onClick={() => handlePublishContent(content)}
                                    >
                                      Publish
                                    </Menu.Item>
                                  )}
                                  <Menu.Item
                                    leftSection={<Trash size={16} />}
                                    color="red"
                                    onClick={() => handleOpenDeleteModal(content)}
                                  >
                                    Delete
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            )}
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Text size="sm">{content.description}</Text>
                          <Group gap="xs">
                            <Badge color={getContentTypeColor(content.content_type)}>
                              {content.content_type}
                            </Badge>
                            <Badge color={content.is_published ? 'green' : 'yellow'}>
                              {content.is_published ? 'Published' : 'Draft'}
                            </Badge>
                          </Group>
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">
                              By {content.created_by_name} on {new Date(content.created_at).toLocaleDateString()}
                            </Text>
                          </Group>
                        </Stack>

                        <Divider my="md" />

                        {renderContentPreview(content)}
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="categories" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" justify="space-between">
                <TextInput
                  placeholder="Search categories..."
                  leftSection={<Search size={20} />}
                  style={{ width: '300px' }}
                />
                {canManageTraining && (
                  <Button leftSection={<Plus size={20} />}>
                    Add Category
                  </Button>
                )}
              </Group>

              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Department</Table.Th>
                    <Table.Th>Created At</Table.Th>
                    {canManageTraining && <Table.Th>Actions</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {categories.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={canManageTraining ? 5 : 4}>
                        <Text ta="center" c="dimmed" py="xl">
                          No categories found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    categories.map((category) => (
                      <Table.Tr key={category.id}>
                        <Table.Td>
                          <Text fw={500}>{category.name}</Text>
                        </Table.Td>
                        <Table.Td>{category.description}</Table.Td>
                        <Table.Td>{category.department}</Table.Td>
                        <Table.Td>{new Date(category.created_at).toLocaleDateString()}</Table.Td>
                        {canManageTraining && (
                          <Table.Td>
                            <Group gap="xs">
                              <ActionIcon variant="light" color="blue">
                                <Edit size={16} />
                              </ActionIcon>
                              <ActionIcon variant="light" color="red">
                                <Trash size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Add Training Content Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Training Content"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.currentTarget.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.currentTarget.value)}
            required
          />
          <Select
            label="Content Type"
            placeholder="Select content type"
            data={[
              { value: 'text', label: 'Text' },
              { value: 'url', label: 'URL' },
              { value: 'image', label: 'Image' },
              { value: 'video', label: 'Video' },
            ]}
            value={formData.content_type}
            onChange={(value) => handleFormChange('content_type', value)}
            required
          />
          
          {formData.content_type === 'text' && (
            <Textarea
              label="Content"
              placeholder="Enter content"
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.currentTarget.value)}
              minRows={5}
              required
            />
          )}
          
          {formData.content_type === 'url' && (
            <TextInput
              label="URL"
              placeholder="Enter URL"
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.currentTarget.value)}
              required
            />
          )}
          
          {formData.content_type === 'image' && (
            <FileInput
              label="Image"
              placeholder="Upload image"
              accept="image/*"
              onChange={(file) => {
                if (file) {
                  // In a real app, you would upload the file to a server
                  // and get back a URL. For now, we'll just use a placeholder.
                  handleFormChange('content', 'https://example.com/images/placeholder.jpg');
                }
              }}
              required
            />
          )}
          
          {formData.content_type === 'video' && (
            <>
              <TextInput
                label="Video URL"
                placeholder="Enter video URL"
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.currentTarget.value)}
                required
              />
              <FileInput
                label="Thumbnail"
                placeholder="Upload thumbnail"
                accept="image/*"
                onChange={(file) => {
                  if (file) {
                    // In a real app, you would upload the file to a server
                    // and get back a URL. For now, we'll just use a placeholder.
                    handleFormChange('thumbnail_url', 'https://example.com/thumbnails/placeholder.jpg');
                  }
                }}
              />
            </>
          )}
          
          <Select
            label="Department"
            placeholder="Select department"
            data={['All', 'Engineering', 'Marketing', 'HR', 'Finance']}
            value={formData.department}
            onChange={(value) => handleFormChange('department', value)}
            required
          />
          
          <Select
            label="Category"
            placeholder="Select category"
            data={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            value={formData.category}
            onChange={(value) => handleFormChange('category', value)}
            required
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContent}>
              Add Content
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Training Content Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Training Content"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.currentTarget.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.currentTarget.value)}
            required
          />
          <Select
            label="Content Type"
            placeholder="Select content type"
            data={[
              { value: 'text', label: 'Text' },
              { value: 'url', label: 'URL' },
              { value: 'image', label: 'Image' },
              { value: 'video', label: 'Video' },
            ]}
            value={formData.content_type}
            onChange={(value) => handleFormChange('content_type', value)}
            required
          />
          
          {formData.content_type === 'text' && (
            <Textarea
              label="Content"
              placeholder="Enter content"
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.currentTarget.value)}
              minRows={5}
              required
            />
          )}
          
          {formData.content_type === 'url' && (
            <TextInput
              label="URL"
              placeholder="Enter URL"
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.currentTarget.value)}
              required
            />
          )}
          
          {formData.content_type === 'image' && (
            <FileInput
              label="Image"
              placeholder="Upload image"
              accept="image/*"
              onChange={(file) => {
                if (file) {
                  // In a real app, you would upload the file to a server
                  // and get back a URL. For now, we'll just use a placeholder.
                  handleFormChange('content', 'https://example.com/images/placeholder.jpg');
                }
              }}
              required
            />
          )}
          
          {formData.content_type === 'video' && (
            <>
              <TextInput
                label="Video URL"
                placeholder="Enter video URL"
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.currentTarget.value)}
                required
              />
              <FileInput
                label="Thumbnail"
                placeholder="Upload thumbnail"
                accept="image/*"
                onChange={(file) => {
                  if (file) {
                    // In a real app, you would upload the file to a server
                    // and get back a URL. For now, we'll just use a placeholder.
                    handleFormChange('thumbnail_url', 'https://example.com/thumbnails/placeholder.jpg');
                  }
                }}
              />
            </>
          )}
          
          <Select
            label="Department"
            placeholder="Select department"
            data={['All', 'Engineering', 'Marketing', 'HR', 'Finance']}
            value={formData.department}
            onChange={(value) => handleFormChange('department', value)}
            required
          />
          
          <Select
            label="Category"
            placeholder="Select category"
            data={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            value={formData.category}
            onChange={(value) => handleFormChange('category', value)}
            required
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContent}>
              Update Content
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Training Content Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Training Content"
        size="md"
      >
        {selectedContent && (
          <Stack>
            <Text>
              Are you sure you want to delete the training content "{selectedContent.title}"?
            </Text>
            <Text size="sm" c="dimmed">
              This action cannot be undone.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteContent}>
                Delete
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
} 
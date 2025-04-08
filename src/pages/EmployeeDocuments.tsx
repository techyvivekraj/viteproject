import React, { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  ActionIcon,
  Menu,
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
  Card,
  Grid,
  FileInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Upload,
  Download,
  Trash,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { useDocumentsStore } from '../store/documents';
import { useOrganizationStore } from '../store/organization';
import type { EmployeeDocument } from '../types';

export default function EmployeeDocuments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EmployeeDocument | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  const userRole = useOrganizationStore((state) => state.userRole);
  const {
    documents,
    categories,
    loading,
    uploadDocument,
    approveDocument,
    deleteDocument,
    getDocumentSummaries,
  } = useDocumentsStore();

  const [documentForm, setDocumentForm] = useState({
    category: '',
    title: '',
    description: '',
    file: null as File | null,
    issuedDate: null as Date | null,
    expiryDate: null as Date | null,
    issuedBy: '',
    documentNumber: '',
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');
  const summaries = getDocumentSummaries();

  const handleUpload = async () => {
    if (!documentForm.file) return;

    await uploadDocument({
      employeeId: '101', // This would come from the logged-in user
      employeeName: 'John Doe', // This would come from the logged-in user
      department: 'Engineering', // This would come from the logged-in user
      category: documentForm.category as EmployeeDocument['category'],
      title: documentForm.title,
      description: documentForm.description,
      fileUrl: URL.createObjectURL(documentForm.file), // In a real app, this would be uploaded to storage
      fileType: documentForm.file.type,
      fileSize: documentForm.file.size,
      uploadedBy: 'John Doe', // This would come from the logged-in user
      issuedDate: documentForm.issuedDate?.toISOString(),
      expiryDate: documentForm.expiryDate?.toISOString(),
      issuedBy: documentForm.issuedBy,
      documentNumber: documentForm.documentNumber,
    });

    setUploadModal(false);
    setDocumentForm({
      category: '',
      title: '',
      description: '',
      file: null,
      issuedDate: null,
      expiryDate: null,
      issuedBy: '',
      documentNumber: '',
    });
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedDocument) return;

    await approveDocument(selectedDocument.id, approved, approvalComment);
    setViewModal(false);
    setSelectedDocument(null);
    setApprovalComment('');
  };

  const getStatusColor = (status: EmployeeDocument['status']) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: EmployeeDocument['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const handleViewDocument = (doc: EmployeeDocument) => {
    window.open(doc.fileUrl, '_blank');
  };

  const handleDownloadDocument = (doc: EmployeeDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Employee Documents</Title>
        <Button
          leftSection={<Plus size={20} />}
          onClick={() => setUploadModal(true)}
        >
          Upload Document
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Documents</Text>
            <Text size="xl" fw={700}>
              {documents.length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Pending Review</Text>
            <Text size="xl" fw={700} c="yellow">
              {documents.filter(d => d.status === 'pending').length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Expiring Soon</Text>
            <Text size="xl" fw={700} c="orange">
              {documents.filter(d => isExpiringSoon(d.expiryDate)).length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Rejected</Text>
            <Text size="xl" fw={700} c="red">
              {documents.filter(d => d.status === 'rejected').length}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Group mb="md" grow>
          <TextInput
            placeholder="Search documents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
          />
          <Group>
            <Select
              placeholder="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              data={['Engineering', 'Design', 'Marketing', 'HR']}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              data={[
                { value: 'education', label: 'Education' },
                { value: 'professional', label: 'Professional' },
                { value: 'identity', label: 'Identity' },
                { value: 'address', label: 'Address' },
                { value: 'other', label: 'Other' },
              ]}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
          </Group>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Document</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Issued Date</Table.Th>
              <Table.Th>Expiry Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {documents
              .filter(doc => {
                const matchesSearch = 
                  doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDepartment = !departmentFilter || doc.department === departmentFilter;
                const matchesCategory = !categoryFilter || doc.category === categoryFilter;
                const matchesStatus = !statusFilter || doc.status === statusFilter;
                return matchesSearch && matchesDepartment && matchesCategory && matchesStatus;
              })
              .map((doc) => (
                <Table.Tr key={doc.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <FileText size={20} />
                      <div>
                        <Text size="sm" fw={500}>
                          {doc.title}
                        </Text>
                        {doc.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {doc.description}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" style={{ textTransform: 'capitalize' }}>
                      {doc.category}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        size={24}
                        radius={24}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.employeeName}`}
                      />
                      <div>
                        <Text size="sm">{doc.employeeName}</Text>
                        <Text size="xs" c="dimmed">{doc.department}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(doc.status)}
                      leftSection={getStatusIcon(doc.status)}
                    >
                      {doc.status.toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {doc.issuedDate ? (
                      new Date(doc.issuedDate).toLocaleDateString()
                    ) : (
                      <Text size="sm" c="dimmed">-</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {doc.expiryDate ? (
                      <Group gap="xs">
                        <Text size="sm">
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </Text>
                        {isExpiringSoon(doc.expiryDate) && (
                          <Badge color="orange" size="sm">
                            Expiring Soon
                          </Badge>
                        )}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">-</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <Download size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Upload Document Modal */}
      <Modal
        opened={uploadModal}
        onClose={() => setUploadModal(false)}
        title="Upload Document"
        size="lg"
      >
        <Stack>
          <Select
            label="Category"
            placeholder="Select document category"
            data={[
              { value: 'education', label: 'Education' },
              { value: 'professional', label: 'Professional' },
              { value: 'identity', label: 'Identity' },
              { value: 'address', label: 'Address' },
              { value: 'other', label: 'Other' },
            ]}
            value={documentForm.category}
            onChange={(value) => setDocumentForm({ ...documentForm, category: value || '' })}
            required
          />

          <TextInput
            label="Document Title"
            placeholder="Enter document title"
            value={documentForm.title}
            onChange={(e) => setDocumentForm({ ...documentForm, title: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter document description"
            value={documentForm.description}
            onChange={(e) => setDocumentForm({ ...documentForm, description: e.currentTarget.value })}
            minRows={3}
          />

          <FileInput
            label="Document File"
            placeholder="Upload document"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            value={documentForm.file}
            onChange={(file) => setDocumentForm({ ...documentForm, file })}
            leftSection={<Upload size={16} />}
            required
          />

          <Grid>
            <Grid.Col span={6}>
              <DateInput
                label="Issued Date"
                placeholder="Select issued date"
                value={documentForm.issuedDate}
                onChange={(date) => setDocumentForm({ ...documentForm, issuedDate: date })}
                leftSection={<Calendar size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                label="Expiry Date"
                placeholder="Select expiry date"
                value={documentForm.expiryDate}
                onChange={(date) => setDocumentForm({ ...documentForm, expiryDate: date })}
                leftSection={<Calendar size={16} />}
                minDate={new Date()}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Issued By"
            placeholder="Enter issuing authority"
            value={documentForm.issuedBy}
            onChange={(e) => setDocumentForm({ ...documentForm, issuedBy: e.currentTarget.value })}
          />

          <TextInput
            label="Document Number"
            placeholder="Enter document number"
            value={documentForm.documentNumber}
            onChange={(e) => setDocumentForm({ ...documentForm, documentNumber: e.currentTarget.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setUploadModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={!documentForm.file || !documentForm.title || !documentForm.category}
            >
              Upload Document
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View/Approve Document Modal */}
      <Modal
        opened={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedDocument(null);
          setApprovalComment('');
        }}
        title="Document Details"
        size="lg"
      >
        {selectedDocument && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text fw={500}>{selectedDocument.title}</Text>
                <Text size="sm" c="dimmed">
                  Uploaded by {selectedDocument.uploadedBy} on {new Date(selectedDocument.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <Badge
                color={getStatusColor(selectedDocument.status)}
                leftSection={getStatusIcon(selectedDocument.status)}
                size="lg"
              >
                {selectedDocument.status.toUpperCase()}
              </Badge>
            </Group>

            {selectedDocument.description && (
              <Card withBorder>
                <Text fw={500} mb="xs">Description</Text>
                <Text>{selectedDocument.description}</Text>
              </Card>
            )}

            <Grid>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Category</Text>
                  <Text size="sm" style={{ textTransform: 'capitalize' }}>
                    {selectedDocument.category}
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Document Number</Text>
                  <Text>{selectedDocument.documentNumber || '-'}</Text>
                </Card>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Issued Date</Text>
                  <Text>
                    {selectedDocument.issuedDate
                      ? new Date(selectedDocument.issuedDate).toLocaleDateString()
                      : '-'}
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Expiry Date</Text>
                  <Group gap="xs">
                    <Text>
                      {selectedDocument.expiryDate
                        ? new Date(selectedDocument.expiryDate).toLocaleDateString()
                        : '-'}
                    </Text>
                    {isExpiringSoon(selectedDocument.expiryDate) && (
                      <Badge color="orange" size="sm">
                        Expiring Soon
                      </Badge>
                    )}
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            <Card withBorder>
              <Text fw={500} mb="sm">Document Preview</Text>
              <Group>
                <Button
                  variant="light"
                  component="a"
                  href={selectedDocument.fileUrl}
                  target="_blank"
                  leftSection={<Eye size={16} />}
                >
                  View Document
                </Button>
                <Button
                  variant="light"
                  component="a"
                  href={selectedDocument.fileUrl}
                  download
                  leftSection={<Download size={16} />}
                >
                  Download
                </Button>
              </Group>
            </Card>

            {selectedDocument.status === 'pending' && isManager && (
              <>
                <Textarea
                  label="Review Comments"
                  placeholder="Add your comments here..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.currentTarget.value)}
                  minRows={3}
                />

                <Group justify="flex-end" mt="md">
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleApproval(false)}
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    color="green"
                    onClick={() => handleApproval(true)}
                    loading={loading}
                  >
                    Approve
                  </Button>
                </Group>
              </>
            )}

            {selectedDocument.managerComments && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Review Comments"
                color={selectedDocument.status === 'approved' ? 'green' : 'red'}
              >
                {selectedDocument.managerComments}
              </Alert>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
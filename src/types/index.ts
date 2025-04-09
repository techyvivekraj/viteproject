export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'annual' | 'sick' | 'unpaid' | 'maternity' | 'paternity' | 'bereavement';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  attachments?: string[];
  managerComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: {
    total: number;
    used: number;
    remaining: number;
  };
  sick: {
    total: number;
    used: number;
    remaining: number;
  };
  unpaid: {
    used: number;
  };
  maternity: {
    total: number;
    used: number;
    remaining: number;
  };
  paternity: {
    total: number;
    used: number;
    remaining: number;
  };
  bereavement: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface LeaveSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  balance: LeaveBalance;
  pendingRequests: number;
  approvedUpcoming: number;
  recentRequests: LeaveRequest[];
}

export interface Ticket {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  description: string;
  category: 'it_support' | 'hr' | 'facilities' | 'finance' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  attachments?: string[];
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResolutionTime: number;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  recentTickets: Ticket[];
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'education' | 'professional' | 'identity' | 'address' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComments?: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  issuedDate?: string;
  issuedBy?: string;
  documentNumber?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  allowedFileTypes: string[];
  maxFileSize: number;
  expiryRequired: boolean;
  documentNumberRequired: boolean;
  issuedByRequired: boolean;
  issuedDateRequired: boolean;
  active: boolean;
}

export interface DocumentSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  totalDocuments: number;
  pendingDocuments: number;
  expiringSoonDocuments: number;
  documentsByCategory: Record<string, number>;
  recentDocuments: EmployeeDocument[];
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  hire_date: string;
  status: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  emergency_contact?: string;
  emergency_contact_name?: string;
  reporting_manager?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_name?: string;
  documents?: {
    id: string;
    name: string;
    type: string;
    uploaded_at: string;
  }[];
  performance?: {
    year: string;
    rating: string;
    review_date: string;
  }[];
  attendance?: {
    present: number;
    absent: number;
    late: number;
    leave: number;
    total_days: number;
    attendance_percentage: number;
  };
  attendance_records?: {
    date: string;
    check_in: string;
    check_out: string;
    status: 'present' | 'late' | 'absent' | 'leave';
  }[];
  leave_balance?: {
    annual: number;
    sick: number;
    personal: number;
  };
  leave_requests?: {
    id: string;
    type: string;
    start_date: string;
    end_date: string;
    status: 'approved' | 'pending' | 'rejected';
    days: number;
  }[];
  overtime?: {
    id: string;
    date: string;
    hours: number;
    reason: string;
    status: 'approved' | 'pending' | 'rejected';
    amount: number;
  }[];
  advances?: {
    id: string;
    date: string;
    amount: number;
    reason: string;
    status: 'approved' | 'pending' | 'rejected';
    repayment_status: 'completed' | 'in_progress' | 'pending';
  }[];
  fines?: {
    id: string;
    date: string;
    amount: number;
    reason: string;
    status: 'paid' | 'pending';
  }[];
  tasks?: {
    id: string;
    title: string;
    assigned_date: string;
    due_date: string;
    status: 'completed' | 'in_progress' | 'pending';
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experience_years: number;
  resume_url: string;
  status: 'pending' | 'interview_scheduled' | 'interviewed' | 'selected' | 'rejected' | 'hired';
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name: string;
  position: string;
  department: string;
  interviewer_id: string;
  interviewer_name: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'online' | 'in_person';
  meeting_link?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: InterviewFeedback;
  created_at: string;
  updated_at: string;
}

export interface InterviewFeedback {
  id: string;
  interview_id: string;
  candidate_id: string;
  interviewer_id: string;
  technical_skills: number; // 1-5 rating
  communication_skills: number; // 1-5 rating
  problem_solving: number; // 1-5 rating
  cultural_fit: number; // 1-5 rating
  overall_rating: number; // 1-5 rating
  strengths: string[];
  weaknesses: string[];
  comments: string;
  recommendation: 'hire' | 'reject' | 'consider';
  created_at: string;
  updated_at: string;
}

export interface recruitmentProcess {
  id: string;
  candidate_id: string;
  candidate_name: string;
  position: string;
  department: string;
  status: 'pending' | 'documents_requested' | 'documents_submitted' | 'background_verified' | 'offer_sent' | 'offer_accepted' | 'offer_rejected' | 'completed';
  required_documents: RequiredDocument[];
  background_verification: BackgroundVerification;
  offer_letter: OfferLetter;
  created_at: string;
  updated_at: string;
}

export interface RequiredDocument {
  id: string;
  recruitment_id: string;
  name: string;
  description: string;
  required: boolean;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  file_url?: string;
  submitted_at?: string;
  verified_at?: string;
  verified_by?: string;
  comments?: string;
}

export interface BackgroundVerification {
  id: string;
  recruitment_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  education_verified: boolean;
  employment_verified: boolean;
  criminal_record_verified: boolean;
  reference_checks: ReferenceCheck[];
  verified_by?: string;
  verified_at?: string;
  comments?: string;
}

export interface ReferenceCheck {
  id: string;
  background_verification_id: string;
  name: string;
  company: string;
  position: string;
  relationship: string;
  contact: string;
  status: 'pending' | 'completed' | 'failed';
  feedback?: string;
  verified_at?: string;
}

export interface OfferLetter {
  id: string;
  recruitment_id: string;
  position: string;
  department: string;
  salary: number;
  joining_date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  file_url?: string;
}

export interface OffboardingProcess {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  position: string;
  type: 'resignation' | 'termination';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  initiated_by: 'employee' | 'manager';
  resignation_date?: string;
  last_working_day?: string;
  reason?: string;
  manager_comments?: string;
  documents: OffboardingDocument[];
  created_at: string;
  updated_at: string;
}

export interface OffboardingDocument {
  id: string;
  offboarding_id: string;
  name: string;
  description: string;
  status: 'pending' | 'generated' | 'sent';
  file_url?: string;
  generated_at?: string;
  sent_at?: string;
}

export interface ResignationRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  position: string;
  resignation_date: string;
  last_working_day: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  manager_comments?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  created_at: string;
  updated_at: string;
  attachments?: string[];
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  content_type: 'text' | 'url' | 'image' | 'video';
  content: string;
  thumbnail_url?: string;
  department: string;
  category: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  published_at?: string;
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  reference: string;
  date: string;
  amount: number;
}

export interface RepaymentStatus {
  remainingAmount: number;
  nextPaymentDate: string;
  paymentHistory: PaymentHistory[];
}

export interface AdvanceRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  reason: string;
  repaymentMonths: number;
  monthlyDeduction: number;
  status: 'pending' | 'approved' | 'rejected';
  managerComments?: string;
  approvedAt?: string;
  repaymentStatus: RepaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'half-day' | 'holiday' | 'leave';
  workHours: string;
  department: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  day: string;
  hours: number;
  tasks: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  attachments?: string[];
  managerComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fine {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  reason: string;
  date: string;
  deductionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'deducted';
  managerComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
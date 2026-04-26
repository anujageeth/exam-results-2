// ========== STUDENTS ==========
export const students = [
  { id: 1, indexNo: 'EG/2021/0001', name: 'Ashan Perera', email: 'ashan.p@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.72, status: 'active' },
  { id: 2, indexNo: 'EG/2021/0002', name: 'Kavindi Silva', email: 'kavindi.s@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.85, status: 'active' },
  { id: 3, indexNo: 'EG/2021/0003', name: 'Nuwan Bandara', email: 'nuwan.b@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.15, status: 'active' },
  { id: 4, indexNo: 'EG/2021/0004', name: 'Tharushi Fernando', email: 'tharushi.f@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.92, status: 'active' },
  { id: 5, indexNo: 'EG/2021/0005', name: 'Dilshan Jayawardena', email: 'dilshan.j@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 2.88, status: 'active' },
  { id: 6, indexNo: 'EG/2021/0006', name: 'Sithara Wickramasinghe', email: 'sithara.w@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.45, status: 'active' },
  { id: 7, indexNo: 'EG/2022/0007', name: 'Kasun Rajapaksha', email: 'kasun.r@ceylon.ac.lk', batch: '2022', course: 'BSc (Hons) in Engineering', semester: 6, gpa: 3.60, status: 'active' },
  { id: 8, indexNo: 'EG/2022/0008', name: 'Malsha Gunasekara', email: 'malsha.g@ceylon.ac.lk', batch: '2022', course: 'BBA (Hons)', semester: 6, gpa: 3.30, status: 'active' },
  { id: 9, indexNo: 'EG/2022/0009', name: 'Amaya Dissanayake', email: 'amaya.d@ceylon.ac.lk', batch: '2022', course: 'BSc (Hons) in ICT', semester: 4, gpa: 3.65, status: 'active' },
  { id: 10, indexNo: 'EG/2022/0010', name: 'Ravindu Herath', email: 'ravindu.h@ceylon.ac.lk', batch: '2022', course: 'BSc (Hons) in ICT', semester: 4, gpa: 3.40, status: 'active' },
  { id: 11, indexNo: 'EG/2022/0011', name: 'Nethmini Samaraweera', email: 'nethmini.s@ceylon.ac.lk', batch: '2022', course: 'BSc (Hons) in ICT', semester: 4, gpa: 3.78, status: 'active' },
  { id: 12, indexNo: 'EG/2023/0012', name: 'Dineth Wijesinghe', email: 'dineth.w@ceylon.ac.lk', batch: '2023', course: 'BSc (Hons) in Engineering', semester: 4, gpa: 3.55, status: 'active' },
  { id: 13, indexNo: 'EG/2023/0013', name: 'Pasan Liyanage', email: 'pasan.l@ceylon.ac.lk', batch: '2023', course: 'BSc (Hons) in ICT', semester: 8, gpa: 3.20, status: 'graduated' },
  { id: 14, indexNo: 'EG/2021/0014', name: 'Sanduni Karunaratne', email: 'sanduni.k@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in ICT', semester: 8, gpa: 3.95, status: 'graduated' },
  { id: 15, indexNo: 'EG/2021/0015', name: 'Chamath Senevirathne', email: 'chamath.s@ceylon.ac.lk', batch: '2021', course: 'BSc (Hons) in Engineering', semester: 4, gpa: 2.95, status: 'active' },
];

// ========== FACULTIES & DEPARTMENTS ==========
export const faculties = [
  {
    id: 1,
    name: 'Engineering',
    code: 'ENG',
    departments: [
      { id: 1, name: 'Electrical Engineering', code: 'EE' },
      { id: 2, name: 'Civil Engineering', code: 'CE' },
      { id: 3, name: 'Mechanical Engineering', code: 'ME' },
      { id: 4, name: 'Computer Engineering', code: 'CoE' },
      { id: 5, name: 'Marine Engineering', code: 'MaE' },
    ],
  },
  {
    id: 2,
    name: 'Computer Science',
    code: 'CS',
    departments: [
      { id: 6, name: 'Computer Science', code: 'CS' },
      { id: 7, name: 'Software Engineering', code: 'SE' },
      { id: 8, name: 'Information Systems', code: 'IS' },
      { id: 9, name: 'Data Science', code: 'DS' },
    ],
  },
  {
    id: 3,
    name: 'Business',
    code: 'BUS',
    departments: [
      { id: 10, name: 'Finance', code: 'FIN' },
      { id: 11, name: 'Marketing', code: 'MKT' },
      { id: 12, name: 'Human Resource Management', code: 'HRM' },
      { id: 13, name: 'Management', code: 'MGT' },
    ],
  },
];

// ========== MODULES ==========
export const modules = [
  { id: 1, code: 'CS3113', name: 'Data Structures & Algorithms', credits: 4, semester: 3, faculty: 'Computer Science', department: 'Computer Science', type: 'Core' },
  { id: 2, code: 'CS3214', name: 'Database Management Systems', credits: 4, semester: 3, faculty: 'Computer Science', department: 'Information Systems', type: 'Core' },
  { id: 3, code: 'SE4115', name: 'Software Engineering', credits: 3, semester: 4, faculty: 'Computer Science', department: 'Software Engineering', type: 'Core' },
  { id: 4, code: 'CS4216', name: 'Computer Networks', credits: 3, semester: 4, faculty: 'Computer Science', department: 'Computer Science', type: 'Core' },
  { id: 5, code: 'DS5117', name: 'Machine Learning', credits: 4, semester: 5, faculty: 'Computer Science', department: 'Data Science', type: 'Elective' },
  { id: 6, code: 'SE5218', name: 'Web Application Development', credits: 3, semester: 5, faculty: 'Computer Science', department: 'Software Engineering', type: 'Core' },
  { id: 7, code: 'CS6119', name: 'Cloud Computing', credits: 3, semester: 6, faculty: 'Computer Science', department: 'Computer Science', type: 'Elective' },
  { id: 8, code: 'CS6220', name: 'Cyber Security', credits: 3, semester: 6, faculty: 'Computer Science', department: 'Information Systems', type: 'Core' },
  { id: 9, code: 'ME3101', name: 'Thermodynamics', credits: 4, semester: 3, faculty: 'Engineering', department: 'Mechanical Engineering', type: 'Core' },
  { id: 10, code: 'EE4102', name: 'Control Systems', credits: 3, semester: 4, faculty: 'Engineering', department: 'Electrical Engineering', type: 'Core' },
  { id: 11, code: 'FIN3101', name: 'Financial Accounting', credits: 3, semester: 3, faculty: 'Business', department: 'Finance', type: 'Core' },
  { id: 12, code: 'MT4102', name: 'Marketing Management', credits: 3, semester: 4, faculty: 'Business', department: 'Marketing', type: 'Core' },
  { id: 13, code: 'CE5201', name: 'Structural Analysis', credits: 4, semester: 5, faculty: 'Engineering', department: 'Civil Engineering', type: 'Core' },
  { id: 14, code: 'MME5301', name: 'Marine Propulsion Systems', credits: 3, semester: 5, faculty: 'Engineering', department: 'Marine Engineering', type: 'Core' },
  { id: 15, code: 'CE4201', name: 'Digital Systems Design', credits: 3, semester: 4, faculty: 'Engineering', department: 'Computer Engineering', type: 'Core' },
];

// ========== EXAM SESSIONS ==========
export const examSessions = [
  { id: 1, name: 'Semester 5', year: 2026, semester: 5, startDate: '2026-01-15', endDate: '2026-02-10', status: 'Completed', totalModules: 6, resultsPublished: 4 },
  { id: 2, name: 'Semester 6', year: 2026, semester: 6, startDate: '2026-03-20', endDate: '2026-03-28', status: 'Completed', totalModules: 4, resultsPublished: 2 },
  { id: 3, name: 'Semester 6', year: 2026, semester: 6, startDate: '2026-06-01', endDate: '2026-06-20', status: 'Upcoming', totalModules: 6, resultsPublished: 0 },
  { id: 4, name: 'Semester 4', year: 2026, semester: 4, startDate: '2026-01-10', endDate: '2026-02-05', status: 'Completed', totalModules: 5, resultsPublished: 5 },
  { id: 5, name: 'Semester 3', year: 2025, semester: 3, startDate: '2025-06-01', endDate: '2025-06-18', status: 'Completed', totalModules: 8, resultsPublished: 8 },
];

// ========== RESULTS (for current student: Ashan Perera - EG/2021/0001) ==========
export const studentResults = [
  // Semester 3
  { id: 1, moduleCode: 'CS3113', moduleName: 'Data Structures & Algorithms', credits: 4, grade: 'A-', gradePoints: 3.70, semester: 3, year: '2023/2024', status: 'Published' },
  { id: 2, moduleCode: 'CS3214', moduleName: 'Database Management Systems', credits: 4, grade: 'A', gradePoints: 4.00, semester: 3, year: '2023/2024', status: 'Published' },
  // Semester 4
  { id: 3, moduleCode: 'SE4115', moduleName: 'Software Engineering', credits: 3, grade: 'B+', gradePoints: 3.30, semester: 4, year: '2024/2025', status: 'Published' },
  { id: 4, moduleCode: 'CS4216', moduleName: 'Computer Networks', credits: 3, grade: 'A-', gradePoints: 3.70, semester: 4, year: '2024/2025', status: 'Published' },
  // Semester 5
  { id: 5, moduleCode: 'DS5117', moduleName: 'Machine Learning', credits: 4, grade: 'A', gradePoints: 4.00, semester: 5, year: '2025/2026', status: 'Published' },
  { id: 6, moduleCode: 'SE5218', moduleName: 'Web Application Development', credits: 3, grade: 'A+', gradePoints: 4.00, semester: 5, year: '2025/2026', status: 'Published' },
  // Semester 6 (latest - some pending)
  { id: 7, moduleCode: 'CS6119', moduleName: 'Cloud Computing', credits: 3, grade: 'A-', gradePoints: 3.70, semester: 6, year: '2025/2026', status: 'Published' },
  { id: 8, moduleCode: 'CS6220', moduleName: 'Cyber Security', credits: 3, grade: '-', gradePoints: null, semester: 6, year: '2025/2026', status: 'Pending' },
];

// ========== ADMIN: PENDING RESULT BATCHES ==========
export const pendingResultBatches = [
  {
    id: 1,
    examSession: 'Semester 6',
    module: 'CS6220 - Cyber Security',
    totalStudents: 35,
    uploadedAt: '2026-04-20T14:30:00',
    uploadedBy: 'Dr. Kamal Perera',
    status: 'Review',
    anomalies: 2,
    results: [
      { studentId: 'EG/2021/0001', name: 'Ashan Perera', grade: 'A-', marks: 78 },
      { studentId: 'EG/2021/0002', name: 'Kavindi Silva', grade: 'A', marks: 85 },
      { studentId: 'EG/2021/0003', name: 'Nuwan Bandara', grade: 'C+', marks: 56 },
      { studentId: 'EG/2021/0004', name: 'Tharushi Fernando', grade: 'A+', marks: 92 },
      { studentId: 'EG/2021/0005', name: 'Dilshan Jayawardena', grade: 'F', marks: 28, anomaly: true },
    ],
  },
  {
    id: 2,
    examSession: 'Semester 6',
    module: 'CS6119 - Cloud Computing',
    totalStudents: 35,
    uploadedAt: '2026-04-19T10:15:00',
    uploadedBy: 'Dr. Nimali Fernando',
    status: 'Review',
    anomalies: 0,
    results: [
      { studentId: 'EG/2021/0001', name: 'Ashan Perera', grade: 'A-', marks: 76 },
      { studentId: 'EG/2021/0002', name: 'Kavindi Silva', grade: 'B+', marks: 68 },
      { studentId: 'EG/2021/0003', name: 'Nuwan Bandara', grade: 'B', marks: 62 },
      { studentId: 'EG/2021/0004', name: 'Tharushi Fernando', grade: 'A', marks: 88 },
      { studentId: 'EG/2021/0005', name: 'Dilshan Jayawardena', grade: 'C', marks: 50 },
    ],
  },
];

// ========== ADMIN DASHBOARD STATS ==========
export const adminStats = {
  totalStudents: 248,
  totalExams: 42,
  pendingResults: 6,
  publishedResults: 36,
  passRate: 87.3,
  failRate: 12.7,
};

// ========== ADMIN ACTIVITY LOG ==========
export const activityLog = [
  { id: 1, action: 'Results uploaded for IS6220 - Cyber Security', user: 'Dr. Kamal Perera', time: '2 hours ago', type: 'upload' },
  { id: 2, action: 'Results published for DS5117 - Machine Learning', user: 'Admin', time: '5 hours ago', type: 'publish' },
  { id: 3, action: 'New student registered: Amaya Dissanayake', user: 'Admin', time: '1 day ago', type: 'student' },
  { id: 4, action: 'Exam session created: Semester 6', user: 'Admin', time: '2 days ago', type: 'exam' },
  { id: 5, action: 'Module updated: CS6119 - Cloud Computing', user: 'Admin', time: '3 days ago', type: 'module' },
  { id: 6, action: 'Results published for SE5218 - Web App Dev', user: 'Admin', time: '4 days ago', type: 'publish' },
];

// ========== CHART DATA ==========
export const monthlyResultsData = [
  { month: 'Sep', published: 8, pending: 2 },
  { month: 'Oct', published: 5, pending: 1 },
  { month: 'Nov', published: 3, pending: 0 },
  { month: 'Dec', published: 0, pending: 0 },
  { month: 'Jan', published: 12, pending: 3 },
  { month: 'Feb', published: 6, pending: 2 },
  { month: 'Mar', published: 4, pending: 4 },
  { month: 'Apr', published: 2, pending: 6 },
];

export const gradeDistribution = [
  { grade: 'A+', count: 12, color: '#059669' },
  { grade: 'A', count: 28, color: '#10B981' },
  { grade: 'A-', count: 35, color: '#34D399' },
  { grade: 'B+', count: 42, color: '#F5BA1D' },
  { grade: 'B', count: 38, color: '#FBBF24' },
  { grade: 'B-', count: 25, color: '#FCD34D' },
  { grade: 'C+', count: 20, color: '#F97316' },
  { grade: 'C', count: 15, color: '#FB923C' },
  { grade: 'C-', count: 8, color: '#FDBA74' },
  { grade: 'F', count: 5, color: '#EF4444' },
];

// ========== CURRENT USER PROFILES (mock login) ==========
export const mockUsers = {
  student: {
    id: 1,
    name: 'Ashan Perera',
    email: 'ashan.p@ceylon.ac.lk',
    indexNo: 'EG/2021/0001',
    role: 'student',
    batch: '2021',
    faculty: 'Engineering',
    department: 'Computer Engineering',
    course: 'BSc (Hons) in Engineering',
    semester: 6,
    gpa: 3.72,
    creditsCompleted: 82,
    totalCredits: 120,
    // academicStanding: 'Dean\'s List',
  },
  admin: {
    id: 100,
    name: 'Dr. Nimal Fernando',
    email: 'nimal.f@ceylon.ac.lk',
    role: 'admin',
    faculty: 'Computer Science',
  },
};

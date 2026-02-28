export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  semester?: number;
  studentId?: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export interface AcademicData {
  attendancePercentage: number;
  internalTotal: number;
  previousGPA: number;
  backlogsCount: number;
  consistencyScore: number;
  earnedCredits: number;
  requiredCredits: number;
  activityPoints: number;
  riskScore: number; // 0-100
}

export interface StudentProfile extends User {
  academicData: AcademicData;
  attendanceHistory: AttendanceRecord[];
}

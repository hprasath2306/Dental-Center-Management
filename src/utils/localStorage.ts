import type { User, Patient, Incident } from '../types';

const STORAGE_KEYS = {
  USER: 'dental_center_user',
  PATIENTS: 'dental_center_patients',
  INCIDENTS: 'dental_center_incidents',
  USERS: 'dental_center_users',
};

const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const mockUsers: User[] = [
      { 
        id: '1', 
        role: 'Admin', 
        email: 'admin@entnt.in', 
        password: 'admin123',
        name: 'Dr. Sarah Wilson'
      },
      { 
        id: '2', 
        role: 'Patient', 
        email: 'john@entnt.in', 
        password: 'patient123', 
        patientId: 'p1',
        name: 'John Doe'
      },
      { 
        id: '3', 
        role: 'Patient', 
        email: 'jane@entnt.in', 
        password: 'patient123', 
        patientId: 'p2',
        name: 'Jane Smith'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const mockPatients: Patient[] = [
      {
        id: 'p1',
        name: 'John Doe',
        dob: '1990-05-10',
        contact: '1234567890',
        email: 'john@entnt.in',
        address: '123 Main St, City, State 12345',
        emergencyContact: '0987654321',
        healthInfo: 'No major health issues',
        allergies: 'None',
        medications: 'None',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'p2',
        name: 'Jane Smith',
        dob: '1985-08-22',
        contact: '2345678901',
        email: 'jane@entnt.in',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: '1098765432',
        healthInfo: 'Hypertension controlled with medication',
        allergies: 'Penicillin',
        medications: 'Lisinopril 10mg daily',
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    const mockIncidents: Incident[] = [
      {
        id: 'i1',
        patientId: 'p1',
        title: 'Routine Cleaning',
        description: 'Regular dental cleaning and examination',
        comments: 'Patient shows good oral hygiene',
        appointmentDate: '2025-01-15T10:00:00Z',
        cost: 120,
        treatment: 'Professional cleaning, fluoride treatment',
        status: 'Completed',
        files: [],
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z'
      },
      {
        id: 'i2',
        patientId: 'p1',
        title: 'Follow-up Examination',
        description: 'Follow-up after cleaning',
        comments: 'Schedule for 6 months',
        appointmentDate: '2025-07-15T14:00:00Z',
        status: 'Scheduled',
        files: [],
        createdAt: '2025-01-15T11:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z'
      },
      {
        id: 'i3',
        patientId: 'p2',
        title: 'Tooth Pain Consultation',
        description: 'Patient experiencing pain in upper right molar',
        comments: 'Sensitive to cold and hot foods',
        appointmentDate: '2025-02-01T09:00:00Z',
        status: 'Scheduled',
        files: [],
        createdAt: '2025-01-20T15:30:00Z',
        updatedAt: '2025-01-20T15:30:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(mockIncidents));
  }
};

initializeMockData();

export const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

export const getStoredUser = (): User | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const getStoredPatients = (): Patient[] => {
  try {
    const patients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return patients ? JSON.parse(patients) : [];
  } catch {
    return [];
  }
};

export const setStoredPatients = (patients: Patient[]): void => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const getStoredIncidents = (): Incident[] => {
  try {
    const incidents = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return incidents ? JSON.parse(incidents) : [];
  } catch {
    return [];
  }
};

export const setStoredIncidents = (incidents: Incident[]): void => {
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
};
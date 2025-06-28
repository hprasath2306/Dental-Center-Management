import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Patient, Incident, DataContextType } from '../types';
import { 
  getStoredPatients, 
  setStoredPatients, 
  getStoredIncidents, 
  setStoredIncidents 
} from '../utils/localStorage';

const DataContext = createContext<DataContextType | null>(null);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    setPatients(getStoredPatients());
    setIncidents(getStoredIncidents());
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>): void => {
    const newPatient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    setStoredPatients(updatedPatients);
  };

  const updatePatient = (id: string, patientData: Partial<Patient>): void => {
    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...patientData } : patient
    );
    setPatients(updatedPatients);
    setStoredPatients(updatedPatients);
  };

  const deletePatient = (id: string): void => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    const updatedIncidents = incidents.filter(incident => incident.patientId !== id);
    
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    setStoredPatients(updatedPatients);
    setStoredIncidents(updatedIncidents);
  };

  const addIncident = (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): void => {
    const newIncident: Incident = {
      ...incidentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    setStoredIncidents(updatedIncidents);
  };

  const updateIncident = (id: string, incidentData: Partial<Incident>): void => {
    const updatedIncidents = incidents.map(incident =>
      incident.id === id 
        ? { ...incident, ...incidentData, updatedAt: new Date().toISOString() } 
        : incident
    );
    setIncidents(updatedIncidents);
    setStoredIncidents(updatedIncidents);
  };

  const deleteIncident = (id: string): void => {
    const updatedIncidents = incidents.filter(incident => incident.id !== id);
    setIncidents(updatedIncidents);
    setStoredIncidents(updatedIncidents);
  };

  const getPatientIncidents = (patientId: string): Incident[] => {
    return incidents.filter(incident => incident.patientId === patientId);
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
  };

  const value: DataContextType = {
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident,
    getPatientIncidents,
    getPatientById
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
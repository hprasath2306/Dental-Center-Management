import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PatientForm } from './PatientForm';
import { Plus, Edit, Trash2, Phone, Mail, Calendar, Users } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export const PatientManagement: React.FC = () => {
  const { patients, deletePatient, getPatientIncidents } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const handleEdit = (patientId: string) => {
    setSelectedPatient(patientId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleDelete = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This will also delete all their appointments.')) {
      deletePatient(patientId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-2">Manage patient information and records</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>
          Add New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => {
          const appointments = getPatientIncidents(patient.id);
          const upcomingAppointments = appointments.filter(apt => 
            new Date(apt.appointmentDate) > new Date()
          ).length;
          
          return (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">DOB: {formatDate(patient.dob)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(patient.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{patient.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{upcomingAppointments} upcoming appointments</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Health Info:</strong> {patient.healthInfo || 'None provided'}
                  </p>
                  {patient.allergies && (
                    <p className="text-sm text-red-600 mt-1">
                      <strong>Allergies:</strong> {patient.allergies}
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Patient since {formatDate(patient.createdAt)}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {patients.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No patients yet</h3>
            <p className="mb-4">Get started by adding your first patient</p>
            <Button onClick={handleAdd} icon={Plus}>
              Add First Patient
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <PatientForm
          patientId={selectedPatient}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};
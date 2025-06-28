import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { AppointmentForm } from './AppointmentForm';
import { Plus, Edit, Trash2, Calendar, DollarSign, FileText } from 'lucide-react';
import { formatDate, formatTime, isUpcoming } from '../../utils/dateUtils';

export const AppointmentManagement: React.FC = () => {
  const { incidents, deleteIncident, getPatientById } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredIncidents = incidents.filter(incident => {
    switch (filter) {
      case 'upcoming':
        return isUpcoming(incident.appointmentDate) && incident.status !== 'Cancelled';
      case 'completed':
        return incident.status === 'Completed';
      case 'cancelled':
        return incident.status === 'Cancelled';
      default:
        return true;
    }
  }).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const handleEdit = (incidentId: string) => {
    setSelectedIncident(incidentId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedIncident(null);
    setIsModalOpen(true);
  };

  const handleDelete = (incidentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIncident(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="primary">{status}</Badge>;
      case 'In Progress':
        return <Badge variant="warning">{status}</Badge>;
      case 'Completed':
        return <Badge variant="success">{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-2">Manage patient appointments and treatments</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>
          Schedule Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const patient = getPatientById(incident.patientId);
          return (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      <p className="text-gray-600">{patient?.name || 'Unknown Patient'}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(incident.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(incident.appointmentDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(incident.appointmentDate)}
                        </p>
                      </div>
                    </div>

                    {incident.cost && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            ${incident.cost}
                          </p>
                          <p className="text-sm text-gray-600">Treatment cost</p>
                        </div>
                      </div>
                    )}

                    {incident.files.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {incident.files.length} files
                          </p>
                          <p className="text-sm text-gray-600">Attachments</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-700">{incident.description}</p>
                    {incident.comments && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Notes:</strong> {incident.comments}
                      </p>
                    )}
                    {incident.treatment && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Treatment:</strong> {incident.treatment}
                      </p>
                    )}
                  </div>

                  {incident.nextAppointmentDate && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Next appointment:</strong> {formatDate(incident.nextAppointmentDate)} at {formatTime(incident.nextAppointmentDate)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(incident.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(incident.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No appointments found</h3>
            <p className="mb-4">
              {filter === 'all' 
                ? 'Get started by scheduling your first appointment'
                : `No ${filter} appointments to display`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={handleAdd} icon={Plus}>
                Schedule First Appointment
              </Button>
            )}
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedIncident ? 'Edit Appointment' : 'Schedule New Appointment'}
        size="xl"
      >
        <AppointmentForm
          incidentId={selectedIncident}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};
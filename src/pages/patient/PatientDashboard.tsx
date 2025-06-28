import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, DollarSign, FileText, Activity } from 'lucide-react';
import { formatDate, formatTime, isUpcoming } from '../../utils/dateUtils';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getPatientIncidents, getPatientById } = useData();

  const patientId = user?.patientId;
  const patient = patientId ? getPatientById(patientId) : null;
  const appointments = patientId ? getPatientIncidents(patientId) : [];

  const upcomingAppointments = appointments
    .filter(apt => isUpcoming(apt.appointmentDate))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const completedAppointments = appointments.filter(apt => apt.status === 'Completed');
  const totalCost = completedAppointments.reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const nextAppointment = upcomingAppointments[0];

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

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient information not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {patient.name}</h1>
        <p className="text-gray-600 mt-2">Your dental care dashboard</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointment */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointment</h3>
          {nextAppointment ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{nextAppointment.title}</h4>
                {getStatusBadge(nextAppointment.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(nextAppointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(nextAppointment.appointmentDate)}</span>
                </div>
              </div>
              
              <p className="text-gray-700">{nextAppointment.description}</p>
              
              {nextAppointment.comments && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Notes:</strong> {nextAppointment.comments}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No upcoming appointments</p>
              <p className="text-sm mt-1">Contact us to schedule your next visit</p>
            </div>
          )}
        </Card>

        {/* Patient Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-900">{formatDate(patient.dob)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Contact</label>
              <p className="text-gray-900">{patient.contact}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{patient.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-gray-900">{patient.address}</p>
            </div>

            {patient.allergies && (
              <div>
                <label className="text-sm font-medium text-red-600">Allergies</label>
                <p className="text-red-700">{patient.allergies}</p>
              </div>
            )}

            {patient.medications && (
              <div>
                <label className="text-sm font-medium text-gray-600">Current Medications</label>
                <p className="text-gray-900">{patient.medications}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No appointment history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments
              .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
              .slice(0, 5)
              .map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}</span>
                      </div>
                      
                      <p>{appointment.description}</p>
                      
                      {appointment.treatment && (
                        <p><strong>Treatment:</strong> {appointment.treatment}</p>
                      )}
                      
                      {appointment.cost && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${appointment.cost}</span>
                        </div>
                      )}

                      {appointment.files.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>{appointment.files.length} file(s) attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
};
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { formatDate, formatTime, isUpcoming } from '../../utils/dateUtils';

export const PatientAppointments: React.FC = () => {
  const { user } = useAuth();
  const { getPatientIncidents } = useData();

  const patientId = user?.patientId;
  const appointments = patientId ? getPatientIncidents(patientId) : [];

  const upcomingAppointments = appointments
    .filter(apt => isUpcoming(apt.appointmentDate))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const pastAppointments = appointments
    .filter(apt => !isUpcoming(apt.appointmentDate))
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

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

  const AppointmentCard: React.FC<{ appointment: any }> = ({ appointment }) => (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
          {getStatusBadge(appointment.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(appointment.appointmentDate)}
              </p>
              <p className="text-sm text-gray-600">
                {formatTime(appointment.appointmentDate)}
              </p>
            </div>
          </div>

          {appointment.cost && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${appointment.cost}
                </p>
                <p className="text-sm text-gray-600">Treatment cost</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-700">{appointment.description}</p>
          {appointment.comments && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>Notes:</strong> {appointment.comments}
            </p>
          )}
          {appointment.treatment && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>Treatment:</strong> {appointment.treatment}
            </p>
          )}
        </div>

        {appointment.files.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Attachments ({appointment.files.length})
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {appointment.files.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {appointment.nextAppointmentDate && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Next appointment:</strong> {formatDate(appointment.nextAppointmentDate)} at {formatTime(appointment.nextAppointmentDate)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-2">View your upcoming and past appointments</p>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Appointments ({upcomingAppointments.length})
        </h2>
        
        {upcomingAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
              <p>Contact us to schedule your next visit</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Past Appointments ({pastAppointments.length})
        </h2>
        
        {pastAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No appointment history</h3>
              <p>Your completed appointments will appear here</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
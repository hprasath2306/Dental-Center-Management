import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { isImageFile } from '../../utils/fileUtils';

export const PatientRecords: React.FC = () => {
  const { user } = useAuth();
  const { getPatientIncidents, getPatientById } = useData();

  const patientId = user?.patientId;
  const patient = patientId ? getPatientById(patientId) : null;
  const appointments = patientId ? getPatientIncidents(patientId) : [];

  const completedAppointments = appointments
    .filter(apt => apt.status === 'Completed' && apt.files.length > 0)
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const allFiles = appointments.flatMap(apt => 
    apt.files.map(file => ({
      ...file,
      appointmentTitle: apt.title,
      appointmentDate: apt.appointmentDate,
      appointmentId: apt.id
    }))
  );

  const handleFileView = (file: any) => {
    window.open(file.url, '_blank');
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
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600 mt-2">View your treatment records and files</p>
      </div>

      {/* Patient Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{patient.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-900">{formatDate(patient.dob)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Information</label>
              <p className="text-gray-900">{patient.contact}</p>
              <p className="text-gray-900">{patient.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-gray-900">{patient.address}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
              <p className="text-gray-900">{patient.emergencyContact}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Health Information</label>
              <p className="text-gray-900">{patient.healthInfo || 'None provided'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-red-600">Allergies</label>
              <p className="text-red-700">{patient.allergies || 'None'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Current Medications</label>
              <p className="text-gray-900">{patient.medications || 'None'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Patient Since</label>
              <p className="text-gray-900">{formatDate(patient.createdAt)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Treatment Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
            <div className="text-sm text-blue-800">Total Appointments</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'Completed').length}
            </div>
            <div className="text-sm text-green-800">Completed Treatments</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{allFiles.length}</div>
            <div className="text-sm text-purple-800">Medical Files</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              ${appointments.filter(apt => apt.status === 'Completed').reduce((sum, apt) => sum + (apt.cost || 0), 0)}
            </div>
            <div className="text-sm text-yellow-800">Total Treatment Cost</div>
          </div>
        </div>
      </Card>

      {/* All Files */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Medical Files ({allFiles.length})
        </h3>
        
        {allFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium mb-2">No files available</h4>
            <p>Your medical files and documents will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFiles.map(file => (
              <div
                key={`${file.appointmentId}-${file.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {isImageFile(file.type) ? '🖼️' : '📄'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleFileView(file)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title={isImageFile(file.type) ? 'Preview' : 'Download'}
                  >
                    {isImageFile(file.type) ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">From Treatment:</p>
                    <p className="text-sm text-gray-600">{file.appointmentTitle}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(file.appointmentDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Treatment History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Treatment History ({completedAppointments.length})
        </h3>
        
        {completedAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium mb-2">No completed treatments</h4>
            <p>Your completed treatments with files will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedAppointments.map(appointment => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}</span>
                      <Badge variant="success">Completed</Badge>
                      {appointment.cost && <span>${appointment.cost}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="text-gray-700">{appointment.description}</p>
                  {appointment.treatment && (
                    <p className="text-sm text-gray-600">
                      <strong>Treatment:</strong> {appointment.treatment}
                    </p>
                  )}
                  {appointment.comments && (
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {appointment.comments}
                    </p>
                  )}
                </div>
                
                {appointment.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Files ({appointment.files.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.files.map((file: any) => (
                        <button
                          key={file.id}
                          onClick={() => handleFileView(file)}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                        >
                          <span>{isImageFile(file.type) ? '🖼️' : '📄'}</span>
                          <span>{file.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
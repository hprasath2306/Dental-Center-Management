import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthDays, getWeekDays, formatTime, isToday } from '../../utils/dateUtils';

export const CalendarView: React.FC = () => {
  const { incidents, getPatientById } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthDays = getMonthDays(year, month);
  const weekDays = getWeekDays(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
      } else {
        // Week view navigation
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() + 7);
        }
      }
      return newDate;
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return incidents.filter(incident => 
      new Date(incident.appointmentDate).toDateString() === dateStr
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const getViewTitle = () => {
    if (view === 'month') {
      return `${monthNames[month]} ${year}`;
    } else {
      const startOfWeek = weekDays[0];
      const endOfWeek = weekDays[6];
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
    }
  };

  const renderMonthView = () => (
    <>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-px mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {monthDays.map((date, index) => {
          const appointments = getAppointmentsForDate(date);
          const isCurrentDay = isToday(date);
          const isCurrentMonthDate = isCurrentMonth(date);

          return (
            <div
              key={index}
              className={`
                bg-white p-2 min-h-[120px] border-r border-b border-gray-100
                ${!isCurrentMonthDate ? 'bg-gray-50 text-gray-400' : ''}
                ${isCurrentDay ? 'bg-blue-50' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-2
                ${isCurrentDay ? 'text-blue-600' : isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'}
              `}>
                {date.getDate()}
              </div>
              
              <div className="space-y-1">
                {appointments.slice(0, 3).map(appointment => {
                  const patient = getPatientById(appointment.patientId);
                  return (
                    <div
                      key={appointment.id}
                      className="p-1 bg-blue-100 rounded text-xs cursor-pointer hover:bg-blue-200 transition-colors"
                      title={`${appointment.title} - ${patient?.name} at ${formatTime(appointment.appointmentDate)}`}
                    >
                      <div className="font-medium text-blue-800 truncate">
                        {formatTime(appointment.appointmentDate)}
                      </div>
                      <div className="text-blue-600 truncate">
                        {patient?.name}
                      </div>
                      <div className="text-blue-600 truncate">
                        {appointment.title}
                      </div>
                    </div>
                  );
                })}
                
                {appointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{appointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderWeekView = () => (
    <>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
          const date = weekDays[index];
          const isCurrentDay = isToday(date);
          
          return (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">{day}</div>
              <div className={`
                text-lg font-semibold p-2 rounded-full w-10 h-10 mx-auto flex items-center justify-center
                ${isCurrentDay ? 'bg-blue-600 text-white' : 'text-gray-900'}
              `}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const appointments = getAppointmentsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={index}
              className={`
                bg-white p-3 rounded-lg border min-h-[300px]
                ${isCurrentDay ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}
              `}
            >
              <div className="space-y-2">
                {appointments.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    No appointments
                  </div>
                ) : (
                  appointments
                    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                    .map(appointment => {
                      const patient = getPatientById(appointment.patientId);
                      return (
                        <div
                          key={appointment.id}
                          className="p-2 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                        >
                          <div className="text-xs font-medium text-blue-800 mb-1">
                            {formatTime(appointment.appointmentDate)}
                          </div>
                          <div className="text-sm font-medium text-blue-900 truncate">
                            {appointment.title}
                          </div>
                          <div className="text-xs text-blue-700 truncate">
                            {patient?.name}
                          </div>
                          <div className="mt-1">
                            <Badge
                              variant={
                                appointment.status === 'Completed' ? 'success' :
                                appointment.status === 'In Progress' ? 'warning' :
                                appointment.status === 'Cancelled' ? 'danger' : 'primary'
                              }
                              size="sm"
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-2">View and manage appointments by date</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                view === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                view === 'week'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={() => navigate('prev')}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {getViewTitle()}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={() => navigate('next')}
            />
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        {/* Render appropriate view */}
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </Card>

      {/* Today's Appointments */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Appointments
        </h3>
        
        {(() => {
          const todayAppointments = getAppointmentsForDate(new Date());
          
          if (todayAppointments.length === 0) {
            return (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No appointments scheduled for today</p>
              </div>
            );
          }

          return (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .map(appointment => {
                  const patient = getPatientById(appointment.patientId);
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {formatTime(appointment.appointmentDate)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                          <p className="text-gray-600">{patient?.name}</p>
                          <p className="text-sm text-gray-500">{appointment.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            appointment.status === 'Completed' ? 'success' :
                            appointment.status === 'In Progress' ? 'warning' :
                            appointment.status === 'Cancelled' ? 'danger' : 'primary'
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })()}
      </Card>
    </div>
  );
};
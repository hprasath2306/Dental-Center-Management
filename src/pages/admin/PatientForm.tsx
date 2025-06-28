import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface PatientFormProps {
  patientId?: string | null;
  onClose: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patientId, onClose }) => {
  const { patients, addPatient, updatePatient } = useData();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    emergencyContact: '',
    healthInfo: '',
    allergies: '',
    medications: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setFormData({
          name: patient.name,
          dob: patient.dob,
          contact: patient.contact,
          email: patient.email,
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          healthInfo: patient.healthInfo,
          allergies: patient.allergies,
          medications: patient.medications
        });
      }
    }
  }, [patientId, patients]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (patientId) {
        updatePatient(patientId, formData);
      } else {
        addPatient(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Enter patient's full name"
        />

        <Input
          label="Date of Birth *"
          type="date"
          value={formData.dob}
          onChange={handleChange('dob')}
          error={errors.dob}
        />

        <Input
          label="Contact Number *"
          value={formData.contact}
          onChange={handleChange('contact')}
          error={errors.contact}
          placeholder="Enter 10-digit phone number"
        />

        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="Enter email address"
        />
      </div>

      <Input
        label="Address *"
        value={formData.address}
        onChange={handleChange('address')}
        error={errors.address}
        placeholder="Enter complete address"
      />

      <Input
        label="Emergency Contact *"
        value={formData.emergencyContact}
        onChange={handleChange('emergencyContact')}
        error={errors.emergencyContact}
        placeholder="Enter emergency contact number"
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Health Information
          </label>
          <textarea
            value={formData.healthInfo}
            onChange={handleChange('healthInfo')}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter any relevant health information"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergies
          </label>
          <textarea
            value={formData.allergies}
            onChange={handleChange('allergies')}
            rows={2}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="List any known allergies"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Medications
          </label>
          <textarea
            value={formData.medications}
            onChange={handleChange('medications')}
            rows={2}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="List current medications"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {patientId ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  );
};
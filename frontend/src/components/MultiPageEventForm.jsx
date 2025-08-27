import React, { useState, useContext } from "react";
import { EventFormProvider } from "../context/EventFormContext";
import { EventFormSection } from "./EventFormSection";
import { EventDescriptionSection } from "./EventDescripitonSection";
import { EventDynamicListSection } from "./EventDynamicListSection";
import { EventFormControls } from "./EventFormControls";
import StepProgress from "./form/StepProgress";
import DescriptionField from "./form/DescriptionField";
import FormActions from "./form/FormActions";
import FormField from "./form/FormField";
import { showToast } from "../utils/toast";
import { createEvent } from "../api/apiService";
import { useNavigate } from "react-router-dom";

const MultiPageEventForm = ({ initialData, disabled }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    isWorkshop: false, // Default to event (false)
    name: "",
    date: "",
    venue: "",
    numberOfMember: "",
    poster: null,
    description: "",
    ruleBook: "",
    amount: "",
    qrCode: null,
    coordinators: [],
    usefulLinks: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Basic Details",
      subtitle: "Event name, date, and venue"
    },
    {
      title: "Description", 
      subtitle: "Tell participants about your event"
    },
    {
      title: "Rules & Fees",
      subtitle: "Registration details and requirements"
    },
    {
      title: "Team & Links",
      subtitle: "Coordinators and useful resources"
    }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (formData.isWorkshop === null || formData.isWorkshop === undefined) newErrors.isWorkshop = "Please select a type";
        if (!formData.name?.trim()) newErrors.name = "Event name is required";
        if (!formData.date) newErrors.date = "Event date is required";
        if (!formData.venue?.trim()) newErrors.venue = "Venue is required";
        if (!formData.numberOfMember || formData.numberOfMember <= 0) newErrors.numberOfMember = "Number of members must be greater than 0";
        if (!formData.poster) newErrors.poster = "Event poster is required";
        break;
      case 1:
        if (!formData.description?.trim()) newErrors.description = "Description is required";
        break;
      case 2:
        if (!formData.ruleBook?.trim()) newErrors.ruleBook = "Rulebook link is required";
        if (!formData.amount || formData.amount <= 0) newErrors.amount = "Registration fee must be greater than 0";
        break;
      case 3:
        if (!formData.coordinators?.length) newErrors.coordinators = "At least one coordinator is required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSteps = () => {
    const allErrors = {};
    
    // Validate all required fields from schema
    if (formData.isWorkshop === null || formData.isWorkshop === undefined) allErrors.isWorkshop = "Please select a type";
    if (!formData.name?.trim()) allErrors.name = "Event name is required";
    if (!formData.date) allErrors.date = "Event date is required";
    if (!formData.venue?.trim()) allErrors.venue = "Venue is required";
    if (!formData.numberOfMember || formData.numberOfMember <= 0) allErrors.numberOfMember = "Number of members must be greater than 0";
    if (!formData.poster) allErrors.poster = "Event poster is required";
    if (!formData.description?.trim()) allErrors.description = "Description is required";
    if (!formData.coordinators?.length) allErrors.coordinators = "At least one coordinator is required";
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      showToast.error("Please complete all required fields in this section.");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex) => {
    // Allow navigation to any step without validation
    setCurrentStep(stepIndex);
  };

  const handleFieldChange = (field, value) => {
    // Special handling for file uploads
    if (field === 'poster' && value) {
      const file = value;
      const maxSize = 16 * 1024; // 16KB in bytes
      
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          poster: `File size must be less than 16KB. Current size: ${(file.size / 1024).toFixed(1)}KB` 
        }));
        return; // Don't update formData if file is too large
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Don't validate on every field change - only clear the current field's error
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      localStorage.setItem('event-draft', JSON.stringify(formData));
      // Could also save to server here
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Failed to save draft:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      showToast.largeError("Please complete all required fields before submitting the form.");
      return;
    }
    
    setLoading(true);
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('isWorkshop', formData.isWorkshop);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('date', formData.date); // Send as YYYY-MM-DD format
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('numberOfMember', parseInt(formData.numberOfMember));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('ruleBook', formData.ruleBook || "");
      formDataToSend.append('amount', parseFloat(formData.amount) || 0);
      // Add coordinator array with proper format
      const coordinators = formData.coordinators || [];
      coordinators.forEach((coord, index) => {
        formDataToSend.append(`coordinator[${index}][name]`, coord.name);
        formDataToSend.append(`coordinator[${index}][mobileNo]`, coord.mobileNo);
      });
      
      // Add usefulLinks array with proper format
      const usefulLinks = formData.usefulLinks || [];
      usefulLinks.forEach((link, index) => {
        formDataToSend.append(`usefulLinks[${index}][title]`, link.title);
        formDataToSend.append(`usefulLinks[${index}][link]`, link.link);
      });
      
      // Add files if they exist
      if (formData.poster) {
        formDataToSend.append('poster', formData.poster);
        console.log('Poster file added:', formData.poster.name, formData.poster.size);
      } else {
        console.log('No poster file found - adding placeholder');
        // Add a placeholder to ensure the field is present
        formDataToSend.append('poster', '');
      }
      if (formData.qrCode) {
        formDataToSend.append('qrCode', formData.qrCode);
      }

      // Debug: Log what's being sent
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }

      // Send to backend using API service
      const response = await createEvent(formDataToSend);
      
      showToast.largeSuccess("Event created successfully!");
      
      console.log('Event created:', response);
      
      // Redirect to manage events page after successful creation
      
    } catch (error) {
      console.error('Failed to submit:', error);
      showToast.largeError(error.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                Choose type of event <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isWorkshop"
                    value="false"
                    checked={formData.isWorkshop === false}
                    onChange={(e) => handleFieldChange('isWorkshop', e.target.value === 'true')}
                    className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white">Event</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isWorkshop"
                    value="true"
                    checked={formData.isWorkshop === true}
                    onChange={(e) => handleFieldChange('isWorkshop', e.target.value === 'true')}
                    className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white">Workshop</span>
                </label>
              </div>
              {errors.isWorkshop && (
                <p className="text-sm text-red-600">{errors.isWorkshop}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter event name"
                required
              />
              <FormField
                label="Event Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                error={errors.date}
                required
              />
              <FormField
                label="Venue"
                name="venue"
                value={formData.venue}
                onChange={(e) => handleFieldChange('venue', e.target.value)}
                error={errors.venue}
                placeholder="Event location"
                required
              />
              <FormField
                label="Number of Members"
                name="numberOfMember"
                type="number"
                value={formData.numberOfMember}
                onChange={(e) => handleFieldChange('numberOfMember', e.target.value)}
                error={errors.numberOfMember}
                placeholder="Max participants"
                required
              />
            </div>
            <FormField
              label="Event Poster"
              name="poster"
              type="file"
              value={formData.poster}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleFieldChange('poster', file);
                }
              }}
              error={errors.poster}
              accept="image/*"
              required
              helperText="Maximum file size: 16KB"
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <DescriptionField
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe your event in detail..."
              storageKey="event-description-draft"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Rulebook Link"
                name="ruleBook"
                value={formData.ruleBook}
                onChange={(e) => handleFieldChange('ruleBook', e.target.value)}
                error={errors.ruleBook}
                placeholder="https://..."
                required
              />
              <FormField
                label="Registration Fee"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                error={errors.amount}
                placeholder="0"
                required
              />
            </div>
            <FormField
              label="QR Code for Payment"
              name="qrCode"
              type="file"
              value={formData.qrCode}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleFieldChange('qrCode', file);
                }
              }}
              accept="image/*"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Coordinators Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Coordinators</h3>
                  <p className="text-sm text-secondary mt-1">Add event coordinators and their contact details</p>
                </div>
                <button
                  onClick={() => handleFieldChange('coordinators', [...(formData.coordinators || []), { name: '', mobileNo: '' }])}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  + Add Coordinator
                </button>
              </div>
              
              <div className="space-y-3">
                {(formData.coordinators || []).map((coordinator, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Coordinator name"
                        value={coordinator.name || ''}
                        onChange={(e) => {
                          const updated = [...(formData.coordinators || [])];
                          updated[index] = { ...updated[index], name: e.target.value };
                          handleFieldChange('coordinators', updated);
                        }}
                        className="px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Mobile number"
                        value={coordinator.mobileNo || ''}
                        onChange={(e) => {
                          const updated = [...(formData.coordinators || [])];
                          updated[index] = { ...updated[index], mobileNo: e.target.value };
                          handleFieldChange('coordinators', updated);
                        }}
                        className="px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updated = (formData.coordinators || []).filter((_, i) => i !== index);
                        handleFieldChange('coordinators', updated);
                      }}
                      className="px-2 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(formData.coordinators || []).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No coordinators added yet</p>
                )}
              </div>
            </div>

            {/* Useful Links Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Useful Links</h3>
                  <p className="text-sm text-secondary mt-1">Add relevant links for participants</p>
                </div>
                <button
                  onClick={() => handleFieldChange('usefulLinks', [...(formData.usefulLinks || []), { title: '', link: '' }])}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  + Add Link
                </button>
              </div>
              
              <div className="space-y-3">
                {(formData.usefulLinks || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Link title"
                        value={link.title || ''}
                        onChange={(e) => {
                          const updated = [...(formData.usefulLinks || [])];
                          updated[index] = { ...updated[index], title: e.target.value };
                          handleFieldChange('usefulLinks', updated);
                        }}
                        className="px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.link || ''}
                        onChange={(e) => {
                          const updated = [...(formData.usefulLinks || [])];
                          updated[index] = { ...updated[index], link: e.target.value };
                          handleFieldChange('usefulLinks', updated);
                        }}
                        className="px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updated = (formData.usefulLinks || []).filter((_, i) => i !== index);
                        handleFieldChange('usefulLinks', updated);
                      }}
                      className="px-2 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(formData.usefulLinks || []).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No useful links added yet</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <EventFormProvider initialData={initialData}>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Event
            </h1>
            <p className="text-secondary">
              Build your event step by step
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <StepProgress
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              stepData={formData}
            />
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-xl border border-white/10">
            {/* Step Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-secondary text-sm mt-1">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {renderStepContent()}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <FormActions
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </EventFormProvider>
  );
};

export default MultiPageEventForm;

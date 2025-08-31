import React, { useState, useContext } from "react";
import { EventFormProvider } from "../context/EventFormContext";
import { EventFormControls } from "./EventFormControls";
import StepProgress from "./form/StepProgress";
import FormActions from "./form/FormActions";
import FormField from "./form/FormField";
import CustomRichTextEditor from "./form/CustomRichTextEditor";
import { showToast } from "../utils/toast";
import { createEvent } from "../api/apiService";
import { useNavigate } from "react-router-dom";

const MultiPageEventForm = ({ initialData, disabled, onSave, isLoading }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    isWorkshop: false,
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

  // Compact 3-step design
  const steps = [
    {
      title: "Basic Details",
      subtitle: "Event info, rules & poster"
    },
    {
      title: "Description", 
      subtitle: "Rich description of your event"
    },
    {
      title: "Team & Links",
      subtitle: "Coordinators & resources"
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
        if (!formData.ruleBook?.trim()) newErrors.ruleBook = "Rulebook link is required";
        if (!formData.amount || formData.amount <= 0) newErrors.amount = "Registration fee must be greater than 0";
        break;
      case 1:
        if (!formData.description?.trim()) newErrors.description = "Description is required";
        break;
      case 2:
        if (!formData.coordinators?.length) newErrors.coordinators = "At least one coordinator is required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSteps = () => {
    const allErrors = {};
    
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
    setCurrentStep(stepIndex);
  };

  const handleFieldChange = (field, value) => {
    if (field === 'poster' && value) {
      const file = value;
      const maxSize = 16 * 1024;
      
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          poster: `File size must be less than 16KB. Current size: ${(file.size / 1024).toFixed(1)}KB` 
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      showToast.largeError("Please complete all required fields before submitting the form.");
      return;
    }
    
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('isWorkshop', formData.isWorkshop);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('numberOfMember', parseInt(formData.numberOfMember));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('ruleBook', formData.ruleBook || "");
      formDataToSend.append('amount', parseFloat(formData.amount) || 0);
      
      const coordinators = formData.coordinators || [];
      coordinators.forEach((coord, index) => {
        formDataToSend.append(`coordinator[${index}][name]`, coord.name);
        formDataToSend.append(`coordinator[${index}][mobileNo]`, coord.mobileNo);
      });
      
      const usefulLinks = formData.usefulLinks || [];
      usefulLinks.forEach((link, index) => {
        formDataToSend.append(`usefulLinks[${index}][title]`, link.title);
        formDataToSend.append(`usefulLinks[${index}][link]`, link.link);
      });
      
      if (formData.poster) {
        formDataToSend.append('poster', formData.poster);
      } else {
        formDataToSend.append('poster', '');
      }
      if (formData.qrCode) {
        formDataToSend.append('qrCode', formData.qrCode);
      }

      if (onSave) {
        await onSave(formDataToSend);
      } else {
        const response = await createEvent(formDataToSend);
        showToast.largeSuccess("Event created successfully!");
        navigate("/events/manage");
      }
      
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
          <div className="space-y-4">
            {/* Type Selection - Compact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isWorkshop"
                    value="false"
                    checked={formData.isWorkshop === false}
                    onChange={(e) => handleFieldChange('isWorkshop', e.target.value === 'true')}
                    className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">Event</span>
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
                  <span className="text-white text-sm">Workshop</span>
                </label>
              </div>
              {errors.isWorkshop && (
                <p className="text-sm text-red-600">{errors.isWorkshop}</p>
              )}
            </div>

            {/* Basic Details - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Max Participants"
                name="numberOfMember"
                type="number"
                value={formData.numberOfMember}
                onChange={(e) => handleFieldChange('numberOfMember', e.target.value)}
                error={errors.numberOfMember}
                placeholder="0"
                required
              />
            </div>

            {/* Rules & Fees - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            {/* File Uploads - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                helperText="Max 16KB"
              />
              <FormField
                label="Payment QR Code (Optional)"
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {/* Custom Rich Text Editor - Full Page */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Event Description <span className="text-red-500">*</span>
              </label>
              <CustomRichTextEditor
                value={formData.description}
                onChange={(value) => handleFieldChange('description', value)}
                placeholder="Describe your event in detail. Use the toolbar above to format your text with bold, italic, headings, lists, and links..."
                height="600px"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Coordinators - Compact */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Coordinators</h3>
                  <p className="text-xs text-secondary">Add event coordinators</p>
                </div>
                <button
                  onClick={() => handleFieldChange('coordinators', [...(formData.coordinators || []), { name: '', mobileNo: '' }])}
                  className="px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  + Add
                </button>
              </div>
              
              <div className="space-y-2">
                {(formData.coordinators || []).map((coordinator, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10">
                    <input
                      type="text"
                      placeholder="Name"
                      value={coordinator.name || ''}
                      onChange={(e) => {
                        const updated = [...(formData.coordinators || [])];
                        updated[index] = { ...updated[index], name: e.target.value };
                        handleFieldChange('coordinators', updated);
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile"
                      value={coordinator.mobileNo || ''}
                      onChange={(e) => {
                        const updated = [...(formData.coordinators || [])];
                        updated[index] = { ...updated[index], mobileNo: e.target.value };
                        handleFieldChange('coordinators', updated);
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const updated = (formData.coordinators || []).filter((_, i) => i !== index);
                        handleFieldChange('coordinators', updated);
                      }}
                      className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(formData.coordinators || []).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No coordinators added</p>
                )}
              </div>
              {errors.coordinators && (
                <p className="text-sm text-red-600 mt-1">{errors.coordinators}</p>
              )}
            </div>

            {/* Useful Links - Compact */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Useful Links</h3>
                  <p className="text-xs text-secondary">Add relevant resources</p>
                </div>
                <button
                  onClick={() => handleFieldChange('usefulLinks', [...(formData.usefulLinks || []), { title: '', link: '' }])}
                  className="px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  + Add
                </button>
              </div>
              
              <div className="space-y-2">
                {(formData.usefulLinks || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10">
                    <input
                      type="text"
                      placeholder="Title"
                      value={link.title || ''}
                      onChange={(e) => {
                        const updated = [...(formData.usefulLinks || [])];
                        updated[index] = { ...updated[index], title: e.target.value };
                        handleFieldChange('usefulLinks', updated);
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="flex-1 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const updated = (formData.usefulLinks || []).filter((_, i) => i !== index);
                        handleFieldChange('usefulLinks', updated);
                      }}
                      className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(formData.usefulLinks || []).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No links added</p>
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {onSave ? "Edit Event" : "Create Event"}
            </h1>
            <p className="text-secondary text-sm">
              {onSave ? "Update your event" : "Build your event in 3 simple steps"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <StepProgress
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              stepData={formData}
            />
          </div>

          {/* Compact Form Container */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-xl border border-white/10">
            {/* Step Header - Compact */}
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-secondary text-xs mt-0.5">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Form Content - Compact */}
            <div className="p-4">
              {renderStepContent()}
            </div>

            {/* Actions - Compact */}
            <div className="px-4 pb-4">
              <FormActions
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                loading={loading}
                isEditMode={!!onSave}
              />
            </div>
          </div>
        </div>
      </div>
    </EventFormProvider>
  );
};

export default MultiPageEventForm;

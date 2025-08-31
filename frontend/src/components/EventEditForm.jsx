import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./form/FormField";
import CustomRichTextEditor from "./form/CustomRichTextEditor";
import { showToast } from "../utils/toast";
import { updateEvent } from "../api/apiService";

const EventEditForm = ({ event, onSave, onCancel, isLoading }) => {
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

  // Initialize form data with existing event data
  useEffect(() => {
    if (event) {
      setFormData({
        isWorkshop: event.isWorkshop || false,
        name: event.name || "",
        date: event.date ? event.date.split('T')[0] : "", // Convert ISO date to YYYY-MM-DD
        venue: event.venue || "",
        numberOfMember: event.numberOfMember || "",
        poster: null, // Don't pre-fill files, user can choose to re-upload
        description: event.description || "",
        ruleBook: event.ruleBook || "",
        amount: event.amount || "",
        qrCode: null, // Don't pre-fill files, user can choose to re-upload
        coordinators: event.coordinator || [],
        usefulLinks: event.usefulLinks || []
      });
    }
  }, [event]);

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

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCoordinatorChange = (index, field, value) => {
    const updatedCoordinators = [...formData.coordinators];
    updatedCoordinators[index] = { ...updatedCoordinators[index], [field]: value };
    setFormData(prev => ({ ...prev, coordinators: updatedCoordinators }));
  };

  const addCoordinator = () => {
    setFormData(prev => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: "", mobileNo: "" }]
    }));
  };

  const removeCoordinator = (index) => {
    setFormData(prev => ({
      ...prev,
      coordinators: prev.coordinators.filter((_, i) => i !== index)
    }));
  };

  const handleUsefulLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.usefulLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, usefulLinks: updatedLinks }));
  };

  const addUsefulLink = () => {
    setFormData(prev => ({
      ...prev,
      usefulLinks: [...prev.usefulLinks, { title: "", link: "" }]
    }));
  };

  const removeUsefulLink = (index) => {
    setFormData(prev => ({
      ...prev,
      usefulLinks: prev.usefulLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      showToast.error("Please complete all required fields before submitting.");
      return;
    }
    
    setLoading(true);
    try {
      // Check if we have files to upload
      const hasFiles = (formData.poster && formData.poster instanceof File) || 
                      (formData.qrCode && formData.qrCode instanceof File);

      if (hasFiles) {
        // Use FormData if files are present
        const formDataToSend = new FormData();
        
        // Basic fields
        formDataToSend.append('isWorkshop', formData.isWorkshop);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('venue', formData.venue);
        formDataToSend.append('numberOfMember', parseInt(formData.numberOfMember));
        formDataToSend.append('description', formData.description);
        formDataToSend.append('ruleBook', formData.ruleBook || "");
        formDataToSend.append('amount', parseFloat(formData.amount) || 0);
        
        // Coordinators - send as JSON string for better backend parsing
        const coordinators = formData.coordinators || [];
        formDataToSend.append('coordinator', JSON.stringify(coordinators));
        
        // Useful Links - send as JSON string for better backend parsing
        const usefulLinks = formData.usefulLinks || [];
        formDataToSend.append('usefulLinks', JSON.stringify(usefulLinks));
        
        // Files
        if (formData.poster && formData.poster instanceof File) {
          formDataToSend.append('poster', formData.poster);
        }
        if (formData.qrCode && formData.qrCode instanceof File) {
          formDataToSend.append('qrCode', formData.qrCode);
        }

        console.log("=== FORM DATA BEING SENT ===");
        console.log("Event ID:", event._id || event.id);
        console.log("FormData entries:");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }
        console.log("=== END FORM DATA ===");

        if (onSave) {
          await onSave(formDataToSend);
        }
      } else {
        // Use JSON if no files (more reliable for backend parsing)
        const jsonData = {
          isWorkshop: formData.isWorkshop,
          name: formData.name,
          date: formData.date,
          venue: formData.venue,
          numberOfMember: parseInt(formData.numberOfMember),
          description: formData.description,
          ruleBook: formData.ruleBook || "",
          amount: parseFloat(formData.amount) || 0,
          coordinator: formData.coordinators || [],
          usefulLinks: formData.usefulLinks || []
        };

        console.log("=== JSON DATA BEING SENT ===");
        console.log("Event ID:", event._id || event.id);
        console.log("JSON Data:", jsonData);
        console.log("=== END JSON DATA ===");

        if (onSave) {
          await onSave(jsonData);
        }
      }
      
    } catch (error) {
      console.error('Failed to update:', error);
      showToast.error(error.message || "Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Event Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Event Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isWorkshop"
                    checked={formData.isWorkshop === false}
                    onChange={() => handleFieldChange('isWorkshop', false)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white">Event</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isWorkshop"
                    checked={formData.isWorkshop === true}
                    onChange={() => handleFieldChange('isWorkshop', true)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white">Workshop</span>
                </label>
              </div>
              {errors.isWorkshop && <p className="text-red-400 text-xs">{errors.isWorkshop}</p>}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Event Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={errors.name}
                required
              />
              <FormField
                label="Event Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                error={errors.date}
                required
              />
              <FormField
                label="Venue"
                type="text"
                value={formData.venue}
                onChange={(e) => handleFieldChange('venue', e.target.value)}
                error={errors.venue}
                required
              />
              <FormField
                label="Max Participants"
                type="number"
                value={formData.numberOfMember}
                onChange={(e) => handleFieldChange('numberOfMember', e.target.value)}
                error={errors.numberOfMember}
                required
              />
            </div>

            {/* Rules & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Rulebook Link"
                type="url"
                value={formData.ruleBook}
                onChange={(e) => handleFieldChange('ruleBook', e.target.value)}
                error={errors.ruleBook}
                required
              />
              <FormField
                label="Registration Fee (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                error={errors.amount}
                required
              />
            </div>

            {/* Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Event Poster {event.poster && <span className="text-gray-500">(Optional - Current: {event.poster.split('/').pop()})</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('poster', e.target.files[0])}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer bg-gray-800/50 border border-gray-700/50 rounded-lg p-2"
                />
                {errors.poster && <p className="text-red-400 text-xs">{errors.poster}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Payment QR Code {event.qrCode && <span className="text-gray-500">(Optional - Current: {event.qrCode.split('/').pop()})</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('qrCode', e.target.files[0])}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer bg-gray-800/50 border border-gray-700/50 rounded-lg p-2"
                />
                {errors.qrCode && <p className="text-red-400 text-xs">{errors.qrCode}</p>}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <CustomRichTextEditor
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe your event in detail..."
              height="500px"
            />
            {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Coordinators */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Event Coordinators</label>
                <button
                  type="button"
                  onClick={addCoordinator}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Add Coordinator
                </button>
              </div>
              
              {formData.coordinators.map((coordinator, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <FormField
                    label="Name"
                    type="text"
                    value={coordinator.name}
                    onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                    required
                  />
                  <FormField
                    label="Mobile Number"
                    type="tel"
                    value={coordinator.mobileNo}
                    onChange={(e) => handleCoordinatorChange(index, 'mobileNo', e.target.value)}
                    required
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeCoordinator(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {errors.coordinators && <p className="text-red-400 text-xs">{errors.coordinators}</p>}
            </div>

            {/* Useful Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Useful Links</label>
                <button
                  type="button"
                  onClick={addUsefulLink}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Add Link
                </button>
              </div>
              
              {formData.usefulLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <FormField
                    label="Title"
                    type="text"
                    value={link.title}
                    onChange={(e) => handleUsefulLinkChange(index, 'title', e.target.value)}
                  />
                  <FormField
                    label="URL"
                    type="url"
                    value={link.link}
                    onChange={(e) => handleUsefulLinkChange(index, 'link', e.target.value)}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeUsefulLink(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Event</h1>
        <p className="text-gray-400">Update your event details</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.subtitle}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Back
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isLoading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading || isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Event'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventEditForm;

import React, { useState } from "react";

const StepProgress = ({ steps, currentStep, onStepClick, stepData = {} }) => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const getStepStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "pending";
  };

  const isStepComplete = (index) => {
    const data = stepData;
    switch (index) {
      case 0:
        return data.name?.trim() && data.date && data.venue?.trim() && 
               data.numberOfMember > 0 && data.poster && 
               data.ruleBook?.trim() && data.amount > 0;
      case 1:
        return data.description?.trim();
      case 2:
        return data.coordinators?.length > 0;
      default:
        return false;
    }
  };

  const isStepClickable = (index) => {
    return true;
  };

  const getStepSummary = (index) => {
    const data = stepData;
    switch (index) {
      case 0:
        return data.name ? `${data.name}` : "Event name required";
      case 1:
        return data.description ? `${data.description.length} characters` : "Description needed";
      case 2:
        return data.coordinators?.length || data.usefulLinks?.length ? "Team & links added" : "Team & links needed";
      default:
        return "";
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = isStepClickable(index);
           
            return (
              <div key={index} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => isClickable && onStepClick(index)}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    disabled={!isClickable}
                    className={`group relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                      isStepComplete(index)
                        ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                        : status === "current"
                        ? "bg-blue-500 text-white ring-2 ring-blue-200"
                        : "bg-gray-300 text-gray-600 cursor-pointer"
                    }`}
                  >
                    {isStepComplete(index) ? "✓" : index + 1}
                  </button>
                  
                  {/* Step Label */}
                  <div className="mt-1 text-center">
                    <div className={`text-xs font-medium ${
                      isStepComplete(index) ? "text-green-400" : index === currentStep ? "text-white" : "text-gray-400"
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Hover Card */}
                  {hoveredStep === index && isClickable && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-2 z-10">
                      <div className="text-sm font-medium text-white mb-1">
                        {step.title}
                      </div>
                      <div className="text-xs text-secondary mb-1">
                        {step.subtitle}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getStepSummary(index)}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/20 rotate-45"></div>
                    </div>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${
                    isStepComplete(index) ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = isStepClickable(index);
           
            return (
              <button
                key={index}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`flex-1 mx-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  isStepComplete(index)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : status === "current"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}
              >
                {step.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;

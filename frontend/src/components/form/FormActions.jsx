import React from "react";

const FormActions = ({ 
  onBack, 
  onNext, 
  onSubmit, 
  isFirst = false, 
  isLast = false, 
  loading = false,
  isEditMode = false
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst || loading}
          className={`px-3 py-1.5 text-sm font-medium rounded border transition-colors ${
            isFirst || loading
              ? "border-white/10 text-gray-400 cursor-not-allowed"
              : "border-white/20 text-white hover:bg-white/10"
          }`}
        >
          Back
        </button>
      </div>

      <div className="flex items-center gap-2">
        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : (isEditMode ? "Update Event" : "Create Event")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={loading}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormActions;

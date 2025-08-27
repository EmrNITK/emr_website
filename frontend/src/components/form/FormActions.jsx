import React from "react";

const FormActions = ({ 
  onBack, 
  onNext, 
  onSubmit, 
  isFirst = false, 
  isLast = false, 
  loading = false
}) => {
     return (
     <div className="flex items-center justify-between pt-6 border-t border-white/10">
       <div className="flex items-center gap-3">
         <button
           type="button"
           onClick={onBack}
           disabled={isFirst || loading}
           className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
             isFirst || loading
               ? "border-white/10 text-gray-400 cursor-not-allowed"
               : "border-white/20 text-white hover:bg-white/10"
           }`}
         >
           Back
         </button>
         

       </div>

       <div className="flex items-center gap-3">
         {isLast ? (
           <button
             type="button"
             onClick={onSubmit}
             disabled={loading}
             className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
               loading
                 ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                 : "bg-blue-600 text-white hover:bg-blue-700"
             }`}
           >
             {loading ? "Submitting..." : "Create Event"}
           </button>
         ) : (
           <button
             type="button"
             onClick={onNext}
             disabled={loading}
             className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
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

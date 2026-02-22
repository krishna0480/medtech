import React from "react";
import { Camera, Loader2, XCircle } from "lucide-react";

interface FormFileUploadProps {
  currentUrl: string;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: () => void;
}

export const FormFileUpload = ({ currentUrl, isUploading, onUpload, onRemove }: FormFileUploadProps) => {
  if (isUploading) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50/30 flex flex-col items-center justify-center min-h-[220px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="text-sm font-bold text-slate-500 mt-3">Uploading proof...</span>
      </div>
    );
  }

  if (currentUrl) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50/30 flex flex-col items-center justify-center min-h-[220px]">
        <div className="relative group/img">
          <img src={currentUrl} className="w-40 h-40 object-cover rounded-3xl shadow-xl border-4 border-white" alt="Proof" />
          <button 
            type="button" 
            onClick={onRemove} 
            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          >
            <XCircle size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50/30 flex flex-col items-center justify-center min-h-[220px] transition-colors hover:border-blue-300">
      <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <Camera size={32} className="text-blue-500" />
      </div>
      <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={onUpload} />
      <label htmlFor="photo-upload" className="cursor-pointer text-center">
        <span className="block text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">Upload Photo Proof</span>
        <span className="text-xs font-medium text-slate-400">PNG, JPG up to 10MB</span>
      </label>
    </div>
  );
};
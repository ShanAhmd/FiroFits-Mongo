import React, { useState, useEffect } from 'react';
import { type OrderData } from '../types';
import { UploadIcon, FileIcon } from './IconComponents';

interface DesignUploadProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const DesignUpload: React.FC<DesignUploadProps> = ({ orderData, updateOrderData }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!orderData.designFiles || orderData.designFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = orderData.designFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [orderData.designFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateOrderData({ designFiles: Array.from(e.target.files) });
    }
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div className="border-b border-black pb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray font-bold block mb-2">Step 02</span>
        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter">Upload Designs</h2>
        <p className="text-xs text-brand-dark-gray font-light mt-2 tracking-wide">
          Upload any reference images or sketches for your custom clothing.
        </p>
      </div>

      <div className="space-y-6">
        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black">
          Reference Images
        </label>
        
        {/* DRAG & DROP ZONE */}
        <div className="border border-black border-dashed bg-gray-50 p-12 transition-all hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer relative">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            onChange={handleFileChange}
          />
          <UploadIcon className="h-10 w-10 text-black mb-4" />
          <span className="text-xs font-bold uppercase tracking-widest text-black mb-1">Click to Upload</span>
          <p className="text-[9px] text-brand-dark-gray uppercase tracking-widest">
            Drag & Drop / Select Files (PNG, JPG, PDF)
          </p>
        </div>

        {previews.length > 0 && (
          <div className="pt-6">
            <p className="font-bold text-[10px] uppercase tracking-[0.3em] mb-4 text-black border-b border-black/20 pb-2">
              Uploaded Files [{orderData.designFiles.length}]
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {orderData.designFiles.map((file, index) => (
                <div key={index} className="border border-black p-2 flex flex-col items-center bg-white group">
                  {file.type.startsWith('image/') ? (
                    <div className="w-full h-32 overflow-hidden bg-gray-100">
                      <img src={previews[index]} alt={file.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 border border-black/10">
                      <FileIcon className="h-8 w-8 text-black" />
                    </div>
                  )}
                  <p className="text-[8px] text-black font-bold uppercase tracking-[0.2em] mt-3 truncate w-full text-center" title={file.name}>
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6">
        <label htmlFor="instructions" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black">
          Special Instructions
        </label>
        <textarea
          id="instructions"
          rows={5}
          className="w-full border-0 border-b border-black focus:border-black focus:ring-0 bg-transparent px-0 py-3 text-xs font-light tracking-wide placeholder-gray-400 rounded-none resize-none"
          placeholder="Tell us any specific details, like fabric choices or styling preferences..."
          value={orderData.specialInstructions}
          onChange={(e) => updateOrderData({ specialInstructions: e.target.value })}
        ></textarea>
      </div>
    </div>
  );
};

export default DesignUpload;

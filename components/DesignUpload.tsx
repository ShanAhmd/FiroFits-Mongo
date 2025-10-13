import React, { useState, useEffect } from 'react';
import { type OrderData } from '../types';
import { getDesignSuggestions } from '../services/geminiService';
import { UploadIcon, LightbulbIcon, FileIcon } from './IconComponents';

interface DesignUploadProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
}

const DesignUpload: React.FC<DesignUploadProps> = ({ orderData, updateOrderData }) => {
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!orderData.designFiles || orderData.designFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = orderData.designFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [orderData.designFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateOrderData({ designFiles: Array.from(e.target.files) });
    }
  };
  
  const handleGetSuggestion = async () => {
    if (!ideaPrompt.trim()) {
      setError('Please describe your design idea first.');
      return;
    }
    setError('');
    setIsLoading(true);
    setSuggestion('');
    const result = await getDesignSuggestions(ideaPrompt);
    setSuggestion(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-charcoal mb-2">Upload Your Design</h2>
      <p className="text-brand-dark-gray mb-8">Share your inspiration with us. You can upload multiple files.</p>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-brand-charcoal mb-2">Design Files</label>
        <div className="mt-1 flex justify-center p-6 border-2 border-brand-light-gray border-dashed rounded-xl bg-gray-50">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-brand-dark-gray" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-50 rounded-md font-semibold text-brand-teal hover:text-teal-600 focus-within:outline-none">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
              </label>
              <p className="pl-1 text-brand-dark-gray">or drag and drop</p>
            </div>
            <p className="text-xs text-brand-dark-gray">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {previews.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-sm mb-2 text-brand-charcoal">Previews:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {orderData.designFiles.map((file, index) => (
                <div key={index} className="relative group border border-brand-light-gray rounded-lg p-2 flex flex-col items-center text-center bg-white shadow-sm">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
                        <FileIcon className="h-10 w-10 text-brand-dark-gray" />
                    </div>
                  )}
                  <p className="text-xs text-brand-dark-gray mt-2 truncate w-full" title={file.name}>
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <label htmlFor="instructions" className="block text-sm font-semibold text-brand-charcoal">Special Instructions</label>
        <textarea
          id="instructions"
          rows={4}
          className="mt-2 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal"
          placeholder="e.g., 'I want the neckline to be slightly higher than in the photo.'"
          value={orderData.specialInstructions}
          onChange={e => updateOrderData({ specialInstructions: e.target.value })}
        ></textarea>
      </div>

      <div className="p-6 bg-teal-50 border border-brand-teal/30 rounded-xl">
        <div className="flex items-start space-x-4">
          <LightbulbIcon className="h-8 w-8 text-brand-teal flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-brand-charcoal">Need Inspiration?</h3>
            <p className="text-sm text-brand-dark-gray mb-4">Describe your idea, and our AI assistant can help you flesh it out.</p>
            <textarea
              rows={2}
              className="block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal"
              placeholder="e.g., 'a long-sleeve blue blouse with a Peter Pan collar'"
              value={ideaPrompt}
              onChange={e => setIdeaPrompt(e.target.value)}
            ></textarea>
            {error && <p className="text-brand-error text-xs mt-1">{error}</p>}
            <button
              onClick={handleGetSuggestion}
              disabled={isLoading}
              className="mt-3 px-5 py-2 bg-brand-teal text-white rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:bg-brand-dark-gray"
            >
              {isLoading ? 'Generating...' : 'Get Ideas'}
            </button>
            {suggestion && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg text-sm text-brand-charcoal">
                <p className="font-semibold mb-1">Suggestion:</p>
                <p className="text-brand-dark-gray">{suggestion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignUpload;

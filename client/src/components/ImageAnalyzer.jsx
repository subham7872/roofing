import React, { useState } from 'react';
import { analyzeRoofImage } from '../services/geminiService';
import { Button } from './Button';

export const ImageAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    const base64 = image.split(',')[1];
    const result = await analyzeRoofImage(base64);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto my-12" id="ai-analyzer">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-blue-900 mb-4">AI Roof Health Check</h2>
        <p className="text-slate-600">Upload a photo of your roof for an instant AI-powered preliminary inspection.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative">
            {image ? (
              <img src={image} alt="Uploaded Roof" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 text-gray-400">
                <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                <p>Click below to select a photo</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              id="roof-upload" 
            />
            <label 
              htmlFor="roof-upload" 
              className="cursor-pointer bg-blue-50 text-blue-700 text-center py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition font-medium"
            >
              <i className="fas fa-image mr-2"></i> {image ? 'Change Photo' : 'Select Photo'}
            </label>
            <Button onClick={handleAnalyze} disabled={!image || isLoading} className="w-full">
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...</>
              ) : (
                <><i className="fas fa-brain mr-2"></i> Run AI Analysis</>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 min-h-[300px] border border-gray-200">
          <h3 className="font-medium text-base text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-clipboard-list text-blue-600"></i>
            Analysis Report
          </h3>
          {analysis ? (
            <div className="prose prose-blue prose-sm text-slate-700 whitespace-pre-line">
              {analysis}
              <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg text-xs">
                <strong>Disclaimer:</strong> This is an AI-generated assessment and should not replace a professional on-site inspection.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
              <i className="fas fa-search text-3xl mb-3"></i>
              <p>Your results will appear here after analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


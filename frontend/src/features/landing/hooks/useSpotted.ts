import { useState, useRef } from 'react';
import { spottedService, SpottedPrediction } from '../services/spottedService';

export function useSpotted() {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [predictions, setPredictions] = useState<SpottedPrediction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [spottedError, setSpottedError] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setStep('preview');
    setSpottedError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setPreview(null);
    setLocation('');
    setDescription('');
    setPredictions([]);
    setSpottedError(null);
    setResultImageUrl(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    if (!location.trim()) {
      setSpottedError('Lokacija je obavezna.');
      return;
    }

    setSubmitting(true);
    setSpottedError(null);

    try {
      const cvResult = await spottedService.predict(selectedFile);
      await spottedService.reportSpotted({
        imageUrl: cvResult.imageUrl,
        location: location.trim(),
        description: description.trim() || undefined,
      });
      setPredictions(cvResult.predictions);
      setResultImageUrl(cvResult.imageUrl);
      setStep('result');
    } catch {
      setSpottedError('Greška pri prijavi psa. Pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    preview,
    location,
    setLocation,
    description,
    setDescription,
    predictions,
    submitting,
    spottedError,
    setSpottedError, 
    resultImageUrl,
    fileInputRef,
    handleFileSelect,
    handleDrop, 
    handleReset,
    handleSubmit
  };
}
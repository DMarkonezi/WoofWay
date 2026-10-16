  import { useState } from 'react';

export function useForm<T>(initialValues: T, validate: (values: T) => Partial<Record<keyof T, string>>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    setErrors(prev => {
      if (!prev[field]) return prev
      return { ...prev, [field]: undefined }
    })
  };

  const validateForm = () => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validateForm };
}
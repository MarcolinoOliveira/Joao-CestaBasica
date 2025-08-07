'use client'

import { Input } from '@/components/ui/input';
import React from 'react';


interface MaskedInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MaskedTelephoneInput: React.FC<MaskedInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    let formattedValue = '';

    if (inputValue.length > 0) {
      formattedValue += '(' + inputValue.slice(0, 2); // Adiciona o DDD
    }
    if (inputValue.length > 2) {
      formattedValue += ') ' + inputValue.slice(2, 7); // Adiciona o espaço
    }
    if (inputValue.length > 7) {
      formattedValue += '-' + inputValue.slice(7, 11); // Adiciona o hífen
    }

    onChange(formattedValue);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      className="col-span-3"
      placeholder="(88) 99999-9999"
    />
  );
};

export default MaskedTelephoneInput;
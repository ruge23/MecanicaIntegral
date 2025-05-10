import React, { useState, useEffect } from 'react';
import { TextInput, TextInputProps, StyleProp, TextStyle } from 'react-native';

interface PriceInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (numericValue: number) => void;
  style?: StyleProp<TextStyle>;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChangeText, style, ...props }) => {
  const [inputValue, setInputValue] = useState('');

  // Convertir el valor numérico a string con coma decimal al cargar
  useEffect(() => {
    if (value === 0) {
      setInputValue('');
    } else {
      setInputValue(value.toString().replace('.', ','));
    }
  }, [value]);

  const handleChange = (text: string) => {
    // Permitir solo números y una coma
    const cleaned = text.replace(/[^\d,]/g, '');
    const parts = cleaned.split(',');
    
    if (parts.length > 2) return; // Máximo una coma
    
    setInputValue(cleaned);
    
    // Convertir a número (reemplazar coma por punto)
    const numericValue = parseFloat(cleaned.replace(',', '.')) || 0;
    onChangeText(numericValue);
  };

  return (
    <TextInput
      {...props}
      keyboardType="numeric"
      value={inputValue}
      onChangeText={handleChange}
      style={style}
      placeholder="0,00"
      placeholderTextColor="#888"
    />
  );
};

export default PriceInput;
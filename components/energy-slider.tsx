import { useState, useEffect } from 'react';

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function EnergySlider({ value, onChange }: EnergySliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-4 rounded-lg'>
      <label htmlFor='energy-intensity-slider' className='text-white mb-2 block'>
        Energy Intensity: {localValue.toFixed(2)}
      </label>
      <input
        id='energy-intensity-slider'
        type='range'
        min={0}
        max={2}
        step={0.01}
        value={localValue}
        title='Adjust energy intensity'
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          setLocalValue(v);
          onChange(v);
        }}
        className='w-64'
      />
    </div>
  );
}

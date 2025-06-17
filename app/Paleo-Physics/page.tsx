'use client';

import { useState } from 'react';
import EnergySystem from '@/components/energy-system';

export default function ImmersivePage() {
  const [intensity, setIntensity] = useState(0.7);
  const [weaponActive, setWeaponActive] = useState(false);

  return (
    <div className='w-full h-screen flex items-center justify-center bg-black'>
      <div className='max-w-3xl w-full'>
        <EnergySystem
          intensity={intensity}
          onIntensityChange={setIntensity}
          onActivate={() => setWeaponActive(true)}
        />
      </div>
    </div>
  );
}

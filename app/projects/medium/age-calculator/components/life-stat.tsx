'use client';

import { JSX } from 'react';

interface LifeStatProps {
  icon: string,
  bgColor: string,
  label: string,
  value: string
}

export const LifeStat = ({ icon, bgColor, label, value }: LifeStatProps): JSX.Element => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 ${bgColor} rounded-full flex-shrink-0 flex items-center justify-center`}>
      <span>{icon}</span>
    </div>
    <div>
      <p>{label}</p>
      <p className="text-xl text-blue-500 font-medium">{value}</p>
    </div>
  </div>
);
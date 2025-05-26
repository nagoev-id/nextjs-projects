'use client';

import { JSX } from 'react';

interface CalculatorDisplay {
  output: string;
}

const CalculatorDisplay = ({ output }: CalculatorDisplay): JSX.Element => (
  <div className="flex text-white bg-gray-500 justify-end rounded-sm">
    <span className="text-3xl font-medium p-3 max-w-[350px] overflow-x-auto">{output}</span>
  </div>
);

export default CalculatorDisplay;
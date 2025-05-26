'use client';

import { Button } from '@/components/ui';
import { JSX } from 'react';

interface DigitButtons {
  onDigitClick: (digit: string) => void;
}

const DigitButtons = ({ onDigitClick }: DigitButtons): JSX.Element => (
  <>
    {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((digit: number) => (
      <Button
        key={digit}
        className="text-xl font-medium"
        onClick={() => onDigitClick(digit.toString())}
        variant="secondary"
        aria-label={digit.toString()}
      >
        {digit}
      </Button>
    ))}
  </>
);

export default DigitButtons;
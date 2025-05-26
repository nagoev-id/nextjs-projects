'use client';

import { Button } from '@/components/ui';
import { JSX } from 'react';

type Operator = '+' | '-' | '*' | '/' | '=';

interface OperationButtons {
  onOperationClick: (op: Operator) => void;
}

const OperationButtons = ({ onOperationClick }: OperationButtons): JSX.Element => (
  <>
    {['+', '-', '*', '/'].map((op: string) => (
      <Button
        key={op}
        className="text-xl font-medium"
        onClick={() => onOperationClick(op as Operator)}
        aria-label={op === '*' ? 'multiply' : op === '/' ? 'divide' : op}
      >
        {op === '*' ? '×' : op === '/' ? '÷' : op}
      </Button>
    ))}
  </>
);

export default OperationButtons;
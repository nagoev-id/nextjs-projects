'use client';

import React, { ChangeEvent, JSX, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { ArrowLeftRight, ArrowUpDown } from 'lucide-react';

// Local imports
import { ASPECT_RATIOS, DEFAULT_VALUES, generateScaleOptions, INPUT_LIMITS, LeadType } from './constants';
import {
  calculateCoefficient,
  calculateDependentDimension,
  formatRatio,
  generateFormulaText,
  safeParseInt,
} from './utils';

/**
 * Enhanced custom hook for aspect ratio calculations with improved type safety and error handling
 * @returns Object containing state and methods for aspect ratio management
 */
const useAspectRatio = () => {
  // State initialization with constants
  const [a, setA] = useState<number>(DEFAULT_VALUES.WIDTH);
  const [b, setB] = useState<number>(DEFAULT_VALUES.HEIGHT);
  const [lead, setLead] = useState<LeadType>('c');
  const [c, setC] = useState<number>(DEFAULT_VALUES.NEW_WIDTH);
  const [x, setX] = useState<number>(DEFAULT_VALUES.NEW_HEIGHT);
  const [ratioIdx, setRatioIdx] = useState<number>(DEFAULT_VALUES.RATIO_INDEX);
  const [scale, setScale] = useState<number>(DEFAULT_VALUES.SCALE);

  // Memoized computations
  const ratio = useMemo(() => ASPECT_RATIOS[ratioIdx], [ratioIdx]);

  const coefficient = useMemo(() =>
      calculateCoefficient(lead, ratio, scale),
    [lead, ratio, scale],
  );

  // Enhanced input handlers with validation
  const handleLeadChange = useCallback((value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(value);

    const dependentValue = calculateDependentDimension(value, coefficient);

    if (lead === 'c') {
      setX(dependentValue);
    } else {
      setC(dependentValue);
    }
  }, [lead, coefficient]);

  // Event handlers with improved error handling
  const handleAChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = safeParseInt(e.target.value, a);
    setA(value);
  }, [a]);

  const handleBChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = safeParseInt(e.target.value, b);
    setB(value);
  }, [b]);

  const handleCChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = safeParseInt(e.target.value, c);
    handleLeadChange(value, setC);
  }, [handleLeadChange, c]);

  const handleXChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = safeParseInt(e.target.value, x);
    handleLeadChange(value, setX);
  }, [handleLeadChange, x]);

  const handleRatioChange = useCallback((value: string) => {
    const index = safeParseInt(value, ratioIdx);
    setRatioIdx(index);
  }, [ratioIdx]);

  const handleScaleChange = useCallback((value: string) => {
    const scaleValue = safeParseInt(value, scale);
    setScale(scaleValue);
  }, [scale]);

  // Focus handlers for lead dimension switching
  const handleCFocus = useCallback(() => setLead('c'), []);
  const handleXFocus = useCallback(() => setLead('x'), []);

  // Utility actions
  const swapAB = useCallback(() => {
    setA(b);
    setB(a);
  }, [a, b]);

  const toggleLead = useCallback(() => {
    setLead(prev => (prev === 'c' ? 'x' : 'c'));
  }, []);

  // Computed values
  const formulaText = useMemo(() =>
      generateFormulaText(lead, ratio, lead === 'c' ? c : x, lead === 'c' ? x : c, scale),
    [lead, ratio, c, x, scale],
  );

  const originalRatio = useMemo(() => formatRatio(a, b), [a, b]);
  const newRatio = useMemo(() => formatRatio(c, x), [c, x]);

  return {
    // State values
    dimensions: { a, b, c, x },
    lead,
    ratio,
    ratioIdx,
    scale,

    // Computed values
    formulaText,
    originalRatio,
    newRatio,

    // Event handlers
    handlers: {
      handleAChange,
      handleBChange,
      handleCChange,
      handleXChange,
      handleRatioChange,
      handleScaleChange,
      handleCFocus,
      handleXFocus,
      swapAB,
      toggleLead,
    },
  };
};

/**
 * Input field component for dimensions with consistent styling
 */
interface DimensionInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  isActive?: boolean;
  placeholder: string;
}

const DimensionInput = ({
                          id,
                          label,
                          value,
                          onChange,
                          onFocus,
                          isActive,
                          placeholder,
                        }: DimensionInputProps) => (
  <div className="grid gap-1">
    <Label htmlFor={id} className="font-medium">
      {label} {isActive && <span className="text-blue-400">●</span>}
    </Label>
    <Input
      id={id}
      type="number"
      min={INPUT_LIMITS.MIN}
      max={INPUT_LIMITS.MAX}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className={isActive ? 'ring-2 ring-blue-400/50' : ''}
      placeholder={placeholder}
    />
  </div>
);

/**
 * Results display component
 */
interface ResultsDisplayProps {
  title: string;
  width: number;
  height: number;
  ratio: string;
}

const ResultsDisplay = ({ title, width, height, ratio }: ResultsDisplayProps) => (
  <div className="border-2 p-2 rounded-md grid place-items-center text-center">
    <Label>{title}</Label>
    <p className="flex gap-1 items-center">
      {width} : {height}
      <span className="text-xs font-semibold">({ratio})</span>
    </p>
  </div>
);

/**
 * Main aspect ratio calculator component
 */
const AspectRatioPage = (): JSX.Element => {
  const {
    dimensions: { a, b, c, x },
    lead,
    ratioIdx,
    scale,
    formulaText,
    originalRatio,
    newRatio,
    handlers: {
      handleAChange,
      handleBChange,
      handleCChange,
      handleXChange,
      handleRatioChange,
      handleScaleChange,
      handleCFocus,
      handleXFocus,
      swapAB,
      toggleLead,
    },
  } = useAspectRatio();

  const scaleOptions = useMemo(() => generateScaleOptions(), []);

  return (
    <Card className="max-w-lg mx-auto w-full p-4 gap-3">
      {/* Original Size Section */}
      <div className="grid gap-3">
        <Label className="font-semibold">Original Size</Label>
        <div className="grid gap-3 md:grid-cols-[230px_1fr_auto] md:items-end">
          <Button
            onClick={swapAB}
            variant="outline"
            size="icon"
            className="w-full md:w-10 md:h-10 order-3 md:order-1"
            title="Swap dimensions"
            aria-label="Swap width and height values"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <DimensionInput
            id="width"
            label="Width"
            value={a}
            onChange={handleAChange}
            placeholder="Width"
          />

          <DimensionInput
            id="height"
            label="Height"
            value={b}
            onChange={handleBChange}
            placeholder="Height"
          />
        </div>
      </div>

      {/* New Size Section */}
      <div className="grid gap-3">
        <Label className="font-semibold">New Size</Label>
        <div className="grid gap-3 md:grid-cols-[230px_1fr_auto] md:items-end">
          <Button
            onClick={toggleLead}
            variant="outline"
            size="icon"
            className="w-full md:w-10 md:h-10 order-3 md:order-1"
            title="Toggle leading dimension"
            aria-label="Toggle which dimension leads the calculation"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <DimensionInput
            id="new-width"
            label="New Width"
            value={c}
            onChange={handleCChange}
            onFocus={handleCFocus}
            isActive={lead === 'c'}
            placeholder="New Width"
          />

          <DimensionInput
            id="new-height"
            label="New Height"
            value={x}
            onChange={handleXChange}
            onFocus={handleXFocus}
            isActive={lead === 'x'}
            placeholder="New Height"
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <Select value={ratioIdx.toString()} onValueChange={handleRatioChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((r, i) => (
                <SelectItem key={r.label} value={i.toString()}>
                  {r.label}
                  {r.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {r.description}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="scale">Scale</Label>
          <Select value={scale.toString()} onValueChange={handleScaleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scale" />
            </SelectTrigger>
            <SelectContent>
              {scaleOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Formula Display */}
      <div className="border-2 p-2 rounded-md grid place-items-center text-center bg-neutral-100 dark:bg-accent">
        <Label>Formula</Label>
        <p className="font-mono text-sm">{formulaText}</p>
      </div>

      {/* Results Summary */}
      <div className="grid gap-3 md:grid-cols-2">
        <ResultsDisplay
          title="Original Ratio"
          width={a}
          height={b}
          ratio={originalRatio}
        />
        <ResultsDisplay
          title="New Ratio"
          width={c}
          height={x}
          ratio={newRatio}
        />
      </div>
    </Card>
  );
};

export default AspectRatioPage;
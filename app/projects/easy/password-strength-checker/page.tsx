'use client';

import { Card } from '@/components/ui/card';
import { ChangeEvent, JSX, useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

type StrengthLevel = 'weak' | 'medium' | 'strong';

const strengthMap: Record<number, StrengthLevel> = {
  0: 'weak',
  1: 'weak',
  2: 'weak',
  3: 'medium',
  4: 'strong',
  5: 'strong',
};

// Color mapping for different strength levels
const strengthColorMap: Record<StrengthLevel, string> = {
  weak: 'bg-red-500 border-red-500',
  medium: 'bg-yellow-500 border-yellow-500',
  strong: 'bg-green-500 border-green-500',
};

const PasswordStrengthCheckerPage = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');

  const toggleVisibility = useCallback(() => setIsVisible(prev => !prev), []);

  const strength = useMemo((): StrengthLevel => {
    if (!inputPassword) return 'weak';

    const criteria: boolean[] = [
      inputPassword.length > 8,
      /[a-z]/.test(inputPassword),
      /[A-Z]/.test(inputPassword),
      /\d/.test(inputPassword),
      /[^A-Za-z0-9]/.test(inputPassword),
    ];
    const score = criteria.filter(Boolean).length;
    return strengthMap[score];
  }, [inputPassword]);

  // Calculate which bars should be filled based on strength
  const filledBars = useMemo(() => {
    switch (strength) {
      case 'weak': return 1;
      case 'medium': return 2;
      case 'strong': return 3;
      default: return 0;
    }
  }, [strength]);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  }, []);

  return (
    <Card className="max-w-md grid gap-3 w-full mx-auto p-4 rounded">
      <div className="relative">
        <Input
          type={isVisible ? 'text' : 'password'}
          placeholder="Type password"
          value={inputPassword}
          onChange={handlePasswordChange}
          aria-label="Password input"
          autoComplete="new-password"
        />
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2" 
          onClick={toggleVisibility}
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
        </button>
      </div>

      {inputPassword && (
        <div className="grid gap-2">
          <ul className="grid grid-cols-3 gap-2" role="meter" aria-valuemin={0} aria-valuemax={3} aria-valuenow={filledBars} aria-label="Password strength meter">
            {[...Array(3)].map((_, index) => (
              <li 
                key={index} 
                className={`h-2 border-2 transition-colors ${index < filledBars ? strengthColorMap[strength] : ''}`} 
                aria-hidden="true"
              />
            ))}
          </ul>
          <p className="text-center">
            Your password is <span className={`font-bold ${
              strength === 'weak' ? 'text-red-500' : 
              strength === 'medium' ? 'text-yellow-500' : 
              'text-green-500'
            }`}>{strength}</span>
          </p>
          
          {strength === 'weak' && (
            <p className="text-sm text-red-500 text-center">
              Try adding uppercase letters, numbers, and special characters.
            </p>
          )}
          {strength === 'medium' && (
            <p className="text-sm text-yellow-500 text-center">
              Good! Add more variety or length for a stronger password.
            </p>
          )}
          {strength === 'strong' && (
            <p className="text-sm text-green-500 text-center">
              Excellent! Your password is strong and secure.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PasswordStrengthCheckerPage;
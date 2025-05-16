'use client';

import { Button } from '@/components/ui/button';
import { MdOutlinePause, MdPlayArrow } from 'react-icons/md';

import { HELPERS } from '@/shared';

interface TimerBodyProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isCompleted?: boolean;
  handleControlButton: () => void;
  handleResetButton: () => void;
}

const TimerBody = ({
                     minutes,
                     seconds,
                     isRunning,
                     isCompleted,
                     handleControlButton,
                     handleResetButton,
                   }: TimerBodyProps) => {
  return (
    <div className="grid gap-3 place-items-center">
      <div className="font-bold text-3xl md:text-6xl flex" role="timer">
        {HELPERS.addLeadingZero(minutes)}:{HELPERS.addLeadingZero(seconds)}
      </div>

      {!isCompleted && (
        <Button
          onClick={handleControlButton}
        >
          {isRunning ? (
            <>
              <MdOutlinePause aria-hidden="true" size={20} />
              Pause
            </>
          ) : (
            <>
              <MdPlayArrow aria-hidden="true" size={20} />
              Start
            </>
          )}
        </Button>
      )}

      <Button
        variant="destructive"
        onClick={handleResetButton}
      >
        Reset Timer
      </Button>
    </div>
  );
};

export default TimerBody;
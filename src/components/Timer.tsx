import { Progress } from '@mantine/core';
import React from 'react';

interface TimerProps {
    color: string;
    initialDuration: number;
}

export const Timer = ({ color, initialDuration }: TimerProps) => {
    const minDuration = 1000;
    const lastResetDurationRef = React.useRef<number>(initialDuration);
    const timerRunningRef = React.useRef<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const [progressValue, setProgressValue] = React.useState<number>(100);

    const startCountdown = () => {
        if (timerRunningRef.current) {
            console.log('Wait');
            return;
        }
        console.log('Timer started');
        timerRunningRef.current = true;
        let remainingTime = lastResetDurationRef.current;
        const step = 50;
        intervalRef.current = setInterval(() => {
            remainingTime -= step;

            if (remainingTime <= 0) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
                console.log('Timer finished');
                setTimeout(() => {
                    timerRunningRef.current = false;
                    lastResetDurationRef.current = initialDuration;
                    setProgressValue(100);
                }, 100);
            } else {
                console.log(`Time left: ${remainingTime} milliseconds`);
                const progress = (remainingTime / initialDuration) * 100;
                setProgressValue(progress);
            }
        }, step);
    };

    const resetCountdown = () => {
        if (!timerRunningRef.current) {
            console.log('You need to start');
            return;
        }
        console.log('Reset');
        clearInterval(intervalRef.current as NodeJS.Timeout);
        timerRunningRef.current = false;
        lastResetDurationRef.current = Math.max(
            minDuration,
            lastResetDurationRef.current - 100
        );
        setProgressValue(100);
        startCountdown();
    };
    return <Progress radius="xs" color={color} value={progressValue} />;
};

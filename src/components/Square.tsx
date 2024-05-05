import React from 'react';
import { SquareType } from './types';
import classes from '../styles/square.module.css';
import { Box, Button } from '@mantine/core';

interface SquareProps {
    value: SquareType;
    onSquareClick: () => void;
    isOldest: boolean;
    gradient: {
        from: string;
        to: string;
        deg: number;
    };
    disabled: boolean;
}

export const Square = ({
    value,
    onSquareClick,
    isOldest,
    gradient,
    disabled,
}: SquareProps) => {
    return (
        <Box>
            <Button
                onClick={onSquareClick}
                className={`${classes.square} ${isOldest && classes.oldest}`}
                variant="gradient"
                gradient={gradient}
                disabled={disabled}
            >
                {value}
            </Button>
        </Box>
    );
};

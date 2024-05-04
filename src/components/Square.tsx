import React from 'react';
import { SquareType } from './types';

interface SquareProps {
    value: SquareType;
    onSquareClick: () => void;
    isOldest: boolean;
}

export const Square = ({ value, onSquareClick, isOldest }: SquareProps) => {
    return (
        <button
            className={'square'}
            onClick={onSquareClick}
            style={{ opacity: isOldest ? '.3' : '1' }}
        >
            {value}
        </button>
    );
};

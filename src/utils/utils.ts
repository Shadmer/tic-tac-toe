import { SquareType } from '../components/types';

export const getRandomColor = () => {
    const colors = [
        'gray',
        'red',
        'pink',
        'grape',
        'violet',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'green',
        'lime',
        'yellow',
        'orange',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const calculateWinner = (
    squares: SquareType[],
    setWinningCombination: React.Dispatch<React.SetStateAction<number[] | null>>
) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            setWinningCombination(lines[i]);
            return squares[a];
        }
    }
    return null;
};

export const calculateBotMove = (
    squares: SquareType[],
    moves: number[],
    isBotFirst: boolean,
    botLevel: number,
    setWinningCombination: React.Dispatch<React.SetStateAction<number[] | null>>
) => {
    const availableMoves: number[] = [];
    const botSymbol = isBotFirst ? 'x' : 'o';
    const humanSymbol = isBotFirst ? 'o' : 'x';
    const diagonalMoves = [0, 2, 6, 8];
    const availableDiagonalMoves = diagonalMoves.filter(
        (index) => squares[index] === null
    );

    if (botLevel > 3) {
        if (moves.length === 0) return 4;

        if (moves.length === 1 && squares[4] === null) return 4;

        if (moves.length === 1 && availableDiagonalMoves.length) {
            return availableDiagonalMoves[
                Math.floor(Math.random() * availableDiagonalMoves.length)
            ];
        }

        if (moves.length === 2 && availableDiagonalMoves.length === 4) {
            return availableDiagonalMoves[
                Math.floor(Math.random() * availableDiagonalMoves.length)
            ];
        }
    }

    if (botLevel > 1) {
        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const nextSquares = squares.slice();
                const nextBlinkingSquares = squares.slice();

                if (moves.length > 5) {
                    const oldestMove = moves[0];
                    nextBlinkingSquares[oldestMove] = null;
                }

                nextSquares[i] = botSymbol;
                nextBlinkingSquares[i] = botSymbol;

                const isStandardWin =
                    calculateWinner(nextSquares, setWinningCombination) ===
                    botSymbol;
                const isBlinkingWin =
                    calculateWinner(
                        nextBlinkingSquares,
                        setWinningCombination
                    ) === botSymbol;
                const isWin =
                    botLevel > 2
                        ? isStandardWin && isBlinkingWin
                        : isStandardWin;

                if (isWin) {
                    return i;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const nextSquares = squares.slice();
                const nextBlinkingSquares = squares.slice();

                if (moves.length > 5) {
                    const oldestMove = moves[0];
                    nextBlinkingSquares[oldestMove] = null;
                }
                nextSquares[i] = humanSymbol;
                nextBlinkingSquares[i] = humanSymbol;

                const isStandardLose =
                    calculateWinner(nextSquares, setWinningCombination) ===
                    humanSymbol;
                const isBlinkingLose =
                    calculateWinner(
                        nextBlinkingSquares,
                        setWinningCombination
                    ) === humanSymbol;
                const isLose =
                    botLevel > 2
                        ? isStandardLose && isBlinkingLose
                        : isStandardLose;

                if (isLose) {
                    return i;
                }
            }
        }
    }
    for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
            availableMoves.push(i);
        }
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

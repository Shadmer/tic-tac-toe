import React from 'react';
import { Square } from './Square';
import { SquareType } from './types';

export const Board = () => {
    const defaultSquares: SquareType[] = Array(9).fill(null);
    const [isBotGame, setIsBotGame] = React.useState(true);
    const [isBotTurn, setIsBotTurn] = React.useState(false);
    const [isBotFirst, setIsBotFirst] = React.useState(false);
    const [xIsNext, setXIsNext] = React.useState(true);
    const [squares, setSquares] = React.useState<SquareType[]>(defaultSquares);
    const [moves, setMoves] = React.useState<number[]>([]);

    const calculateWinner = React.useCallback((squares: SquareType[]) => {
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
                return squares[a];
            }
        }
        return null;
    }, []);
    const calculateBotMove = React.useCallback(() => {
        const availableMoves = [];

        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const nextSquares = squares.slice();
                nextSquares[i] = 'o';
                if (calculateWinner(nextSquares) === 'o') {
                    return i;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const nextSquares = squares.slice();
                nextSquares[i] = 'x';
                if (calculateWinner(nextSquares) === 'x') {
                    return i;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                availableMoves.push(i);
            }
        }
        return availableMoves[
            Math.floor(Math.random() * availableMoves.length)
        ];
    }, [squares, calculateWinner]);

    const oldestMove = React.useMemo(
        () => moves.length > 5 && moves[0],
        [moves]
    );
    const winner = React.useMemo(
        () => calculateWinner(squares),
        [calculateWinner, squares]
    );
    const status = React.useMemo(
        () =>
            winner
                ? `Победитель: ${winner}`
                : `Следующий ход: ${xIsNext ? 'X' : 'O'}`,
        [winner, xIsNext]
    );

    const makeMove = React.useCallback(
        (move: number) => {
            const nextSquares = squares.slice();
            const nextMoves = moves.slice();

            nextSquares[move] = xIsNext ? 'x' : 'o';
            nextMoves.push(move);

            if (nextMoves.length > 6) {
                const oldestMove = nextMoves.shift();
                nextSquares[oldestMove ?? -1] = null;
            }

            setSquares(nextSquares);
            setMoves(nextMoves);
            setXIsNext(!xIsNext);
        },
        [moves, squares, xIsNext]
    );
    const getBotMove = React.useCallback(async () => {
        if (winner) return;

        setIsBotTurn(true);

        const botMove = calculateBotMove();

        setTimeout(() => {
            makeMove(botMove);
            setIsBotTurn(false);
        }, 500);
    }, [calculateBotMove, makeMove, winner]);

    const handleSquareClick = (i: number) => {
        if (isBotTurn || squares[i] || calculateWinner(squares)) return;

        makeMove(i);

        if (isBotGame) setIsBotTurn(true);
    };
    const handleReset = () => {
        setSquares(defaultSquares);
        setXIsNext(true);
        setMoves([]);
        if (isBotFirst) setIsBotTurn(true);
    };
    const handleToggleGameMode = () => {
        setIsBotGame(!isBotGame);
    };
    const handleToggleFirstMove = () => {
        setIsBotFirst(!isBotFirst);
    };

    React.useEffect(() => {
        if (isBotTurn) {
            getBotMove();
        }
    }, [getBotMove, isBotTurn]);
    React.useEffect(() => {
        setIsBotTurn(isBotFirst);
    }, [isBotFirst]);

    return (
        <>
            <div className="status">
                <button onClick={handleReset}>Новая игра</button>
                <button onClick={handleToggleGameMode}>
                    {isBotGame ? 'Игра с человеком' : 'Игра с ботом'}
                </button>
                <button disabled={!isBotGame} onClick={handleToggleFirstMove}>
                    {isBotFirst ? 'Ходит человек первым' : 'Ходит бот первым'}
                </button>
            </div>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square
                    value={squares[0]}
                    onSquareClick={() => handleSquareClick(0)}
                    isOldest={oldestMove === 0}
                />
                <Square
                    value={squares[1]}
                    onSquareClick={() => handleSquareClick(1)}
                    isOldest={oldestMove === 1}
                />
                <Square
                    value={squares[2]}
                    onSquareClick={() => handleSquareClick(2)}
                    isOldest={oldestMove === 2}
                />
            </div>
            <div className="board-row">
                <Square
                    value={squares[3]}
                    onSquareClick={() => handleSquareClick(3)}
                    isOldest={oldestMove === 3}
                />
                <Square
                    value={squares[4]}
                    onSquareClick={() => handleSquareClick(4)}
                    isOldest={oldestMove === 4}
                />
                <Square
                    value={squares[5]}
                    onSquareClick={() => handleSquareClick(5)}
                    isOldest={oldestMove === 5}
                />
            </div>
            <div className="board-row">
                <Square
                    value={squares[6]}
                    onSquareClick={() => handleSquareClick(6)}
                    isOldest={oldestMove === 6}
                />
                <Square
                    value={squares[7]}
                    onSquareClick={() => handleSquareClick(7)}
                    isOldest={oldestMove === 7}
                />
                <Square
                    value={squares[8]}
                    onSquareClick={() => handleSquareClick(8)}
                    isOldest={oldestMove === 8}
                />
            </div>
        </>
    );
};

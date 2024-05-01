import React from 'react';

type SquareType = 'x' | 'o' | null;

interface SquareProps {
    value: SquareType;
    onSquareClick: () => void;
}

const App = () => {
    const Square = ({ value, onSquareClick }: SquareProps) => {
        return (
            <button className="square" onClick={onSquareClick}>
                {value}
            </button>
        );
    };

    const Board = () => {
        const defaultSquares: SquareType[] = Array(9).fill(null);
        const [xIsNext, setXIsNext] = React.useState(true);
        const [squares, setSquares] =
            React.useState<SquareType[]>(defaultSquares);

        const calculateWinner = (squares: SquareType[]) => {
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
        };

        const winner = React.useMemo(() => calculateWinner(squares), [squares]);
        const status = React.useMemo(
            () =>
                winner
                    ? `Победитель: ${winner}`
                    : `Следующий ход: ${xIsNext ? 'X' : 'O'}`,
            [winner, xIsNext]
        );

        const handleClick = (i: number) => {
            if (squares[i] || winner) return;

            const nextSquares = squares.slice();

            nextSquares[i] = xIsNext ? 'x' : 'o';
            setSquares(nextSquares);
            setXIsNext(!xIsNext);
        };

        const handleReset = () => {
            setSquares(defaultSquares);
            setXIsNext(true);
        };

        return (
            <>
                <div className="status">
                    <button onClick={handleReset}>Новая игра</button>
                </div>
                <div className="status">{status}</div>
                <div className="board-row">
                    <Square
                        value={squares[0]}
                        onSquareClick={() => handleClick(0)}
                    />
                    <Square
                        value={squares[1]}
                        onSquareClick={() => handleClick(1)}
                    />
                    <Square
                        value={squares[2]}
                        onSquareClick={() => handleClick(2)}
                    />
                </div>
                <div className="board-row">
                    <Square
                        value={squares[3]}
                        onSquareClick={() => handleClick(3)}
                    />
                    <Square
                        value={squares[4]}
                        onSquareClick={() => handleClick(4)}
                    />
                    <Square
                        value={squares[5]}
                        onSquareClick={() => handleClick(5)}
                    />
                </div>
                <div className="board-row">
                    <Square
                        value={squares[6]}
                        onSquareClick={() => handleClick(6)}
                    />
                    <Square
                        value={squares[7]}
                        onSquareClick={() => handleClick(7)}
                    />
                    <Square
                        value={squares[8]}
                        onSquareClick={() => handleClick(8)}
                    />
                </div>
            </>
        );
    };

    return <Board />;
};

export default App;

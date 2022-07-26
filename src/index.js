// TODO: https://reactjs.org/tutorial/tutorial.html#showing-the-past-moves

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// refactored into function component
// class Square extends React.Component {
//     render() {
//         return (
//             // pass fxn to onClick
//         <button 
//             className="square" 
//             // when square is clicked, do parent's onClick fxn
//             onClick={() => this.props.onClick()}
//         >
//             {this.props.value}
//         </button>
//         );
//     }
// }

// function component
function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

// Board is parent of all squares
class Board extends React.Component {
    // state lifted up to Game component
    // board's state purpose: so child components can communicate
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    // lifted up to Game
    // handleClick(i) {
    //     // slice to make copy of array, don't modify orig array
    //     const squares = this.state.squares.slice();
    //     // if gameover or a square is already clicked, ignore the new click
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    // }

    renderSquare(i) {
        // can use onClick when calling component, instead of putting onClick in Square class
        return <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        // lifted up to Game
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }

        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    // Game's state purpose: so child components can communicate
    constructor(props) {
        super(props);
        this.state = {
            // history allows for undo
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            location: {
                x: null,
                y: null,
            },
        };
    }

    handleClick(i) {
        // remove all future moves
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        const current = history[history.length -1];
        // slice to make copy of array, don't modify orig array
        const squares = current.squares.slice();
        // if gameover or a square is already clicked, ignore the new click
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        console.log('i: ' + i);
        this.setState({
            // push mutates array, so use concat here
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            location: this.getCoordinates(i),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getCoordinates(square) {
        const x = (Math.floor(square / 3) + 1 );
        const y = (square % 3) + 1;
        return {
            x: x, 
            y: y,
        };
    }

    render() {
        // most recent history is game's status
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // show past moves
        // map syntax: map((element, index) => { /* … */ })
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            console.log(this.state.location.x);
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <p>location: ({this.state.location.x}, {this.state.location.y})</p>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

// declares winner
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a];
    }
}
return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

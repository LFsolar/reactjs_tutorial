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
    // board's state purpose: so child components can communicate
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        // slice to make copy of array, don't modify orig array
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
        // can use onClick when calling component, instead of putting onClick in Square class
        return <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}/>;
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
        <div>
            <div className="status">{status}</div>
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
render() {
    return (
    <div className="game">
        <div className="game-board">
        <Board />
        </div>
        <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
        </div>
    </div>
    );
}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

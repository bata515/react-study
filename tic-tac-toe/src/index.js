
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Squareコンポーネントは、一つのマス目を表します。
// propsとしてvalue (X, O, または null) と onClickイベントハンドラを受け取ります。
function Square(props) {
  return (
    // button要素としてレンダリングされます。
    // クリックされたときに、propsとして渡されたonClick関数を呼び出します。
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Boardコンポーネントは、9つのマス目を持つゲーム盤を表します。
class Board extends React.Component {
  // renderSquareメソッドは、指定されたインデックスのSquareコンポーネントをレンダリングします。
  // propsとして現在のマス目の値(this.props.squares[i])と、
  // クリックされたときに呼び出す関数(this.props.onClick(i))を渡します。
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {/* 3x3のゲーム盤をレンダリングします。 */}
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

// Gameコンポーネントは、ゲーム全体の状態を管理します。
class Game extends React.Component {
  // constructorで、コンポーネントの状態(state)を初期化します。
  constructor(props) {
    super(props);
    this.state = {
      // historyは、ゲームの各ターンの状態を配列として保持します。
      history: [{
        squares: Array(9).fill(null), // 9つのマス目をnullで初期化
      }],
      stepNumber: 0, // 現在のステップ番号
      xIsNext: true, // 次のプレイヤーがXかどうか
    };
  }

  // handleClickメソッドは、マス目がクリックされたときに呼び出されます。
  handleClick(i) {
    // 現在の履歴を取得します。
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // squares配列のコピーを作成します。
    const squares = current.squares.slice();
    // すでに勝者がいる場合、またはマス目がすでに埋まっている場合は、何もしません。
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // マス目にXまたはOを設定します。
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // 新しい状態をセットします。
    this.setState({
      // 新しい履歴をhistoryに追加します。
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      // プレイヤーを交代します。
      xIsNext: !this.state.xIsNext,
    });
  }

  // jumpToメソッドは、指定されたステップに移動します。
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // ステップ番号が偶数ならXの番
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 過去の手番に移動するためのボタンリストを作成します。
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
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
          {/* Boardコンポーネントをレンダリングします。 */}
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

// ========================================

// ReactDOM.createRootを使用して、アプリケーションをレンダリングします。
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// calculateWinner関数は、勝者を判定します。
function calculateWinner(squares) {
  // 勝利の組み合わせを定義します。
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
  // 勝利の組み合わせをチェックします。
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // 勝者がいない場合はnullを返します。
  return null;
}

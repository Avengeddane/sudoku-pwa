const boardEl = document.getElementById("board");
const noteBtn = document.getElementById("noteToggle");
const undoBtn = document.getElementById("undo");
const darkBtn = document.getElementById("darkToggle");

let selected = null;
let noteMode = false;
let undoStack = [];

const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

let board = JSON.parse(localStorage.getItem("board")) || [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

let notes = JSON.parse(localStorage.getItem("notes")) ||
  Array.from({length:9},()=>Array.from({length:9},()=>[]));

const fixed = board.map((r,i)=>r.map((v,j)=>solution[i][j]===v && v!==0));

noteBtn.onclick = () => noteMode = !noteMode;
undoBtn.onclick = () => {
  if (!undoStack.length) return;
  const state = undoStack.pop();
  board = state.board;
  notes = state.notes;
  render();
};

darkBtn.onclick = () => {
  document.body.classList.toggle("dark");
};

function save() {
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function render() {
  boardEl.innerHTML = "";
  save();

  for (let r=0;r<9;r++) {
    for (let c=0;c<9;c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row=r; cell.dataset.col=c;

      if (selected && selected[0]===r && selected[1]===c)
        cell.classList.add("selected");

      if (selected && board[r][c] &&
          board[r][c]===board[selected[0]][selected[1]])
        cell.classList.add("same");

      if (board[r][c] && board[r][c]!==solution[r][c])
        cell.classList.add("error");

      if (board[r][c]) {
        const v=document.createElement("div");
        v.className="value";
        v.textContent=board[r][c];
        cell.appendChild(v);
      } else if (notes[r][c].length) {
        const n=document.createElement("div");
        n.className="notes";
        for(let i=1;i<=9;i++){
          const s=document.createElement("span");
          s.textContent=notes[r][c].includes(i)?i:"";
          n.appendChild(s);
        }
        cell.appendChild(n);
      }

      cell.onclick=()=>{selected=[r,c];render();};
      boardEl.appendChild(cell);
    }
  }
}

document.querySelectorAll("#numbers button").forEach((b,i)=>{
  b.onclick=()=>{
    if(!selected) return;
    const [r,c]=selected;
    undoStack.push({
      board: JSON.parse(JSON.stringify(board)),
      notes: JSON.parse(JSON.stringify(notes))
    });

    const num=i+1;
    if(noteMode){
      notes[r][c]=notes[r][c].includes(num)
        ? notes[r][c].filter(n=>n!==num)
        : [...notes[r][c],num];
    } else {
      board[r][c]=num;
      notes[r][c]=[];
      for(let k=0;k<9;k++){
        notes[r][k]=notes[r][k].filter(n=>n!==num);
        notes[k][c]=notes[k][c].filter(n=>n!==num);
      }
    }
    render();
  };
});

render();

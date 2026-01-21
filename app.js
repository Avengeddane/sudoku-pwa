const boardEl = document.getElementById("board");
const noteBtn = document.getElementById("noteToggle");

let selected = null;
let noteMode = false;

const board = [
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

const fixed = board.map(r => r.map(v => v !== 0));
const notes = Array.from({ length: 9 }, () =>
  Array.from({ length: 9 }, () => new Set())
);

noteBtn.onclick = () => {
  noteMode = !noteMode;
  noteBtn.classList.toggle("active", noteMode);
};

function render() {
  boardEl.innerHTML = "";

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (fixed[r][c]) cell.classList.add("fixed");
      if (selected && selected[0] === r && selected[1] === c)
        cell.classList.add("selected");

      if (board[r][c] !== 0) {
        const val = document.createElement("div");
        val.className = "value";
        val.textContent = board[r][c];
        cell.appendChild(val);
      } else if (notes[r][c].size > 0) {
        const notesEl = document.createElement("div");
        notesEl.className = "notes";
        for (let i = 1; i <= 9; i++) {
          const span = document.createElement("span");
          span.textContent = notes[r][c].has(i) ? i : "";
          notesEl.appendChild(span);
        }
        cell.appendChild(notesEl);
      }

      cell.onclick = () => {
        selected = [r, c];
        render();
      };

      boardEl.appendChild(cell);
    }
  }
}

document.querySelectorAll("#numbers button").forEach((btn, i) => {
  btn.onclick = () => {
    if (!selected) return;
    const [r, c] = selected;
    const num = i + 1;

    if (fixed[r][c]) return;

    if (noteMode) {
      if (notes[r][c].has(num)) {
        notes[r][c].delete(num);
      } else {
        notes[r][c].add(num);
      }
    } else {
      board[r][c] = num;
      notes[r][c].clear();
    }
    render();
  };
});

render();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

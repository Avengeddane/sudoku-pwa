const boardEl = document.getElementById("board");
let selected = null;

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

function render() {
  boardEl.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((val, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (fixed[r][c]) cell.classList.add("fixed");
      if (selected && selected[0] === r && selected[1] === c)
        cell.classList.add("selected");

      cell.textContent = val === 0 ? "" : val;
      cell.onclick = () => selected = [r, c], render();
      boardEl.appendChild(cell);
    });
  });
}

document.querySelectorAll("#numbers button").forEach((btn, i) => {
  btn.onclick = () => {
    if (!selected) return;
    const [r, c] = selected;
    if (!fixed[r][c]) {
      board[r][c] = i + 1;
      render();
    }
  };
});

render();

// Service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

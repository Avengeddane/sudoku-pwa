function render() {
  boardEl.innerHTML = "";
  save();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (selected && selected[0] === r && selected[1] === c)
        cell.classList.add("selected");

      // Highlight samme tal
      if (selected && board[r][c] && board[r][c] === board[selected[0]][selected[1]])
        cell.classList.add("same");

      // Starttal (givne) er bold
      if (fixed[r][c]) {
        cell.classList.add("fixed");
      } else if (board[r][c] !== 0) {
        // Indtastet tal
        if (board[r][c] === solution[r][c]) {
          cell.classList.add("correct");
        } else {
          cell.classList.add("error"); // rød for fejl
        }
      }

      if (board[r][c]) {
        const val = document.createElement("div");
        val.className = "value";
        val.textContent = board[r][c];
        cell.appendChild(val);
      } else if (notes[r][c].length) {
        const notesEl = document.createElement("div");
        notesEl.className = "notes";
        for (let i = 1; i <= 9; i++) {
          const span = document.createElement("span");
          span.textContent = notes[r][c].includes(i) ? i : "";
          notesEl.appendChild(span);
        }
        cell.appendChild(notesEl);
      }

      cell.onclick = () => { selected = [r, c]; render(); };
      boardEl.appendChild(cell);
    }
  }
}

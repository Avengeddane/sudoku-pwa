const boardEl = document.getElementById("board");
const noteBtn = document.getElementById("noteToggle");
const undoBtn = document.getElementById("undo");
const darkBtn = document.getElementById("darkToggle");

let selected = null;
let noteMode = false;
let undoStack = [];

// Løsning
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

// Board og noter
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

// Gem
function save(){
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Build board én gang med input felter
function buildBoard(){
  boardEl.innerHTML="";
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const input = document.createElement("input");
      input.type="text";
      input.maxLength=1;
      input.dataset.row=r;
      input.dataset.col=c;
      input.className="cell";

      // Tykke 3x3 linjer via CSS
      if(c%3===0) input.style.borderLeftWidth="3px";
      if(c===8) input.style.borderRightWidth="3px";
      if(r%3===0) input.style.borderTopWidth="3px";
      if(r===8) input.style.borderBottomWidth="3px";

      if(fixed[r][c]){
        input.value = board[r][c];
        input.disabled = true;
        input.classList.add("fixed");
      }

      // Input event for øjeblikkelig fejl
      input.addEventListener("input", ()=>{
        let val = parseInt(input.value);
        if(isNaN(val) || val<1 || val>9) val="";
        input.value = val;

        // Gem gamle værdier til undo
        undoStack.push({
          board: JSON.parse(JSON.stringify(board)),
          notes: JSON.parse(JSON.stringify(notes))
        });

        board[r][c] = val || 0;
        notes[r][c] = [];

        // Fjern noter i række, kolonne og boks
        if(val){
          for(let k=0;k<9;k++){
            notes[r][k] = notes[r][k].filter(n=>n!==val);
            notes[k][c] = notes[k][c].filter(n=>n!==val);
          }
          const br = 3*Math.floor(r/3), bc=3*Math.floor(c/3);
          for(let i=0;i<3;i++)
            for(let j=0;j<3;j++)
              notes[br+i][bc+j] = notes[br+i][bc+j].filter(n=>n!==val);
        }

        // Øjeblikkelig korrekt/fejl markering
        input.classList.remove("correct","error");
        if(val){
          if(val===solution[r][c]) input.classList.add("correct");
          else input.classList.add("error");
        }
      });

      boardEl.appendChild(input);
    }
  }
}

// Knapper
noteBtn.onclick = ()=>{ noteMode=!noteMode; noteBtn.classList.toggle("active", noteMode); };
undoBtn.onclick = ()=>{
  if(!undoStack.length) return;
  const state = undoStack.pop();
  board = state.board;
  notes = state.notes;
  buildBoard(); // rebuild for simplicity
};
darkBtn.onclick = ()=>document.body.classList.toggle("dark");

// Tal-knapper
document.querySelectorAll("#numbers button").forEach((b,i)=>{
  b.onclick=()=>{
    const val = i+1;
    if(!selected) return;
    const input = boardEl.children[selected[0]*9 + selected[1]];
    input.value = val;
    input.dispatchEvent(new Event("input"));
    input.focus();
  };
});

// Klik for selection
boardEl.addEventListener("click", e=>{
  if(e.target.tagName==="INPUT") selected=[parseInt(e.target.dataset.row),parseInt(e.target.dataset.col)];
});

// Init
buildBoard();

// Service Worker PWA
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeHandler = document.querySelector("#size-handler");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.getElementById("color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImage = document.querySelector(".save-image");

let ctx = canvas.getContext("2d");
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = "#000";
let prevMouseX, prevMouseY, snapshot;


const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // if fillColor isn't checked draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); //creating new path to draw circle
  //getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  ctx.closePath(); //closing path of a triangle so the third line draw automatically
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawing = (e) => {
  if (!isDrawing) return; //if isDrawing is false return from here
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // create line according to the mouse pointer
    ctx.stroke(); //drawing / filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

const startDrawing = (e) => {
  prevMouseX = e.offsetX; //passing current mousex position as prevMouseX value
  prevMouseY = e.offsetY; //passing current mousey position as prevMouseY value
  isDrawing = true;
  ctx.beginPath(); // create new path to draw
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor; // passing selected color as stroke style
  ctx.fillStyle = selectedColor; // passing selected color as fill style
  //copying canvas data & passing as snapshot value.. this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const stopDrawing = () => {
  isDrawing = false;
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.id;
    //removing active class from previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
  });
});

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    let color = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = color;
  });
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mouseup", stopDrawing);
sizeHandler.addEventListener("change", () => (brushWidth = sizeHandler.value));

colorPicker.addEventListener("change", () => {
  //passing picked color value from color picker to last color btn background
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
  setCanvasBackground();
});

saveImage.addEventListener("click", () => {
  let url = canvas.toDataURL();
  let link = document.createElement("a");
  link.href = url;
  link.download = `${Date.now()}.jpg`;
  link.click();
});

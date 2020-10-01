let img;
let input;
function setup() {
  createCanvas(400, 300);
  img = loadImage("assets/logo.png");
  input = createFileInput(handleFile);
}
// const fileSelector = document.getElementById("file-selector");
// fileSelector.addEventListener("change", (event) => {
//   img = document.querySelector("#tp");
//   const file = event.target.files[0];
//   let src = URL.createObjectURL(file);
//   img.src = src;
//   //   img = loadImage(src);
// });

function handleFile(file) {
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.elt.id = "temp-img";
    setTimeout(() => {
      resizeCanvas(height * (img.width / img.height), height);
    }, 50);
    // img.hide();
  } else {
    img = null;
  }
}

function draw() {
  background(220);
  image(img, 0, 0, height * (img.width / img.height), height);
}

function asb() {
  document.querySelectorAll("#temp-img").src = document
    .querySelector("canvas")
    .toDataURL();
}

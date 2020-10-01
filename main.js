// let badger = new Badger({ id: "container" });
// badger.init();
let model;
var canvas = document.getElementById("canvas");
let frame = document.getElementById("frame");
var ctx = canvas.getContext("2d");
let status = document.querySelector("p");
let Im;
let img;
async function load() {
  model = await blazeface.load();
  status.innerHTML = "Model Loaded";
  const fileSelector = document.getElementById("file-selector");
  fileSelector.addEventListener("change", (event) => {
    img = document.querySelector("#tp");
    const file = event.target.files[0];
    let src = URL.createObjectURL(file);
    img.src = src;

    Im = new Image();
    Im.onload = () => {
      ctx.drawImage(
        Im,
        0,
        0,
        canvas.width,
        canvas.width * (Im.height / Im.width)
      );
      img.src = canvas.toDataURL();
      status.innerHTML = "Image Loaded";
      setTimeout(() => {
        run();
      }, 500);
    };
    Im.src = src;
  });
}

async function run() {
  let res = await model.estimateFaces(document.getElementById("tp"), false);
  res = res[0];

  //   res.landmarks.forEach((pos) => {
  //     ctx.beginPath();
  //     ctx.arc(pos[0], pos[1], 10, 0, Math.PI * 2);
  //     ctx.fillStyle = "red";
  //     ctx.fill();
  //   });

  let faceCenterX = (res.topLeft[0] + res.bottomRight[0]) / 2;
  let faceCenterY = (res.topLeft[1] + res.bottomRight[1]) / 2;

  let width = res.bottomRight[0] - res.topLeft[0];
  let height = res.bottomRight[1] - res.topLeft[1];

  console.log(width * height);
  status.innerHTML = "Adjusting";
  let deltaX = canvas.width / 2 - faceCenterX;
  let deltaY = canvas.height / 2 - faceCenterY;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    Im,
    deltaX,
    deltaY,
    canvas.width,
    canvas.width * (Im.height / Im.width)
  );
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height * 1.05);
  status.innerHTML = "Done";
}

load();

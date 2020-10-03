// let badger = new Badger({ id: "container" });
// badger.init();
let model;
var canvas = document.getElementById("canvas");
let frame = document.getElementById("frame");
var ctx = canvas.getContext("2d");
let status = document.querySelector("p");
let heightSlider = document.querySelector("#heightSlider");
let widthSlider = document.querySelector("#widthSlider");
let Im;
let img;
let deltaX, deltaY;
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

		// weird

		// Im = new Image();
		// Im.onload = function () {
		//   // set size proportional to image
		//   canvas.height = canvas.width * (Im.height / Im.width);

		//   // step 1 - resize to 50%
		//   var oc = document.createElement("canvas"),
		//     octx = oc.getContext("2d");

		//   oc.width = Im.width * 0.5;
		//   oc.height = Im.height * 0.5;
		//   octx.drawImage(Im, 0, 0, oc.width, oc.height);

		//   // step 2
		//   octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

		//   // step 3, resize to final size
		//   ctx.drawImage(
		//     oc,
		//     0,
		//     0,
		//     oc.width * 0.5,
		//     oc.height * 0.5,
		//     0,
		//     0,
		//     canvas.width,
		//     canvas.height
		//   );
		//   img.src = canvas.toDataURL();
		//   status.innerHTML = "Image Loaded";
		//   setTimeout(() => {
		//     run();
		//   }, 500);
		// };
		// Im.src = src;
	});
}

async function run() {
	let res = await model.estimateFaces(document.getElementById("tp"), false);

	if (res.length == 0) {
		status.innerHTML = "Can't find Your Face";
		document.getElementById("manual-button").style.display = "block";
	}

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
	deltaX = canvas.width / 2 - faceCenterX;
	deltaY = canvas.height / 2 - faceCenterY;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.drawImage(bg, 0, 0, canvas.width, canvas.height * 1.05);
	ctx.drawImage(
		Im,
		deltaX,
		deltaY,
		canvas.width,
		canvas.width * (Im.height / Im.width)
	);
	ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
	status.innerHTML = "Done";
	document.getElementById("manual-button").style.display = "block";
}

load();

function manual() {
	heightSlider.style.display = "block";
	widthSlider.style.display = "block";
	render();
}

heightSlider.oninput = function () {
	dY = parseFloat(this.value);
	deltaY = dY;
};
widthSlider.oninput = function () {
	dX = parseFloat(this.value);
	deltaX = dX;
};

function render() {
	requestAnimationFrame(render);
	ctx.drawImage(
		Im,
		deltaX,
		deltaY,
		canvas.width,
		canvas.width * (Im.height / Im.width)
	);
	// console.log(deltaX, deltaY);
	ctx.drawImage(frame, 0, 0, canvas.width, canvas.height * 1.05);
	setTimeout(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}, 100);
}

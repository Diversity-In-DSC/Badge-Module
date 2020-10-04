import React, { useState } from "react";
import "@tensorflow/tfjs-backend-cpu";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const blazeface = require("@tensorflow-models/blazeface");

const BadgeModule = () => {
  const [status, setStatus] = useState("Loading Model");
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState(null);
  const [image, setImage] = useState(null);
  let model;

  load();

  async function load() {
    model = await blazeface.load();
    setStatus("Model Loaded");
    setLoaded(true);
  }

  function handleFile(e) {
    setFile(URL.createObjectURL(e.target.files[0]));

    setTimeout(() => {
      run();
    }, 100);
  }

  async function run() {
    let results = await model.estimateFaces(
      document.querySelector("#temp-image"),
      false
    );
    let result = results[0];
    let x = parseFloat(result.topLeft[0]) - 50;
    let y = parseFloat(result.topLeft[1]) - 50;
    console.log(x, y);
    setCrop({
      x: x,
      y: y,
      aspect: 1,
      width: 200,
      height: 200,
    });

    setReady(true);
    console.log(result);
  }

  const getCroppedImg = () => {
    setReady(false);
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As Base64 string
    setFile(canvas.toDataURL("image/jpeg"));

    // As a blob
  };

  return (
    <center>
      <h4>Status : {status}</h4>

      {loaded && <input type="file" accept="image/*" onChange={handleFile} />}
      {ready && (
        <div>
          <div style={{ maxWidth: "400px", width: "80vw" }}>
            <ReactCrop
              onImageLoaded={setImage}
              src={file}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
            />
          </div>
          <button onClick={getCroppedImg}>Crop</button>
        </div>
      )}
      {file && (
        <img
          src={file}
          alt="temp"
          id="temp-image"
          style={{
            maxWidth: "400px",
            width: "80vw",
            opacity: 0,
            position: "absolute",
            zIndex: "-1",
            PointerEvent: "none",
          }}
        />
      )}
    </center>
  );
};

export default BadgeModule;

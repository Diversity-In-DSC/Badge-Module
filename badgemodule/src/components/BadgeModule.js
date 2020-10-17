import React, { useState } from "react";
import "@tensorflow/tfjs-backend-cpu";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import frame from "../Attendee-at-light.png";

const blazeface = require("@tensorflow-models/blazeface");

const BadgeModule = () => {
  const [status, setStatus] = useState("Loading Model");
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(null);
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
    if (results[0])
    {
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
    }
    else {
      alert("Can't detect your face")
      setCrop({
        x: 0,
        y: 0,
        aspect: 1,
        width: 200,
        height: 200,
      });

      setReady(true);
    }
   
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
    setReady(false);

    let badge = document.getElementById("badge");
    let badgectx = badge.getContext("2d");
    let frame = document.getElementById("frame");

    let img = new Image();

    img.onload = () => {
      badgectx.drawImage(img, 0, 0,badge.width, badge.height);
      badgectx.drawImage(frame, 0, 0, badge.width, badge.height);
      setSuccess(badge.toDataURL("image/jpeg"))
    };
    img.src = canvas.toDataURL("image/jpeg");

  };

  return (
    <center>
      <h4>Status : {status}</h4>

      <canvas id="badge" width="627" height="627"></canvas>

      {loaded && <input type="file" accept="image/*" onChange={handleFile} />}
      {ready && (
        <div>
          <div style={{ maxWidth: "450px", width: "80vw" }}>
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
      {success && <a download="myBadge.jpg" href={success}>Download</a>}
      {file && (
        <img
          src={file}
          alt="temp"
          id="temp-image"
          style={{
            maxWidth: "450px",
            width: "80vw",
            opacity: 0,
            position: "absolute",
            zIndex: "-1",
            PointerEvent: "none",
          }}
        />
      )}
      <img src={frame} id="frame" alt="" hidden />
    </center>
  );
};

export default BadgeModule;

import React, { useState } from "react";
import "@tensorflow/tfjs-backend-cpu";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import frame from "../Attendee-at-light.png";
import dumb_face from "../dumb-face.png";

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
    
    
    if (!loaded) {
      
      let badge = document.getElementById("badge");
      let badgectx = badge.getContext("2d");
      let frame = document.getElementById("frame");
      let dumb_face = document.getElementById("dumb-face");
      badgectx.drawImage(dumb_face, 0, 0, badge.width, badge.height);
      badgectx.drawImage(frame, 0, 0, badge.width, badge.height);
    }
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
      badgectx.clearRect(0, 0, canvas.width, canvas.height);
      badgectx.drawImage(img, 0, 0,badge.width, badge.height);
      badgectx.drawImage(frame, 0, 0, badge.width, badge.height);
      setSuccess(badge.toDataURL("image/jpeg"))
    };
    img.src = canvas.toDataURL("image/jpeg");

  };

  function uploadImage() {
    document.querySelector("input.profile-input").click();
  }

  return (
    <>
      <header>DSC WOW</header>

      <div className="main-container">
        <div className="input-panel">

          <div class="input">
            <label>Profile Picture</label>
            <button className="button" onClick={uploadImage}>Upload Image</button>
            {loaded && <input type="file" accept="image/*" onChange={handleFile} className="profile-input" hidden />}
          </div>


          <h4>Status : {status}</h4>
          <h5>
            An AI Powered Badge Maker to automatically suggest crop region depending on the face location. <br/> <br />
            Powered by Tensorflow.js <br /> <br />
            Build with ❤️ by DSC WOW

          </h5>
          
        </div>

        <div class="preview-panel">     

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
              <button onClick={getCroppedImg} className="button">Crop</button>
            </div>
          )}
          
          <canvas id="badge" width="500" height="500"></canvas>
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
          <img src={dumb_face} id="dumb-face" alt="" hidden />
          

          {success && <div class="download-fab">
            <a download="myBadge.jpg" href={success}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"></path>
              </svg>
              </a>
          </div>}

          
      </div>


      </div>





    
    </>
  );
};

export default BadgeModule;

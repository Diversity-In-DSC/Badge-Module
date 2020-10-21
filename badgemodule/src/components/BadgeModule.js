import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@tensorflow/tfjs-backend-cpu";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import frame from "../frame-light.png";
import dumb_face from "../dumb-face.png";
import logo from "../logo.png"

const blazeface = require("@tensorflow-models/blazeface");

const BadgeModule = () => {
  const [status, setStatus] = useState("Loading Model");
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [canvasDim, setCanvasDim] = useState({width:1000,height:1000});
  let model;
  load();

  async function load() {
    
    model = await blazeface.load();
    setStatus("Model Loaded");

    const style = 'font-weight: bold; font-size: 30px;color: yellow; text-shadow: 3px 3px 0 rgb(217,31,38) ;padding : 50px ';

    console.log('%c Hi You have found an easter egg 🥚, now find a way to report this to us!', style);
        
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
    let img = document.querySelector("#temp-image")
  
    if (img.naturalWidth < 500 || img.naturalHeight < 500)
    {     
      toast.warn("Low resolution image, resizing badge to low dimensions")
      setCanvasDim({width:img.naturalWidth,height:img.naturalWidth})
     
      }
    let results = await model.estimateFaces(
      img,
      false
    );
    if (results[0])
    {
      toast.success("shinning like a star ⭐")
      let result = results[0];
      let x = parseFloat(result.topLeft[0]) - 50;
      let y = parseFloat(result.topLeft[1]) - 50;
      // console.log(x, y);
      setCrop({
        x: x,
        y: y,
        aspect: 1,
        width: 300,
        height: 300,
      });

      setReady(true);
    }
    else {
      toast.warn("Can't detect your face 😞")
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
    setShowLoader(false)
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

    toast.success("psst, you can download badge from here ", { position: "bottom-right",autoClose: 3000 })
  };

  function uploadImage() {
    setShowLoader(true)
    document.querySelector("input.profile-input").click();
  }

  return (
    <>
         <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
      <header>DSC WOW Badge Maker</header>

      <div className="main-container">
        
        <div className="input-panel">

          <div className="input">
            <label>Profile Picture</label>
            <span>
            <button className="button" onClick={uploadImage}>Upload Image</button>
              {showLoader && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
            </span>
            {loaded && <input type="file" accept="image/*" onChange={handleFile} className="profile-input" hidden />}
            {/* <h4>Status : {status}</h4> */}
            <h5>
              An AI Powered Badge Maker to automatically suggest crop region depending on the face location. <br/> <br />
              Powered by Tensorflow.js <br /> <br />
              Build with ❤️ by DSC WOW Team

            </h5>
          </div>

          <img src={logo} className="logo" alt="DSC WOW Logo"/>
          
        </div>

        <div className="preview-panel">     
     
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

          <canvas id="badge" width={canvasDim.width} height={canvasDim.height}></canvas>
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
          

          {success && 
            <a download="myBadge.jpg" href={success}>
            <div className="download-fab">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"></path>
            </svg>
            </div>
            </a>
          }

          
      </div>
      </div>
    </>
  );
};

export default BadgeModule;

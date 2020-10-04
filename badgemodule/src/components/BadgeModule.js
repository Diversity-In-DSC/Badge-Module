import React from "react";
import "@tensorflow/tfjs-backend-cpu";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const blazeface = require("@tensorflow-models/blazeface");

class BadgeModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: null,
      status: "Loading Model",
      loaded: false,
      file: null,
      ready: false,
      crop: null,
    };
  }

  componentDidMount = async () => {
    let model = await blazeface.load();

    this.setState({ status: "Model Loaded", loaded: true, model: model });
  };

  handleFile = (e) => {
    this.setState({ file: URL.createObjectURL(e.target.files[0]) });
    setTimeout(() => {
      this.run();
    }, 100);
  };

  run = async () => {
    let results = await this.state.model.estimateFaces(
      document.querySelector("#temp-image"),
      false
    );
    let result = results[0];
    let x = parseFloat(result.topLeft[0]) - 50;
    let y = parseFloat(result.topLeft[1]) - 50;
    console.log(x, y);
    this.setState({
      crop: {
        x: x,
        y: y,
        aspect: 1,
        width: 200,
        height: 200,
      },
      ready: true,
    });
    console.log(result);
  };

  render = () => {
    return (
      <center>
        <h4>Status : {this.state.status}</h4>
        {this.state.file && (
          <img
            src={this.state.file}
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
        {this.state.loaded && (
          <input type="file" accept="image/*" onChange={this.handleFile} />
        )}
        {this.state.ready && (
          <div>
            <div style={{ maxWidth: "400px", width: "80vw" }}>
              <ReactCrop
                src={this.state.file}
                crop={this.state.crop}
                onChange={(newCrop) => this.setState({ crop: newCrop })}
              />
            </div>
            <button>Crop</button>
          </div>
        )}
      </center>
    );
  };
}

export default BadgeModule;

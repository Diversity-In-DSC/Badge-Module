import React from "react";
import "@tensorflow/tfjs-backend-webgl";
const blazeface = require("@tensorflow-models/blazeface");
class BadgeModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: null,
      status: "Loading Model",
      loaded: false,
    };
  }

  async componentDidMount() {
    let model = await blazeface.load();

    this.setState({ status: "Model Loaded", loaded: true });

    console.log(model);
  }
  render() {
    return (
      <center>
        <h4>Status : {this.state.status}</h4>
        {this.state.loaded && <button onClick>CLick</button>}
      </center>
    );
  }
}

export default BadgeModule;

import React, { Component } from "react";
import Aside from "./Aside";
import "./App.css";

class App extends Component {
  state = {
    response: ""
  };
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  render() {
    return (
      <div className="hideOverflow">
        <Aside />
        <div className="owl">
          <h1> O.W.L. </h1>
        </div>
        <div className="Pulse">
          <svg
            width="108"
            height="128"
            viewBox="0 0 54 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Page-1" fill="none" fillRule="evenodd">
              <path
                className="beat-loader"
                d="M0.5,38.5 L16,38.5 L19,25.5 L24.5,57.5 L31.5,7.5 L37.5,46.5 L43,38.5 L53.5,38.5"
                id="Path-2"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;

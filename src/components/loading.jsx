import { Component } from "react";
import "./loading.css";
import loadImage from "../images/loading.svg";

class Loader extends Component {
    render() {
        return (
            <div className="loading">
                <div className="loading-container">
                    <img
                        className="rotating"
                        width={150}
                        height={150}
                        src={loadImage}
                        alt="loading..."
                    />
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }
}

export { Loader };

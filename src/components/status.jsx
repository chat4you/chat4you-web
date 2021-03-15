import { Component } from "react";
import "./status.css";

class ConnectionStatus extends Component {
    constructor(props) {
        super(props);
        this.state = { connection: false };
    }

    render() {
        return (
            <div className="statusbar">
                <div className="item">
                    <span>Connection:</span>
                    <i
                        id="connection-status"
                        className={this.props.connection ? "online" : ""}
                    ></i>
                </div>
            </div>
        );
    }
}

export { ConnectionStatus };

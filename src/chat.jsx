import { Component } from "react";
import "./chat.css";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { me: false };
    }
    componentDidMount() {
        fetch("/api/me")
            .then((data) => data.json())
            .then((data) => {
                this.setState({ me: data });
            });
    }

    render() {
        return (
            <div id="chat-app">
                <div className="messages">
                    <div className="messages-header">
                        <h1 id="chat-name">
                            Welcome,{" "}
                            {this.state.me ? this.state.me.name : "..."}!
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export { Chat };

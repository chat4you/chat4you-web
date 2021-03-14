import { Component } from "react";
import "./message.css";

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = { content: <i></i>, me: false };
    }

    componentDidMount() {
        let message = this.props.data;
        switch (message.type) {
            case "text":
                this.setState({
                    content: (
                        <p className="message-type text">{message.content}</p>
                    ),
                });
                break;

            default:
                throw new Error(`Unknown message type: ${message.type}`);
        }
        if (this.props.me.id === message.sent_by) {
            this.setState({ me: true });
        }
    }

    render() {
        return (
            <div className="message-line">
                <div className={this.state.me ? "message me" : "message"}>
                    {this.state.content}
                </div>
            </div>
        );
    }
}

export { Message };

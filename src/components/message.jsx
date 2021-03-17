import { Component } from "react";
import "./message.css";

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = { content: <i></i>, me: false };
    }

    async componentDidMount() {
        let message = this.props.data;
        switch (message.type) {
            case "text":
                await this.setState({
                    content: (
                        <p className="message-type text">{message.content}</p>
                    ),
                });
                break;

            default:
                throw new Error(`Unknown message type: ${message.type}`);
        }
        if (this.props.me.id === message.sent_by) {
            await this.setState({ me: true });
        }
    }

    render() {
        return (
            <div
                className={this.state.me ? "message-line me" : "message-line"}
                ref={(el) => (this.el = el)}
            >
                <div className="message">{this.state.content}</div>
            </div>
        );
    }
}

export { Message };

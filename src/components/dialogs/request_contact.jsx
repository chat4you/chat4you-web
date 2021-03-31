import { Component } from "react";
import { Dialog } from "../dialog";
import "./request_contact.scss";

class RequestContact extends Component {
    constructor(props) {
        super(props);
        if (!this.props.socket) {
            throw new Error("Socket not passed to RequestContact");
        }
        this.state = { text: "", inProgress: false };
        this.textChange = this.textChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.socket.on("requestContact", (data) => {
            if (data.status !== "succes") {
                throw new Error(
                    `Error while requesting contact ${data.message}`
                );
            } else {
                Dialog.close("request-contact");
                this.setState({inProgress: false})
                this.input.value = "";
            }
        });
    }

    textChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit() {
        if (/\S/.test(this.state.text)) {
            this.props.socket.emit("requestContact", {
                other: this.state.text,
                type: "chat",
            });
            this.setState({inProgress: true})
        }
    }

    render() {
        return (
            <Dialog name="request-contact">
                <input
                    type="text"
                    id="add-contact-input"
                    placeholder="Enter the user id"
                    onChange={this.textChange}
                    ref={(el) => (this.input = el)}
                    autoFocus
                />
                <button id="add-contact-enter" onClick={this.handleSubmit} disabled={this.state.inProgress && true}>
                    Request
                </button>
            </Dialog>
        );
    }
}

export { RequestContact };

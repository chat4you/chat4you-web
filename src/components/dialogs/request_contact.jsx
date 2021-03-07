import { Component } from "react";
import { Dialog } from "../dialog";
import "./request_contact.css";

class RequestContact extends Component {
    render() {
        return (
            <Dialog name="request-contact">
                <input
                    type="text"
                    id="add-contact-input"
                    placeholder="Enter the username"
                    autoFocus
                />
                <button id="add-contact-enter">Request</button>
            </Dialog>
        );
    }
}

export { RequestContact };

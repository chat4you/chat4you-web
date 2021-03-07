import { Component } from "react";
import { Dialog } from "./components";
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
                            Welcome, &nbsp;
                            {this.state.me ? this.state.me.name : "..."}!
                        </h1>
                    </div>
                    <div className="message-container"></div>
                    <div className="message-input">
                        <textarea
                            id="input-message"
                            disabled="disabled"
                        ></textarea>
                        <button id="send" disabled="disabled">
                            Send
                        </button>
                    </div>
                </div>
                <div className="navigation">
                    <div className="header">
                        <div className="profile-image"></div>
                        <h1
                            id="profile-name"
                            onClick={() => {
                                Dialog.open("edit-profile");
                            }}
                        >
                            {this.state.me ? this.state.me.fullname : "..."}
                        </h1>
                        <button id="logout">Logout</button>
                    </div>
                    <div className="contacts">
                        <div className="add-contact-activate">
                            <button className="add-contact-button">
                                <span className="add-contact-1"></span>
                                <span className="add-contact-2"></span>
                            </button>
                            <h2>Add contact</h2>
                        </div>
                        <div className="contact-list"></div>
                    </div>
                    <div className="statusbar">
                        <div className="item">
                            <span>Connection:</span>
                            <i id="connection-status"></i>
                        </div>
                    </div>
                </div>
                <div className="dialogs">
                    <Dialog name="edit-profile">
                        <h2>Edit Profile</h2>
                        <form
                            encType="multipart/form-data"
                            action="/api/me/profile-update"
                            name="editProfile"
                            // onsubmit="return(validateProfile())"
                            method="POST"
                        >
                            <table id="edit-profile-table">
                                <tbody>
                                    <tr>
                                        <th>
                                            <label htmlFor="profile-upload">
                                                <div className="profile-image"></div>
                                            </label>
                                        </th>
                                        <th>
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                name="profileImage"
                                            />
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label htmlFor="name-edit">
                                                Full Name:
                                            </label>
                                        </th>
                                        <th>
                                            <input
                                                type="text"
                                                id="name-edit"
                                                name="fullname"
                                                defaultValue={
                                                    this.state.me.fullname
                                                }
                                            />
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label htmlFor="email-edit">
                                                E-mail:
                                            </label>
                                        </th>
                                        <th>
                                            <input
                                                type="text"
                                                id="email-edit"
                                                name="email"
                                                defaultValue={
                                                    this.state.me.email
                                                }
                                            />
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan="2">
                                            <button
                                                type="submit"
                                                id="save-profile"
                                            >
                                                Save
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </Dialog>
                    <Dialog name="request-contact">
                        <input
                            type="text"
                            id="add-contact-input"
                            placeholder="Enter the username"
                            autoFocus
                        />
                        <button id="add-contact-enter">Request</button>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export { Chat };

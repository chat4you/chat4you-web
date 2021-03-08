import { Component, createRef } from "react";
import {
    Dialog,
    Dialogs,
    ConversationManager,
    ContactList,
} from "./components";
import "./chat.css";
import io from "socket.io-client";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: false,
            openConversations: [],
            activeConversation: null,
            socketReady: false,
        };
        this.connectionStatus = createRef();
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        fetch("/api/me")
            .then((data) => data.json())
            .then((data) => {
                this.setState({ me: data });
            });
        //Initialize the socket

        this.socket = io();
        this.socket.on("auth", (data) => {
            if (data.status === "succes") {
                this.connectionStatus.current.classList.add("online");
                this.setState({ socketReady: true });
            } else {
                this.setState({ socketReady: false });
                alert("Cookie verification failed!");
                document.cookie = "";
                document.location.reload();
            }
        });
        this.socket.emit("auth", document.cookie);
        this.setState({ socketReady: true });
    }

    async logout() {
        await fetch("/api/logout");
        this.props.setLogin(false);
    }

    render() {
        return (
            <div id="chat-app">
                <div className="messages">
                    <div className="messages-header">
                        <h1 id="chat-name">
                            Welcome, &nbsp; {this.state.me?.name || "..."}!
                        </h1>
                    </div>
                    <ConversationManager
                        conversations={this.state.openConversations}
                        active={this.state.activeConversation}
                        socket={this.socket}
                    />
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
                            {this.state.me?.fullname || "..."}
                        </h1>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                    <div className="contacts">
                        <div
                            className="add-contact-activate"
                            onClick={() => {
                                Dialog.open("request-contact");
                            }}
                        >
                            <button className="add-contact-button">
                                <span className="add-contact-1"></span>
                                <span className="add-contact-2"></span>
                            </button>
                            <h2>Add contact</h2>
                        </div>
                        <ContactList
                            me={this.state.me}
                            socket={this.state.socketReady && this.socket}
                        />
                    </div>
                    <div className="statusbar">
                        <div className="item">
                            <span>Connection:</span>
                            <i
                                id="connection-status"
                                ref={this.connectionStatus}
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="dialogs">
                    <Dialogs.EditProfile me={this.state.me} />
                    <Dialogs.RequestContact />
                </div>
            </div>
        );
    }
}

export { Chat };

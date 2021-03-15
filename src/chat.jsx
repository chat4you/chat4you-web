import { Component } from "react";
import {
    Dialog,
    Dialogs,
    ConversationManager,
    ContactList,
    ConnectionStatus,
    Loader,
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
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        fetch("/api/me")
            .then((data) => data.json())
            .then((data) => {
                this.setState({ me: data });
            });

        this.socket = io();
        this.socket.on("auth", (data) => {
            if (data.status === "succes") {
                this.setState({ socketReady: true });
            } else {
                this.setState({ socketReady: false });
                alert("Cookie verification failed!");
                document.cookie = "";
                document.location.reload();
            }
        });
        this.socket.io.on("reconnect", () => {
            this.socket = io();
            this.componentDidMount();
            this.setState({ socketReady: true });
        });
        this.socket.on("disconnect", () => {
            this.setState({ socketReady: false });
        });
        this.socket.emit("auth", document.cookie);
        this.setState({ socketReady: true });
    }

    async logout() {
        await fetch("/api/logout");
        this.props.setLogin(false);
    }

    render() {
        if (!this.state.socketReady) {
            return <Loader />;
        } else {
            return (
                <div id="chat-app">
                    <div className="messages">
                        <ConversationManager
                            conversations={this.state.openConversations}
                            active={this.state.activeConversation}
                            socket={this.socket}
                            me={this.state.me}
                            ctl={ContactList}
                        />
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
                                conversation={ConversationManager}
                            />
                        </div>
                        <ConnectionStatus connection={this.state.socketReady} />
                    </div>
                    <div className="dialogs">
                        <Dialogs.EditProfile me={this.state.me} />
                        <Dialogs.RequestContact />
                    </div>
                </div>
            );
        }
    }
}

export { Chat };

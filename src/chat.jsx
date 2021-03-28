import { Component } from "react";
import {
    Dialog,
    Dialogs,
    ConversationManager,
    ContactList,
    ConnectionStatus,
    Loader,
    ProfileImage,
    FullName,
} from "./components";
import "./chat.css";
import io from "socket.io-client";

class Chat extends Component {
    constructor (props) {
        super(props);
        this.state = {
            me: {},
            openConversations: [],
            activeConversation: null,
            socketReady: false,
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount () {
        fetch("/api/me")
            .then((data) => data.json())
            .then((data) => {
                this.setState({
                    me: data.status === "succes" && data.data,
                });
            });

        this.socket = io({ auth: { cookies: document.cookie } });
        this.socket.on("auth", (data) => {
            if (data.status === "succes") {
                this.setState({ socketReady: true });
            } else {
                this.setState({ socketReady: false });
                document.cookie = "";
                document.location.reload();
            }
        });
        this.socket.io.on("reconnect", () => {
            this.socket = io({ auth: { cookies: document.cookie } });
            this.componentDidMount();
            this.setState({ socketReady: true });
        });
        this.socket.on("disconnect", () => {
            this.setState({ socketReady: false });
        });
        this.setState({ socketReady: true });
    }

    async logout () {
        await fetch("/api/logout");
        this.props.setLogin(false);
    }

    render () {
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
                            <ProfileImage id={this.state.me.id} size={40} />
                            <h1
                                id="profile-name"
                                onClick={() => {
                                    Dialog.open("edit-profile");
                                }}
                            >
                                <FullName id={this.state.me.id} />
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
                                socket={this.socket}
                                conversation={ConversationManager}
                            />
                        </div>
                        <ConnectionStatus connection={this.state.socketReady} />
                    </div>
                    <div className="dialogs">
                        <Dialogs.EditProfile me={this.state.me} />
                        <Dialogs.RequestContact socket={this.socket} />
                    </div>
                </div>
            );
        }
    }
}

export { Chat };

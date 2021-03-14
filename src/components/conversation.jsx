import { Component, Fragment } from "react";
import "./conversation.css";
import { Message } from ".";

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [], online: [], info: null, open: false };
        this.socket = props.socket;
    }

    componentDidMount() {
        ConversationManager.byId[this.props.id] = this;
        this.socket.on("getMessages", (data) => {
            if (data.id === this.props.id) {
                if (data.status === "succes") {
                    this.setState({ messages: data.result });
                    ConversationManager.instance.setState({ open: true });
                } else {
                    throw new Error("Failed to get messages");
                }
            }
        });
        this.socket.emit("getMessages", { id: this.props.id });
    }

    componentDidUpdate() {
        this.el.scrollTop = this.el.scrollHeight;
    }

    componentWillUnmount() {
        delete ConversationManager.byId[this.props.id];
    }

    render() {
        return (
            <div
                className={
                    this.state.open ? "conversation open" : "conversation"
                }
                ref={(el) => (this.el = el)}
            >
                {this.state.messages.map((message) => (
                    <Message me={this.props.me} data={message} />
                ))}
            </div>
        );
    }
}

class ConversationManager extends Component {
    static byId = {};
    static lastOpen = false;
    static instance;
    static open = async (data, loop = false) => {
        ConversationManager.lastOpen &&
            ConversationManager.lastOpen.setState({ open: false }); // Close last open chat
        ConversationManager.instance.setState({ open: false }); // The conversation will unlock itself when it got all messages
        if (data.id in ConversationManager.byId) {
            ConversationManager.byId[data.id].setState({ open: true });
            ConversationManager.lastOpen = ConversationManager.byId[data.id];
        } else if (!loop) {
            await ConversationManager.instance.setState((state, props) => ({
                conversations: state.conversations.concat(data),
            })); // Wait for the conversation to load
            ConversationManager.open(data, (loop = true));
        } else {
            throw new Error("Failed to open conversation, loop");
        }
    };

    constructor(props) {
        super(props);
        this.state = { conversations: [], open: false };
        ConversationManager.instance = this;
    }

    render() {
        return (
            <Fragment>
                <div className="messages-header">
                    <h1 id="chat-name">
                        {ConversationManager.lastOpen
                            ? this.props.ctl.byId[
                                  ConversationManager.lastOpen.props.id
                              ].name
                            : `Welcome, ${this.props.me?.name || "..."}!`}
                    </h1>
                </div>
                <div className="conversations">
                    {this.state.conversations.map((conversation) => {
                        return (
                            <Conversation
                                key={conversation.id}
                                id={conversation.id}
                                active={conversation.id === this.props.active}
                                me={this.props.me}
                                socket={this.props.socket}
                            />
                        );
                    })}
                </div>
                <div className="message-input">
                    <textarea
                        id="input-message"
                        disabled={!this.state.open}
                    ></textarea>
                    <button id="send" disabled={!this.state.open}>
                        Send
                    </button>
                </div>
            </Fragment>
        );
    }
}

export { ConversationManager };

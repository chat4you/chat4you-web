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
        this.socket.on("getMessages", async (data) => {
            if (data.id === this.props.id) {
                if (data.status === "succes") {
                    await this.setState({ messages: data.result });
                    ConversationManager.instance.setState({ open: true });
                    this.el.scrollTop = this.el.scrollHeight;
                } else {
                    throw new Error("Failed to get messages");
                }
            }
        });
        this.socket.emit("getMessages", { id: this.props.id });
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
    static current = false;
    static instance;

    static async open(data, loop = false) {
        ConversationManager.current &&
            ConversationManager.current.setState({ open: false });
        // The conversation will unlock itself when it got all messages
        ConversationManager.instance.setState({ open: false });

        if (data.id in ConversationManager.byId) {
            ConversationManager.byId[data.id].setState({ open: true });
            ConversationManager.current = ConversationManager.byId[data.id];
        } else if (!loop) {
            // Wait for the conversation to load
            await ConversationManager.instance.setState((state) => ({
                conversations: state.conversations.concat(data),
            }));
            // Re-open with 'loop' set to true to prevent looping
            ConversationManager.open(data, (loop = true));
        } else {
            throw new Error("Failed to open conversation, loop");
        }
    }

    static async addMessage(message) {
        if (!(message.id in ConversationManager.byId)) {
            // TBD: move contact to top and show notification
            return;
        }
        let conversation = ConversationManager.byId[message.id];
        await conversation?.setState((state) => ({
            messages: state.messages.concat(message.data),
        }));
        conversation.el.scrollTop = conversation.el.scrollHeight;
    }

    static sendMessage(message) {
        ConversationManager.instance.sendMessage(message);
    }

    constructor(props) {
        super(props);
        this.state = { conversations: [], open: false };
        this.socket = this.props.socket;
        this.textSubmit = this.textSubmit.bind(this);
        this.buttonSubmit = this.buttonSubmit.bind(this);
        ConversationManager.instance = this;
    }

    componentDidMount() {
        this.socket.on("message", (data) => {
            if (data.status === "succes") {
                ConversationManager.addMessage(data);
            } else if (data.status === "error") {
                console.error(`Message Error: ${data.message}`);
            } else {
                console.error(`Undefined return status: ${data.status}`);
            }
        });
    }

    sendMessage(message) {
        this.socket.emit("message", message);
    }

    buttonSubmit() {
        let text = this.messageInput.value;
        if (/\s/.test(text)) return;
        let message = {
            conversation: ConversationManager.current.props.id,
            type: "text",
            content: text,
        };
        this.sendMessage(message);
        this.messageInput.value = "";
    }

    textSubmit(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            this.buttonSubmit();
        }
    }

    render() {
        return (
            <Fragment>
                <div className="messages-header">
                    <h1 id="chat-name">
                        {ConversationManager.current
                            ? this.props.ctl.byId[
                                  ConversationManager.current.props.id
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
                        onKeyDown={this.textSubmit}
                        ref={(el) => (this.messageInput = el)}
                    ></textarea>
                    <button
                        id="send"
                        disabled={!this.state.open}
                        onClick={this.buttonSubmit}
                    >
                        Send
                    </button>
                </div>
            </Fragment>
        );
    }
}

export { ConversationManager };

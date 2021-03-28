import { Component, Fragment } from "react";
import "./conversation.css";
import { Message, FullName } from ".";

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [], online: [], info: null, open: false };
        this.socket = props.socket;
    }

    shouldComponentUpdate(newProps, newState) {
        if (newProps !== this.props || newState || this.state) {
            return true;
        }
        return false;
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
        // The conversation will unlock itself when it got all messages

        if (data.id in this.byId) {
            if (this.instance.state.current !== this.byId[data.id]) {
                this.byId[data.id].setState({ open: true });
                this.instance.setState({
                    current: this.byId[data.id],
                });
            }
        } else if (!loop) {
            this.instance.setState({ open: false });
            // Wait for the conversation to load
            await this.instance.setState((state) => ({
                conversations: state.conversations.concat(data),
            }));
            // Re-open with 'loop' set to true to prevent looping
            this.open(data, (loop = true));
        } else {
            throw new Error("Failed to open conversation, loop");
        }
    }

    static async addMessage(message) {
        if (!(message.id in this.byId)) {
            // TBD: move contact to top and show notification
            return;
        }
        let conversation = this.byId[message.id];
        await conversation?.setState((state) => ({
            messages: state.messages.concat(message.data),
        }));
        conversation.el.scrollTop = conversation.el.scrollHeight;
    }

    static sendMessage(message) {
        this.instance.sendMessage(message);
    }

    constructor(props) {
        super(props);
        this.state = { conversations: [], open: false, current: false };
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
        if (!/\S/.test(text)) return;
        let message = {
            conversation: ConversationManager.instance.state.current.props.id,
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
                        {ConversationManager.instance.state.current ? (
                            <FullName
                                id={
                                    this.props.ctl.byId[
                                        ConversationManager.instance.state
                                            .current.props.id
                                    ].state.id
                                }
                            />
                        ) : (
                            `Welcome, ${this.props.me?.name || "..."}!`
                        )}
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

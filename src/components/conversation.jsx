import { Component, Fragment } from "react";
import "./conversations.css";

class Conversation extends Component {
    static conversations = {};
    static lastOpen = false;
    static open = (id) => {
        Conversation.conversations[id].setState({ open: true });
        Conversation.lastOpen = Conversation.conversations[id];
    };
    constructor(props) {
        super(props);
        this.state = { messages: [], online: [], info: null, open: false };
        this.socket = props.socket;
    }

    componentDidMount() {
        Conversation.conversations[this.props.id] = this;
        // fetch data from server & socket
    }

    componentWillUnmount() {
        delete Conversation.conversations[this.props.id];
    }

    render() {
        return (
            <div
                className={
                    this.state.open ? "conversation open" : "conversation"
                }
            ></div>
        );
    }
}

class ConversationManager extends Component {
    static instance;
    static open = async (data) => {
        if (data.id in Conversation.conversations) {
            Conversation.open(data.id);
        } else {
            await ConversationManager.instance.setState((state, props) => ({
                conversations: state.conversations.concat(data),
            }));
            Conversation.open(data.id);
            ConversationManager.instance.setState({ open: true });
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
                        {Conversation.lastOpen
                            ? this.props.ctl.byId[
                                  Conversation.lastOpen.props.id
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

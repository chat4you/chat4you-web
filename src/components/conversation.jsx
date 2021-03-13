import { Component } from "react";
import "./conversations.css";

class Conversation extends Component {
    static conversations = {};
    static lastOpen = false;
    static open = (id) => {
        Conversation.conversations[id].setState({ open: true });
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
        }
    };

    constructor(props) {
        super(props);
        this.state = { conversations: [] };
        ConversationManager.instance = this;
    }

    render() {
        return (
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
        );
    }
}

export { ConversationManager };

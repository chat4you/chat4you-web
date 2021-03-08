import { Component } from "react";
import "./conversations.css";

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [], online: [], info: null };
        this.socket = props.socket;
    }

    componentDidMount() {
        // fetch data from server & socket
    }

    render() {
        return <div className="conversation"></div>;
    }
}

class ConversationManager extends Component {
    render() {
        return (
            <div className="conversations">
                {this.props.conversations.map((conversation) => {
                    return (
                        <Conversation
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

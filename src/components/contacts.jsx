import { Component } from "react";
import "./contacts.scss";
import { FullName, ProfileImage } from ".";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = { type: "", id: null, accepted: false };
        this.userAction = this.userAction.bind(this);
    }

    componentDidMount() {
        const contact = this.props.data;
        if (contact.type === "chat") {
            this.setState({
                id:
                    contact.members[
                        Math.abs(contact.members.indexOf(this.props.me.id) - 1)
                    ],
                type: "chat",
                accepted:
                    contact.accepted[contact.members.indexOf(this.props.me.id)],
            });
            ContactList.byId[contact.id] = this;
        }
        this.props.socket.on("acceptReject", (data) => {
            if (data.status !== "succes") {
                throw new Error(
                    `Error while accepting/rejecting user ${data.message}`
                );
            } else {
                if (data.action === "accept") {
                    this.setState({ accepted: true });
                } else {
                    delete ContactList.byId[contact.id];
                    ContactList.instance.setState((state) => {
                        state.contacts.splice(
                            state.contacts.indexOf(this.props.data),
                            1
                        );
                        return { contacts: state.contacts }; // removes this
                    });
                }
            }
        });
    }

    userAction(action, e) {
        e.stopPropagation()
        if (!this.accepted) {
            this.props.socket.emit("acceptReject", {
                id: this.props.data.id,
                action: action,
            });
            return;
        } else {
            throw new Error("Not supported yet");
        }
    }

    render() {
        return (
            // Continue here
            <div className="contact" onClick={this.props.onClick}>
                <ProfileImage
                    size={40}
                    id={this.state.id}
                    type={this.state.type}
                />
                <div className="info">
                    <h3 className="name">
                        <FullName id={this.state.id} type={this.state.type} />
                    </h3>
                    <div className="data"></div>
                </div>
                {!this.state.accepted && (
                    <div className="accept-reject">
                        <div
                            className="accept"
                            onClick={(e) => this.userAction("accept", e)}
                        >
                            Accept
                        </div>
                        <div
                            className="reject"
                            onClick={(e) => this.userAction("reject", e)}
                        >
                            Reject
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

class ContactList extends Component {
    static byId = {};
    static instance;
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
        };
        ContactList.instance = this;
    }

    componentDidMount() {
        fetch("/api/me/contacts")
            .then((data) => data.json())
            .then((data) => {
                if (data.status === "succes") {
                    this.setState({ contacts: data.data });
                } else {
                    console.error("Failed to get contacts");
                }
            });
    }

    render() {
        return (
            <div className="contact-list">
                {this.state.contacts.map((contact) => (
                    <Contact
                        key={contact.id}
                        data={contact}
                        me={this.props.me}
                        socket={this.props.socket}
                        onClick={() => {
                            this.props.conversation.open(contact);
                        }}
                    />
                ))}
            </div>
        );
    }
}

export { ContactList };

import { Component } from "react";
import "./contacts.css";
import { FullName, ProfileImage } from ".";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = { type: "", id: null };
    }

    componentDidMount() {
        const conversation = this.props.data;
        if (conversation.type === "chat") {
            this.setState({
                id:
                    conversation.members[
                        Math.abs(
                            conversation.members.indexOf(this.props.me.id) - 1
                        )
                    ],
                type: "chat",
            });
            ContactList.byId[conversation.id] = this;
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
            </div>
        );
    }
}

class ContactList extends Component {
    static byId = {};
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
        };
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

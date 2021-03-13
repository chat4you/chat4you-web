import { Component } from "react";
import "./contacts.css";
import { FullName, ProfileImage } from ".";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };
    }

    componentDidMount() {
        const conversation = this.props.data;
        this.setState({
            name:
                conversation.type === "group" ? (
                    conversation.name
                ) : (
                    <FullName
                        id={
                            conversation.members[
                                Math.abs(
                                    conversation.members.indexOf(
                                        this.props.me.name
                                    )
                                )
                            ]
                        }
                    />
                ),
        });
    }

    render() {
        return (
            // Continue here
            <div className="contact" onClick={this.props.onClick}>
                <ProfileImage size={40} id={this.props.data.id} />
                <div className="info">
                    <h3 className="name">{this.state.name}</h3>
                    <div className="data"></div>
                </div>
            </div>
        );
    }
}

class ContactList extends Component {
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
                this.setState({ contacts: data });
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

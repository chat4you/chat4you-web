import { Component } from "react";
import "./contacts.css";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };
    }

    componentDidMount() {
        const conversation = this.props.data;
        console.log(conversation);
        this.setState({
            name:
                conversation.type === "group"
                    ? conversation.name
                    : conversation.members[
                          Math.abs(
                              conversation.members.indexOf(this.props.me.name)
                          )
                      ],
        });
    }

    render() {
        return (
            // Continue here
            <div className="contact">
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
        console.log(props);
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
                    <Contact data={contact} me={this.props.me} />
                ))}
            </div>
        );
    }
}

export { ContactList };

import { Component } from "react";

class Contact extends Component {
    render() {
        return (
            // Continue here
            <div className="contact">
                <div className="info">
                    <div className="alias">{this.props.data.name}</div>
                    <div className="data"></div>
                </div>
            </div>
        );
    }
}

class ContactList extends Component {
    constructor(props) {
        super(props);
        this.state = { contacts: [] };
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
                    <Contact data={contact} />
                ))}
            </div>
        );
    }
}

export { ContactList };

import { Component } from "react";

class FullName extends Component {
    constructor(props) {
        super(props);
        this.state = { content: "..." };
    }
    async componentDidMount() {
        let fullname = await (
            await fetch(`/api/users/${this.props.id}/fullname`)
        ).text();
        this.setState({ content: fullname });
    }
    render() {
        return this.state.content;
    }
}

export { FullName };

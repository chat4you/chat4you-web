import { Component } from "react";

class FullName extends Component {
    constructor(props) {
        super(props);
        this.state = { content: "...", id: null };
    }

    shouldComponentUpdate(newProps, newState) {
        if (this.state.id !== newProps.id) {
            this.setState({ id: newProps.id });
            return true;
        } else if (this.state.content !== newState.content) {
            return true;
        }
        return false;
    }

    async componentDidUpdate() {
        if (this.state.id) {
            let fullname = await (
                await fetch(`/api/users/${this.state.id}/fullname`)
            ).text();
            this.setState({ content: fullname });
        }
        this.previousId = this.props.id;
    }

    render() {
        return this.state.content;
    }
}

export { FullName };

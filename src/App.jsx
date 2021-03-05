import { Component } from "react";
import { Login } from "./login";
import { Chat } from "./chat";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { login: false, ready: false };
    }

    componentDidMount() {
        fetch("/api/check-login")
            .then((data) => data.json())
            .then((data) => {
                this.setState({ login: data.login, ready: true });
            });
    }

    render() {
        return this.state.ready && (this.state.login ? <Chat /> : <Login />);
    }
}

export default App;

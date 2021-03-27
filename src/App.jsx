import { Component } from "react";
import { Login } from "./login";
import { Chat } from "./chat";
import { Loader } from "./components";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { login: false, ready: false };
        this.setLogin = this.setLogin.bind(this);
    }

    componentDidMount() {
        fetch("/api/check-login")
            .then((data) => data.json())
            .then((data) => {
                this.setState({ login: data.login, ready: true });
            });
    }

    setLogin(state) {
        this.setState({ login: state });
    }

    render() {
        return this.state.ready ? (
            this.state.login ? (
                <Chat setLogin={this.setLogin} />
            ) : (
                <Login setLogin={this.setLogin} />
            )
        ) : (
            <Loader />
        );
    }
}

export default App;

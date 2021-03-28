import { Component } from "react";
import "./login.css";

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = { name: "", pass: "", message: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit () {
        let usrOk, passOk;
        if (/\S/i.test(this.state.pass)) {
            passOk = true;
        } else {
            passOk = false;
            this.setState({ message: "Invalid password" });
        }
        if (/\S/i.test(this.state.name)) {
            usrOk = true;
        } else {
            usrOk = false;
            this.setState({ message: "Invalid username" });
        }
        if (usrOk && passOk) {
            const authContent = {
                password: this.state.pass,
                username: this.state.name,
            };
            const server = new XMLHttpRequest();
            server.onreadystatechange = () => {
                if (server.readyState === 4 && server.status === 200) {
                    const decoded = JSON.parse(server.responseText);
                    if (decoded.login) {
                        this.props.setLogin(true);
                    } else {
                        this.setState({ message: "Wrong credentials" });
                    }
                }
            };
            server.open("POST", "/api/login", true);
            server.setRequestHeader("Content-Type", "application/json");
            server.send(JSON.stringify(authContent));
        }
    }

    render () {
        return (
            <div className="login-container">
                <div className="login">
                    <h1>Login</h1>
                    <input
                        type="text"
                        id="username"
                        name="name"
                        className="login-item login-input"
                        placeholder="Username"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        id="password"
                        name="pass"
                        className="login-item login-input"
                        placeholder="Password"
                        onChange={this.handleChange}
                    />
                    {this.state.message && (
                        <p id="message">{this.state.message}</p>
                    )}
                    <button
                        className="submit login-item"
                        onClick={this.handleSubmit}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }
}

export { Login };

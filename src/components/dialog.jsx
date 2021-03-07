import { Component } from "react";
import "./dialog.css";

class Dialog extends Component {
    static dialogs = {};
    static current = false;

    static open(name) {
        if (Dialog.current) {
            Dialog.close(Dialog.current);
        }
        Dialog.dialogs[name].setState({ visible: true });
        Dialog.current = name;
    }

    static close(name) {
        Dialog.dialogs[name].setState({ visible: false });
        Dialog.current = false;
    }

    constructor(props) {
        super(props);
        this.state = { visible: false };
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        Dialog.dialogs[this.props.name] = this;
    }

    close(e) {
        if (e.target.classList.contains("dialog-container")) {
            Dialog.close(this.props.name);
        }
    }

    render() {
        return (
            <div
                className={
                    this.state.visible
                        ? "dialog-container visible"
                        : "dialog-container"
                }
                onClick={this.close}
            >
                <div className={"dialog " + this.props.name}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export { Dialog };

import { Component } from "react";

class ProfileImage extends Component {
    render() {
        return (
            <div
                style={{
                    height: this.props.size + "px",
                    width: this.props.size + "px",
                    borderRadius: this.props.size / 2 + "px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundImage: `url('/api/users/${this.props.id}/profile-image')`,
                }}
            ></div>
        );
    }
}

export { ProfileImage };

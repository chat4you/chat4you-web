import { Component } from "react";
import { Dialog } from "../dialog";
import { ProfileImage } from "../";
import "./edit_profile.css";

class EditProfile extends Component {
    render() {
        return (
            <Dialog name="edit-profile">
                <h2>Edit Profile</h2>
                <form
                    encType="multipart/form-data"
                    action="/api/me/profile-update"
                    name="editProfile"
                    // onsubmit="return(validateProfile())"
                    method="POST"
                >
                    <table id="edit-profile-table">
                        <tbody>
                            <tr>
                                <th>
                                    <label htmlFor="profile-upload">
                                        <ProfileImage
                                            id={this.props.me.id}
                                            size={20}
                                        />
                                    </label>
                                </th>
                                <th>
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        name="profileImage"
                                    />
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    <label htmlFor="name-edit">
                                        Full Name:
                                    </label>
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        id="name-edit"
                                        name="fullname"
                                        defaultValue={this.props.me.fullname}
                                    />
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    <label htmlFor="email-edit">E-mail:</label>
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        id="email-edit"
                                        name="email"
                                        defaultValue={this.props.me.email}
                                    />
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="2">
                                    <button type="submit" id="save-profile">
                                        Save
                                    </button>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </Dialog>
        );
    }
}

export { EditProfile };

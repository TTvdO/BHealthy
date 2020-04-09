import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import authService from "./AuthorizeService";
import { ApplicationPaths } from "./ApiAuthorizationConstants";

import { Button } from "@material-ui/core";

import { fetchJsonWithAuth } from "../../hooks/useRestApiWithAuth";

export class LoginMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
			userName: null
		};
	}

	componentDidMount() {
		this._subscription = authService.subscribe(() => this.populateState());
		this.populateState();
	}

	componentWillUnmount() {
		authService.unsubscribe(this._subscription);
	}

	async populateState() {
		const [isAuthenticated, user] = await Promise.all([
			authService.isAuthenticated(),
			authService.getUser()
		]);

		const currentUser = await fetchJsonWithAuth(`/api/users/${user.sub}`);

		this.setState({
			isAuthenticated,
			userName: currentUser.userName
		});
	}

	render() {
		const { isAuthenticated, userName } = this.state;
		if (!isAuthenticated) {
			const registerPath = `${ApplicationPaths.Register}`;
			const loginPath = `${ApplicationPaths.Login}`;
			return this.anonymousView(registerPath, loginPath);
		} else {
			const profilePath = `${ApplicationPaths.Profile}`;
			const logoutPath = {
				pathname: `${ApplicationPaths.LogOut}`,
				state: { local: true }
			};
			return this.authenticatedView(userName, profilePath, logoutPath);
		}
	}

	authenticatedView(userName, profilePath, logoutPath) {
		return (
			<>
				<Button component={RouterLink} to={profilePath} color="inherit">
					{userName}
				</Button>

				<Button component={RouterLink} to={logoutPath} color="inherit">
					Logout
				</Button>
			</>
		);
	}

	anonymousView(registerPath, loginPath) {
		return (
			<>
				<Button
					component={RouterLink}
					to={registerPath}
					color="inherit"
				>
					Register
				</Button>
				<Button component={RouterLink} to={loginPath} color="inherit">
					Login
				</Button>
			</>
		);
	}
}

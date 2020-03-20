import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ApplicationUser } from "./components/ApplicationUser";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import { PrivacyPolicy } from "./components/PrivacyPolicy";
import UserProfile from "./components/UserProfile";

export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Route exact path="/" component={Home} />
				<Route path="/account" component={ApplicationUser} />
				<Route path="/user/:userName" component={UserProfile} />
				<Route
					path={ApplicationPaths.ApiAuthorizationPrefix}
					component={ApiAuthorizationRoutes}
				/>
				<Route path="/privacy-policy" component={PrivacyPolicy} />
			</Layout>
		);
	}
}

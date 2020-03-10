import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ApplicationUser } from "./components/ApplicationUser";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import { Posts } from "./components/Posts";
import { PrivacyPolicy } from "./components/PrivacyPolicy";


export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Route exact path="/" component={Home} />
				<Route path="/account" component={ApplicationUser} />
				<Route path="/posts" component={Posts} />
				<Route
					path={ApplicationPaths.ApiAuthorizationPrefix}
					component={ApiAuthorizationRoutes}
				/>
				<Route path="/PrivacyPolicy" component={PrivacyPolicy} />
			</Layout>
		);
	}
}

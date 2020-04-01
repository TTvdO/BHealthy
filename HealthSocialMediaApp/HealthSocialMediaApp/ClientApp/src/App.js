import React from "react";
import { Route } from "react-router";

import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ApplicationUser } from "./components/ApplicationUser";
import { Search } from "./components/Search";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import UserProfile from "./components/UserProfile";
import { Following } from "./components/Following";

function App() {
	return (
		<Layout>
			<Route exact path="/" component={Home} />
			<Route path="/account" component={ApplicationUser} />
			<Route path="/search" component={Search} />
			<Route path="/user/:userId" component={UserProfile} />
			<Route
				path={ApplicationPaths.ApiAuthorizationPrefix}
				component={ApiAuthorizationRoutes}
			/>
			<Route path="/privacy-policy" component={PrivacyPolicy} />
			<Route path="/following" component={Following} />
		</Layout>
	);
}

export default App;

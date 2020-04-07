import React from "react";
import { Route, Switch } from "react-router";

import { withLDProvider } from "launchdarkly-react-client-sdk";

import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import { Home } from "./pages/Home";
import { UserAccount } from "./pages/UserAccount";
import { Search } from "./pages/Search";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { UserProfile } from "./pages/UserProfile";
import { Following } from "./pages/Following";
import { UserFollowing } from "./pages/UserFollowing";
import { UserFollowers } from "./pages/UserFollowers";
import { PleaseLogIn } from "./pages/PleaseLogIn";
import { URLNotFound } from "./pages/URLNotFound";

import { Layout } from "./components/Layout";

import { useCurrentUserId } from "./hooks/useCurrentUserId";

function App() {
	const currentUserId = useCurrentUserId();

	return (
		<Layout>
			<Switch>
				<Route exact path="/" component={Home} />
				{currentUserId && (
					<Route path="/account" component={UserAccount} />
				)}
				{!currentUserId && (
					<Route path="/account" component={PleaseLogIn} />
				)}
				<Route path="/search" component={Search} />
				<Route path="/user/:userId" component={UserProfile} />
				<Route path="/follows/:userId/" component={UserFollowing} />
				<Route path="/followers/:userId/" component={UserFollowers} />
				<Route
					path={ApplicationPaths.ApiAuthorizationPrefix}
					component={ApiAuthorizationRoutes}
				/>
				<Route
					path={ApplicationPaths.ApiAuthorizationPrefix}
					component={ApiAuthorizationRoutes}
				/>
				{currentUserId && (
					<Route path="/following" component={Following} />
				)}
				{!currentUserId && (
					<Route path="/following" component={PleaseLogIn} />
				)}
				<Route path="/privacy-policy" component={PrivacyPolicy} />
				<Route path="*" component={URLNotFound} />
			</Switch>
		</Layout>
	);
}

export default withLDProvider({
	clientSideID: "5e849b4daace4c06f5dc6d1f"
})(App);

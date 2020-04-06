import React from "react";
import { Route } from "react-router";

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

import { Layout } from "./components/Layout";

import { useCurrentUserId } from "./hooks/useCurrentUserId";

function App() {
	const currentUserId = useCurrentUserId();

	return (
		<Layout>
			{currentUserId && (
				<>
					<Route exact path="/" component={Home} />
					<Route path="/account" component={UserAccount} />
					<Route path="/search" component={Search} />
					<Route path="/user/:userId" component={UserProfile} />
					<Route path="/follows/:userId/" component={UserFollowing} />
					<Route
						path="/followers/:userId/"
						component={UserFollowers}
					/>
					<Route path="/following" component={Following} />
				</>
			)}
			<Route
				path={ApplicationPaths.ApiAuthorizationPrefix}
				component={ApiAuthorizationRoutes}
			/>
			<Route path="/privacy-policy" component={PrivacyPolicy} />
		</Layout>
	);
}

export default withLDProvider({
	clientSideID: "5e849b4daace4c06f5dc6d1f"
})(App);

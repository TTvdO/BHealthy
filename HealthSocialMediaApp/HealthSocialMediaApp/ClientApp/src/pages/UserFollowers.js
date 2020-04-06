import React from "react";
import { useParams } from "react-router-dom";

import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { useRestApiWithAuth } from "../hooks/useRestApiWithAuth";

import { UsersList } from "../components/UsersList";

const UserFollowers = () => {
	let { userId } = useParams();

	const currentUserId = useCurrentUserId();

	const [{ data: followers, isLoading }] = useRestApiWithAuth(
		`/api/users/followers?profileUserId=${userId}&currentUserId=${currentUserId}`
	);

	return (
		<>
			{!isLoading && followers && (
				<UsersList users={followers}></UsersList>
			)}
		</>
	);
};

export { UserFollowers };

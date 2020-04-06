import React from "react";
import { useParams } from "react-router-dom";

import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { useRestApiWithAuth } from "../hooks/useRestApiWithAuth";

import { UsersList } from "../components/UsersList";

const UserFollowing = () => {
	let { userId } = useParams();

	const currentUserId = useCurrentUserId();

	const [{ data: followees, isLoading }] = useRestApiWithAuth(
		`/api/users/follows?profileUserId=${userId}&currentUserId=${currentUserId}`
	);

	return (
		<>
			{!isLoading && followees && (
				<UsersList users={followees}></UsersList>
			)}
		</>
	);
};

export { UserFollowing };

import React from "react";
import { useParams } from "react-router-dom";

import { useRestApiWithAuth } from "../hooks/useRestApiWithAuth";

import { UsersList } from "../components/UsersList";

const UserFollowers = () => {
	let { userId } = useParams();

	const [{ data: followers, isLoading }] = useRestApiWithAuth(
		`/api/users/followers?profileUserId=${userId}`
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

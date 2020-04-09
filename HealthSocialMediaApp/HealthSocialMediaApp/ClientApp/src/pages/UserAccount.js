import React, { useState, useEffect } from "react";
import { Button, Box, TextField, Typography } from "@material-ui/core";

import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { fetchWithAuth, fetchJsonWithAuth } from "../hooks/useRestApiWithAuth";

const UserAccount = () => {
	const currentUserId = useCurrentUserId();

	const [userData, setUserData] = useState({});

	useEffect(() => {
		fetchJsonWithAuth(`/api/users/account/${currentUserId}`).then(user => {
			setUserData(user);
		});
	}, [setUserData, currentUserId]);

	const updateUserAttributes = async () => {
		const updatedUserData = {
			id: userData.id,
			userName: userData.userName,
			description: userData.description
		};

		await fetchWithAuth(`/api/users`, {
			method: "PUT",
			body: JSON.stringify(updatedUserData),
			headers: { "Content-Type": "application/json;charset=utf-8" }
		});
	};

	return (
		<form noValidate>
			<Typography variant="h4">My Account</Typography>
			{userData && (
				<Box display="flex" flexDirection="column">
					<label>ID</label>
					<Typography>{userData.id}</Typography>
					<label>Email</label>
					<Typography>{userData.email}</Typography>
					<label htmlFor="username-label">Username</label>
					<TextField
						id="username-label"
						value={userData.userName}
						onChange={e => {
							setUserData({
								...userData,
								userName: e.target.value
							});
						}}
					></TextField>
					<label htmlFor="description-label">Description</label>
					<TextField
						id="description-label"
						value={userData.description}
						onChange={e => {
							setUserData({
								...userData,
								description: e.target.value
							});
						}}
					></TextField>
					<Button
						variant="contained"
						color="primary"
						onClick={updateUserAttributes}
					>
						Submit
					</Button>
				</Box>
			)}
		</form>
	);
};
export { UserAccount };

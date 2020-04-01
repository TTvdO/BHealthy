import React, { useState, useEffect } from "react";
import { Button, Box, TextField, Typography } from "@material-ui/core";
import authService from "./api-authorization/AuthorizeService";

import { useCurrentUserId } from "./data-hooks/useCurrentUserId";
import { fetchUserData } from "./data-hooks/useUserData";

const ApplicationUser = () => {
	const currentUserId = useCurrentUserId();

	const [userData, setUserData] = useState({});

	useEffect(() => {
		fetchUserData(currentUserId).then(user => {
			setUserData(user);
		});
	}, [setUserData, currentUserId]);

	const updateUserAttributes = () => {
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			authService.getUser().then(user => {
				fetch(`/api/applicationusers/${user.sub}`, {
					method: "PUT",
					body: JSON.stringify(userData),
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				});
			});
		});
	};

	return (
		<form noValidate>
			<Typography variant="h4">My Account</Typography>
			<Box display="flex" flexDirection="column">
				<label htmlFor="id-label">ID</label>
				<Typography>{userData.id}</Typography>
				<label htmlFor="email-label">Email</label>
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
		</form>
	);
};
export { ApplicationUser };

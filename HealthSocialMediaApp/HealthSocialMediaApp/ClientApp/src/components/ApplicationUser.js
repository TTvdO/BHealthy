import React, { useState, useEffect } from "react";
import { Button, Box, TextField } from "@material-ui/core";
import authService from "./api-authorization/AuthorizeService";

const ApplicationUser = () => {
	const [applicationUserData, setApplicationUserData] = useState({
		user: {},
		isLoading: false,
		error: null
	});

	useEffect(() => {
		setApplicationUserData({ user: {}, isLoading: true, error: undefined });
		authService.getAccessToken().then(token => {
			authService.getUser().then(user => {
				fetch(`/api/applicationusers/${user.sub}`, {
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				})
					.then(response => {
						return response.json();
					})
					.then(user => {
						setApplicationUserData({
							user: user,
							isLoading: false,
							error: undefined
						});
					})
					.catch(error => {
						setApplicationUserData({
							user: {},
							isLoading: false,
							error
						});
					});
			});
		});
	}, [setApplicationUserData]);

	const updateUserAttributes = () => {
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			authService.getUser().then(user => {
				console.log("user", user);
				fetch(`/api/applicationusers/${user.sub}`, {
					method: "PUT",
					body: JSON.stringify(applicationUserData.user),
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
		<form noValidate autocomplete="off">
			<Box display="flex" flexDirection="column">
				<label for="id-label">ID</label>
				<TextField
					id="id-label"
					variant="filled"
					inputProps={{ disabled: true }}
					value={applicationUserData.user.id}
					onChange={e => {
						setApplicationUserData({
							...applicationUserData,
							user: {
								...applicationUserData.user,
								id: e.target.value
							}
						});
					}}
				></TextField>
				<label for="email-label">Email</label>
				<TextField
					id="email-label"
					variant="filled"
					inputProps={{ disabled: true }}
					value={applicationUserData.user.email}
					onChange={e => {
						setApplicationUserData({
							...applicationUserData,
							user: {
								...applicationUserData.user,
								email: e.target.value
							}
						});
					}}
				></TextField>
				<label for="username-label">Username</label>
				<TextField
					id="username-label"
					value={applicationUserData.user.userName}
					onChange={e => {
						setApplicationUserData({
							...applicationUserData,
							user: {
								...applicationUserData.user,
								userName: e.target.value
							}
						});
					}}
				></TextField>
				<label for="description-label">Description</label>
				<TextField
					id="description-label"
					value={applicationUserData.user.description}
					onChange={e => {
						setApplicationUserData({
							...applicationUserData,
							user: {
								...applicationUserData.user,
								description: e.target.value
							}
						});
					}}
				></TextField>
				<Button variant="contained" onClick={updateUserAttributes}>
					Submit
				</Button>
			</Box>
		</form>
	);
};
export { ApplicationUser };

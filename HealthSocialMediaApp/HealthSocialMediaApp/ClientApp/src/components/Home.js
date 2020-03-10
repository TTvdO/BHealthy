import React, { useState, useEffect } from "react";

import authService from "./api-authorization/AuthorizeService";

import { Typography } from "@material-ui/core";

const Home = () => {
	const [data, setData] = useState({
		users: [],
		isLoading: false,
		error: undefined
	});

	useEffect(() => {
		setData({ users: [], isLoading: true, error: undefined });
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			fetch("/api/applicationusers", {
				headers: !token ? {} : { Authorization: `Bearer ${token}` }
			})
				.then(response => {
					return response.json();
				})
				.then(user => {
					setData({
						users: user,
						isLoading: false,
						error: undefined
					});
				})
				.catch(error => {
					setData({
						users: {},
						isLoading: false,
						error
					});
				});
		});
	}, [setData]);

	return (
		<>
			{data.isLoading && <Typography>Loading user count...</Typography>}
			{!data.isLoading && data.error && (
				<Typography>Could not fetch user count</Typography>
			)}
			{!data.isLoading && !data.error && (
				<Typography>Total users: {data.users.length}</Typography>
			)}
		</>
	);
};

export { Home };

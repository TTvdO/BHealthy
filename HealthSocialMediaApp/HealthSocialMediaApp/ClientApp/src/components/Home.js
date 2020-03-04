import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

const Home = () => {
	const [data, setData] = useState({
		post: {},
		isLoading: false,
		error: undefined
	});

	useEffect(() => {
		setData({ post: {}, isLoading: true, error: undefined });
		fetch("/api/posts/1")
			.then(response => {
				return response.json();
			})
			.then(post => {
				setData({ post, isLoading: false, error: undefined });
			})
			.catch(error => {
				setData({
					post: {},
					isLoading: false,
					error
				});
			});
	}, [setData]);

	return (
		<>
			{data.isLoading && (
				<Typography>Loading Typographyost 1...</Typography>
			)}
			{!data.isLoading && data.error && (
				<Typography>Could not fetch post 1</Typography>
			)}
			{!data.isLoading && !data.error && (
				<Typography>Post 1: {data.post.description},</Typography>
			)}
		</>
	);
};

export { Home };

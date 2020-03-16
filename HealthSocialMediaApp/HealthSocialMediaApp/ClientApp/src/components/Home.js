import React, { useEffect } from "react";

import { Container, Typography } from "@material-ui/core";

import { PostCreate } from "./PostCreate";
import { Posts } from "./Posts";

import { useRestApi } from "./useRestApi";

const Home = () => {
	const [{ data: posts, isLoading, error }, fetchData] = useRestApi(
		"/api/posts",
		[]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleDeletePost = id => {
		fetch("/api/posts/" + id, { method: "DELETE" })
			.then(() => {
				fetchData();
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleCreatePost = () => {
		fetchData();
	};

	return (
		<Container maxWidth="sm">
			<PostCreate onCreate={handleCreatePost}></PostCreate>
			<h1>Explore</h1>
			{isLoading && <Typography>Loading posts...</Typography>}
			{!isLoading && error && (
				<Typography>Could not fetch posts...</Typography>
			)}
			{posts.length > 0 && (
				<Posts posts={posts} onDelete={handleDeletePost}></Posts>
			)}
			{posts.length === 0 && !isLoading && !error && (
				<Typography>There are no posts created yet...</Typography>
			)}
		</Container>
	);
};

export { Home };

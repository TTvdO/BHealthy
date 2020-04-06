import React from "react";

import { Container, Typography } from "@material-ui/core";

import { PostCreate } from "../components/PostCreate";
import { Posts } from "../components/Posts";

import { usePostData } from "../hooks/usePostData";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

const Home = () => {
	const currentUserId = useCurrentUserId();

	const [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	] = usePostData(currentUserId);

	return (
		<Container maxWidth="sm">
			<br></br>
			<PostCreate onCreate={fetchPosts}></PostCreate>
			<br></br>
			<Typography variant="h4">Explore</Typography>
			<br></br>
			<Posts
				posts={posts}
				isLoading={isLoading}
				error={error}
				onDelete={handleDelete}
				onLikeToggle={handleLikeToggle}
			></Posts>
		</Container>
	);
};

export { Home };

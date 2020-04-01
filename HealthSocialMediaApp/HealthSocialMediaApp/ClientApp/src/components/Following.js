import React from "react";

import { Container, Typography } from "@material-ui/core";

import { PostCreate } from "./PostCreate";
import { Posts } from "./Posts";
import { usePostData } from "./data-hooks/usePostData";
import { useCurrentUserId } from "./data-hooks/useCurrentUserId";

const Following = () => {
	const currentUserId = useCurrentUserId();

	const [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	] = usePostData(currentUserId, null, true);

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

export { Following };

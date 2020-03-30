
import React, { useEffect, useState } from "react";

import { Container, Typography } from "@material-ui/core";

import authService from "./api-authorization/AuthorizeService";

import { PostCreate } from "./PostCreate";
import { Posts } from "./Posts";
import { usePostData } from "./usePostData";

const Following = () => {
	const [currentUserId, setUserId] = useState(null);

	useEffect(() => {
		authService.getUser().then(user => {
			if (user) {
				setUserId(user.sub);
			} else {
				setUserId(null);
			}
		});
	}, [setUserId]);

	const [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	] = usePostData(currentUserId,null,true);

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
			></Posts>{" "}
		</Container>
	);
};

export { Following };
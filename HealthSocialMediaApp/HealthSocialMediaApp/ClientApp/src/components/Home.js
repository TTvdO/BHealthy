import React, { useEffect, useState } from "react";

import { Container, Typography } from "@material-ui/core";

import authService from "./api-authorization/AuthorizeService";

import { PostCreate } from "./PostCreate";
import { Posts } from "./Posts";
import { useRestApi } from "./useRestApi";

const Home = () => {
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

	const [{ data: posts, isLoading, error }, fetchData] = useRestApi(
		`/api/posts?currentUserId=${currentUserId}`,
		[]
	);

	useEffect(() => {
		fetchData();
	}, [currentUserId, fetchData]);

	const handleDeletePost = id => {
		fetch(`/api/posts/${id}`, { method: "DELETE" })
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

	const handleLikeToggle = post => {
		authService.getAccessToken().then(token => {
			if (!post.isLikedByCurrentUser) {
				fetch(`/api/posts/${post.id}/like?userId=${currentUserId}`, {
					method: "PUT",
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(() => {
					fetchData();
				});
			} else {
				fetch(`/api/posts/${post.id}/unlike?userId=${currentUserId}`, {
					method: "PUT",
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(() => {
					fetchData();
				});
			}
		});
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
				<Posts
					posts={posts}
					onDelete={handleDeletePost}
					onLike={handleLikeToggle}
				></Posts>
			)}
			{posts.length === 0 && !isLoading && !error && (
				<Typography>There are no posts created yet...</Typography>
			)}
		</Container>
	);
};

export { Home };

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";

import authService from "./api-authorization/AuthorizeService";

import moment from "moment";

const useStyles = makeStyles(theme => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			width: "100%"
		}
	}
}));

const initialPost = {
	imageLink: "",
	description: "",
	categoryId: 1,
	applicationUserId: "",
	createdAt: ""
};

const PostCreate = ({ onCreate }) => {
	const classes = useStyles();
	const [post, setPost] = useState(initialPost);

	const updatePostAttributes = () => {
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			authService.getUser().then(user => {
				post.applicationUserId = user.sub;
				post.createdAt = moment();
				fetch(`/api/posts/`, {
					method: "POST",
					body: JSON.stringify(post),
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(response => {
					onCreate();
					setPost(initialPost);
				});
			});
		});
	};

	return (
		<>
			<Typography variant="h4">Share what motivates you</Typography>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					required
					id="imagelink"
					label="Image Link"
					name="imagelink"
					value={post.imageLink}
					onChange={e => {
						setPost({
							...post,
							imageLink: e.target.value
						});
					}}
				/>
				<TextField
					id="description"
					label="Description"
					name="description"
					value={post.description}
					multiline
					onChange={e => {
						setPost({
							...post,
							description: e.target.value
						});
					}}
				/>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={updatePostAttributes}
					>
						Create post
					</Button>
				</div>
			</form>
		</>
	);
};

export { PostCreate };

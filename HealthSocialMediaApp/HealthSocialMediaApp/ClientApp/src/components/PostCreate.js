import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
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

const PostCreate = () => {
	const classes = useStyles();
	const [postData, setPostData] = useState({
		post: {
			imageLink: "",
			description: "",
			categoryId: 1,
			applicationUserId: "",
			createdAt: ""
		},
		isLoading: false,
		error: null
	});

	const updatePostAttributes = () => {
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			authService.getUser().then(user => {
				postData.post.applicationUserId = user.sub;
				postData.post.createdAt = moment();
				fetch(`/api/posts/`, {
					method: "POST",
					body: JSON.stringify(postData.post),
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(response => {
					window.location.href = "Posts";
				});
			});
		});
	};

	return (
		<Container maxWidth="sm">
			<h1>Create a post</h1>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					required
					id="imagelink"
					label="Image Link"
					name="imagelink"
					value={postData.post.imageLink}
					onChange={e => {
						setPostData({
							...postData,
							post: {
								...postData.post,
								imageLink: e.target.value
							}
						});
					}}
				/>
				<TextField
					id="description"
					label="Description"
					name="description"
					value={postData.post.Description}
					multiline
					onChange={e => {
						setPostData({
							...setPostData,
							post: {
								...postData.post,
								Description: e.target.value
							}
						});
					}}
				/>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={updatePostAttributes}
					>
						Save
					</Button>
				</div>
			</form>
			<p>{postData.status}</p>
		</Container>
	);
};

export { PostCreate };

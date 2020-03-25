import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import authService from "./api-authorization/AuthorizeService";
import InputLabel from "@material-ui/core/InputLabel";
import { Button, TextField, Typography } from "@material-ui/core";

function postCreateAlert(message) {
	alert(message);
}

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
	const [input, setInput] = useState(null);

	const updatePostAttributes = () => {
		authService.getAccessToken().then(token => {
			// Send authorization token so the backend can verify the user.
			authService.getUser().then(user => {
				post.applicationUserId = user.sub;
				post.createdAt = new Date();

				if (typeof input === "undefined" || input === null) {
					postCreateAlert("Please select a image to upload.");
					return Promise.reject("No file selected");
				}

				var formdata = new FormData();
				formdata.append("file", input.file, input.file.name);

				fetch(`/api/images`, {
					method: "POST",
					body: formdata,
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`
						  }
				})
					.then(response => {
						console.log(response);
						return response.json();
					})
					.then(data => {
						if (data.startsWith("Error:")) {
							postCreateAlert(data);
							return Promise.reject(data);
						}
						post.imageLink = data;
						fetch(`/api/posts/`, {
							method: "POST",
							body: JSON.stringify(post),
							headers: !token
								? {}
								: {
										Authorization: `Bearer ${token}`,
										"Content-Type":
											"application/json;charset=utf-8"
								  }
						}).then(response => {
							document.getElementById("file").value = "";
							onCreate();
							setPost(initialPost);
						});
					});
			});
		});
	};

	return (
		<>
			<Typography variant="h4">Share what motivates you</Typography>
			<form className={classes.root} noValidate autoComplete="off">
				<InputLabel htmlFor="file">Select an image</InputLabel>
				<input
					id="file"
					label="Image"
					type="file"
					name="file"
					onChange={e => {
						setInput({
							file: e.target.files[0]
						});
						document.getElementById("description").focus();
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

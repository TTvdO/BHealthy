import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import authService from "./api-authorization/AuthorizeService";
import InputLabel from "@material-ui/core/InputLabel";
import { Button, TextField, Typography } from "@material-ui/core";

const getAuthorizationHeaders = token => {
	return token
		? {
				Authorization: `Bearer ${token}`
		  }
		: {};
};

const useStyles = makeStyles(theme => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			width: "100%"
		}
	}
}));

const PostCreate = ({ onCreate }) => {
	const classes = useStyles();
	const [description, setDescription] = useState("");
	const [imageFile, setImageFile] = useState(null);

	const fileInputRef = useRef(null);
	const descriptionInputRef = useRef(null);

	const createPost = async () => {
		const token = await authService.getAccessToken();
		const user = await authService.getUser();

		const formdata = new FormData();
		formdata.append("file", imageFile, imageFile.name);

		const imageResponse = await fetch(`/api/images`, {
			method: "POST",
			body: formdata,
			headers: getAuthorizationHeaders(token)
		});

		let imageLink = "";
		try {
			imageLink = await imageResponse.json();
		} catch (error) {
			alert("Error while uploading the image.");
		}

		const postData = {
			applicationUserId: user.sub,
			categoryId: -1,
			description,
			imageLink
		};

		await fetch(`/api/posts/`, {
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				...getAuthorizationHeaders(token),
				"Content-Type": "application/json;charset=utf-8"
			}
		});

		onCreate();
		setImageFile(null);
		fileInputRef.current.value = null;
		setDescription("");
	};

	return (
		<>
			<Typography variant="h4">Share what motivates you</Typography>
			<form className={classes.root} noValidate autoComplete="off">
				<InputLabel htmlFor="file">Select an image</InputLabel>
				<input
					ref={fileInputRef}
					label="Image"
					type="file"
					name="file"
					accept="image/*"
					onChange={e => {
						setImageFile(e.target.files[0]);
					}}
				/>
				<TextField
					ref={descriptionInputRef}
					label="Description"
					value={description}
					multiline
					onChange={e => {
						setDescription(e.target.value);
					}}
				/>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={createPost}
						disabled={
							imageFile === null ||
							imageFile === undefined ||
							description.length === 0
						}
					>
						Create post
					</Button>
				</div>
			</form>
		</>
	);
};

export { PostCreate };

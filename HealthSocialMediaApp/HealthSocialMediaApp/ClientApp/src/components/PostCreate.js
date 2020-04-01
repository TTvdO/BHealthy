import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import authService from "./api-authorization/AuthorizeService";
import InputLabel from "@material-ui/core/InputLabel";
import { Button, TextField, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { keys } from "@material-ui/core/styles/createBreakpoints";

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
	const [dropdownChoiceId, setDropdownChoiceId] = useState(0);
	const [dropdownChoices, setDropdownChoices] = useState([]);

	const fileInputRef = useRef(null);
	const descriptionInputRef = useRef(null);

	useEffect(() => {
		authService.getAccessToken().then(token => {
			fetch(`/api/Categories/`, {
				headers: !token
					? {}
					: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json;charset=utf-8"
					  }
			})
				.then(response => {
					return response.json();
				})
				.then(allCategories => {
					setDropdownChoices(allCategories);
				});
		});
	}, []);

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
			categoryId: parseInt(dropdownChoiceId),
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
		setDropdownChoiceId(0);
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
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="category-native-helper">
					</InputLabel>
					<NativeSelect
						value={dropdownChoiceId}
						onChange={e => {
							setDropdownChoiceId(e.target.value);
						}}
						inputProps={{
							name: "category",
							id: "category-native-helper"
						}}
					>
						{dropdownChoices.map(category => (
							<option value={category.id} key={category.id}>
								{category.name}
							</option>
						))}
					</NativeSelect>
				</FormControl>
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

import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Button,
	TextField,
	Typography,
	NativeSelect,
	InputLabel
} from "@material-ui/core";

import { useFlags } from "launchdarkly-react-client-sdk";

import { fetchWithAuth, fetchJsonWithAuth } from "../hooks/useRestApiWithAuth";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

const useStyles = makeStyles(theme => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			width: "100%"
		}
	}
}));

const uploadImage = async imageFile => {
	const formdata = new FormData();
	formdata.append("file", imageFile, imageFile.name);

	const imageLink = await fetchJsonWithAuth(`/api/images`, {
		method: "POST",
		body: formdata
	});

	return imageLink;
};

const PostCreate = ({ onCreate }) => {
	const { imageUploader } = useFlags();
	const imageUploadFlag =
		imageUploader || process.env.NODE_ENV === "development";

	const currentUserId = useCurrentUserId();

	const classes = useStyles();

	const [imageFile, setImageFile] = useState(null);
	const [imageUrl, setImageLink] = useState("");

	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(0);

	const fileInputRef = useRef(null);

	useEffect(() => {
		fetchJsonWithAuth(`/api/Categories/`, {
			headers: { "Content-Type": "application/json;charset=utf-8" }
		}).then(allCategories => {
			setCategories(allCategories);
		});
	}, []);

	const createPost = async () => {
		let imageLink = "";
		if (imageUploadFlag) {
			imageLink = await uploadImage(imageFile);
			fileInputRef.current.value = null;
		} else {
			imageLink = imageUrl;
		}

		const postData = {
			applicationUserId: currentUserId,
			categoryId: parseInt(selectedCategory),
			description,
			imageLink
		};

		await fetchWithAuth(`/api/posts/`, {
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			}
		});

		onCreate();
		setImageFile(null);
		setDescription("");
		setSelectedCategory(0);
	};

	const getIsSubmitDisabled = () => {
		if (imageUploadFlag) {
			return (
				imageFile === null ||
				imageFile === undefined ||
				description.length === 0
			);
		}
		return imageUrl.length === 0 || description.length === 0;
	};

	return (
		<>
			<Typography variant="h4">Share what motivates you</Typography>
			<form className={classes.root} noValidate autoComplete="off">
				{imageUploadFlag && (
					<>
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
					</>
				)}
				{!imageUploadFlag && (
					<>
						<InputLabel>Provide a link to an image</InputLabel>
						<TextField
							label="Link to an image"
							onChange={e => {
								setImageLink(e.target.value);
							}}
						/>
					</>
				)}
				<TextField
					label="Description"
					value={description}
					multiline
					onChange={e => {
						setDescription(e.target.value);
					}}
				/>

				<NativeSelect
					value={selectedCategory}
					onChange={e => {
						setSelectedCategory(e.target.value);
					}}
					inputProps={{
						name: "category",
						id: "category-native-helper"
					}}
				>
					{categories.map(category => (
						<option value={category.id} key={category.id}>
							{category.name}
						</option>
					))}
				</NativeSelect>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={createPost}
						disabled={getIsSubmitDisabled()}
					>
						Create post
					</Button>
				</div>
			</form>
		</>
	);
};

export { PostCreate };

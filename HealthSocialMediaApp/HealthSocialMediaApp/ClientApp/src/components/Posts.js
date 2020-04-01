import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";

import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	IconButton,
	Typography,
	Avatar,
	Link
} from "@material-ui/core";

import { Like } from "./Like";

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 600,
		marginBottom: "60px"
	},
	media: {
		height: 0,
		paddingTop: "100%"
	},
	delete: {
		marginLeft: "auto"
	},
	avatar: {
		backgroundColor: blue[500]
	},
	chip: {
		marginTop: "20%"
	}
}));

const Posts = ({ posts, isLoading, error, onDelete, onLikeToggle }) => {
	const classes = useStyles();

	return (
		<>
			{isLoading && (
				<Typography variant="body1">Loading posts...</Typography>
			)}
			{!isLoading && error && (
				<Typography variant="body1">
					Could not fetch posts...
				</Typography>
			)}
			{posts.length === 0 && !isLoading && !error && (
				<Typography variant="body1">
					There are no posts created yet...
				</Typography>
			)}
			{posts.map(post => (
				<Card className={classes.root} key={post.id}>
					<CardHeader
						avatar={
							<Avatar
								aria-label="recipe"
								className={classes.avatar}
							>
								{post.userName[0] + post.userName[1]}
							</Avatar>
						}
						title={
							<Link
								component={RouterLink}
								to={`/user/${post.userId}`}
							>
								{post.userName}
							</Link>
						}
						subheader={new Date(post.createdAt).toLocaleString()}
						action={
							<Chip
								className={classes.chip}
								color="secondary"
								label={post.name}
							/>
						}
					/>
					<CardMedia
						className={classes.media}
						image={post.imageLink}
						title={post.description}
					/>
					<CardContent>
						<Typography variant="body2" color="textSecondary">
							{post.description}
						</Typography>
					</CardContent>
					<CardActions disableSpacing>
						<Like
							isLiked={post.isLikedByCurrentUser}
							onToggle={() => onLikeToggle(post)}
						/>
						<Typography>{post.amountOfLikes}</Typography>
						<IconButton
							className={classes.delete}
							aria-label="delete"
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to delete this post?"
									)
								) {
									onDelete(post.id);
								}
							}}
						>
							<DeleteIcon />
						</IconButton>
					</CardActions>
				</Card>
			))}
		</>
	);
};

export { Posts };

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

import {
	Card,
	Chip,
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

const useStyles = makeStyles(() => ({
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

const Posts = ({ posts, onDelete, onLikeToggle }) => {
	const classes = useStyles();

	const currentUserId = useCurrentUserId();

	return posts.map(post => (
		<Card className={classes.root} key={post.id}>
			<CardHeader
				avatar={
					<Avatar className={classes.avatar}>
						{post.userName[0] + post.userName[1]}
					</Avatar>
				}
				title={
					<Link component={RouterLink} to={`/user/${post.userId}`}>
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
				{currentUserId && (
					<>
						<Like
							isLiked={post.isLikedByCurrentUser}
							onToggle={() => onLikeToggle(post)}
						/>
						<Typography>{post.amountOfLikes}</Typography>
					</>
				)}
				{currentUserId && currentUserId === post.userId && (
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
				)}
			</CardActions>
		</Card>
	));
};

export { Posts };

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";

import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	IconButton,
	Typography,
	Avatar
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
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: "rotate(180deg)"
	},
	avatar: {
		backgroundColor: red[500]
	}
}));

const Posts = ({ posts, onDelete, onLike }) => {
	const classes = useStyles();

	return posts.map(post => (
		<Card className={classes.root} key={post.id}>
			<CardHeader
				avatar={
					<Avatar aria-label="recipe" className={classes.avatar}>
						{post.userName[0] + post.userName[1]}
					</Avatar>
				}
				action={
					<IconButton
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
				}
				title={post.userName}
				subheader={moment(post.createdAt, "YYYYMMDD").fromNow()}
			/>
			<CardMedia
				className={classes.media}
				image={post.imageLink}
				title={post.description}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{post.description}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<Like
					isLiked={post.isLikedByCurrentUser}
					onToggle={() => onLike(post)}
				/>
				<Typography>{post.amountOfLikes}</Typography>
			</CardActions>
		</Card>
	));
};

export { Posts };

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
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

const Posts = ({ posts, onDelete }) => {
	const classes = useStyles();

	return posts.map(item => (
		<Card className={classes.root} key={item.id}>
			<CardHeader
				avatar={
					<Avatar aria-label="recipe" className={classes.avatar}>
						{item.userName[0] + item.userName[1]}
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
								onDelete(item.id);
							}
						}}
					>
						<DeleteIcon />
					</IconButton>
				}
				title={item.userName}
				subheader={moment(item.createdAt, "YYYYMMDD").fromNow()}
			/>
			<CardMedia
				className={classes.media}
				image={item.imageLink}
				title={item.description}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{item.description}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label="add to favorites">
					<FavoriteIcon />
				</IconButton>
			</CardActions>
		</Card>
	));
};

export { Posts };

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import {
	Container,
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

const Posts = () => {
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const [data, setData] = useState({
		posts: [],
		isLoading: false,
		error: undefined
	});

	const getPosts = () => {
		setData({ posts: [], isLoading: true, error: undefined });

		fetch("/api/posts", {})
			.then(response => {
				return response.json();
			})
			.then(post => {
				setData({
					posts: post,
					isLoading: false,
					error: undefined
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	useEffect(() => {
		getPosts();
	}, [setData]);

	const deletePost = id => {
		fetch("/api/posts/" + id, { method: "DELETE" })
			.then(response => {
				getPosts();
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
		<Container maxWidth="sm">
			<h1>Explore</h1>
			{data.isLoading && <Typography>Loading posts...</Typography>}
			{!data.isLoading && data.error && (
				<Typography>Could not fetch posts</Typography>
			)}
			{data.posts.map((item, i) => (
				<Card className={classes.root}>
					<CardHeader
						avatar={
							<Avatar
								aria-label="recipe"
								className={classes.avatar}
							>
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
										deletePost(item.id);
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
						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
						>
							{item.description}
						</Typography>
					</CardContent>
					<CardActions disableSpacing>
						<IconButton aria-label="add to favorites">
							<FavoriteIcon />
						</IconButton>
						{/*
						// We can use this code for a share feature later
						<IconButton aria-label="share">
							<ShareIcon />
						</IconButton>
						*/}
						{/*
						// We can use this code for comments later
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded
							})}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
						>
							<ExpandMoreIcon />
						</IconButton> */}
					</CardActions>
					{/*
						// We can use this code for comments later
					<Collapse in={expanded} timeout="auto" unmountOnExit>
						<CardContent>
							<Typography paragraph>Comments:</Typography>
							<Typography paragraph>
								Comments are turned of.
							</Typography>
						</CardContent>
					</Collapse>*/}
				</Card>
			))}
		</Container>
	);
};

export { Posts };

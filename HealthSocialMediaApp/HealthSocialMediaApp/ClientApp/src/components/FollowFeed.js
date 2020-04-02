import React from "react";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	},
	avatar: {
		backgroundColor: blue[500],
		margin: "auto"
	}
}));

const FollowFeed = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
			<Grid container spacing={1}>
				{props.listOfUsers.length === 0 && <h2>No users found</h2>}
				{props.listOfUsers.map(user => (
					<Grid item xs={12}>
						<Paper className={classes.paper}>
							<Avatar
								aria-label="recipe"
								className={classes.avatar}
							>
								{user.userName[0] + user.userName[1]}
							</Avatar>
							<Link
								component={RouterLink}
								to={`/user/${user.id}`}
								key={user.id}
							>
								{user.userName}
							</Link>
						</Paper>
					</Grid>
				))}
			</Grid>
		</div>
    )
}

export { FollowFeed };
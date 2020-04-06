import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Avatar, Link, Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

const UsersList = ({ users }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Grid container spacing={1}>
				{users.length === 0 && <Typography>No users found</Typography>}
				{users.map(user => (
					<Grid item xs={12} key={user.id}>
						<Paper className={classes.paper}>
							<Avatar className={classes.avatar}>
								{user.userName[0] + user.userName[1]}
							</Avatar>
							<Link
								component={RouterLink}
								to={`/user/${user.id}`}
							>
								{user.userName}
							</Link>
						</Paper>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export { UsersList };

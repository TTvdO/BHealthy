import React from "react";

import { Typography, Grid, Avatar, Button, Box } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
	media: {
		width: "100%",
		maxWidth: "150px",
		height: "150px",
		[theme.breakpoints.down("sm")]: {
			margin: "0 auto 20px auto"
		},
		backgroundColor: blue[500]
	},
	profileInfo: {
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column"
		}
	},
	profileInfoItem: {
		marginRight: "1rem",
		[theme.breakpoints.down("sm")]: {
			marginRight: "initial"
		}
	}
}));

const UserProfileInfo = ({
	user,
	onUnfollow,
	amountOfPosts,
	onFollow,
	isOwnProfile,
	isFollowingThisUser
}) => {
	const classes = useStyles();

	return (
		<>
			<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
				<Avatar className={classes.media}>
					<Typography variant="h2">
						{user.userName[0] + user.userName[1]}
					</Typography>
				</Avatar>
			</Grid>
			<Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					<Typography variant="h4">{user.userName}</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					<Box display="flex" className={classes.profileInfo}>
						<Box className={classes.profileInfoItem}>
							<Typography variant="h6">Posts</Typography>
							<Typography>{amountOfPosts}</Typography>
						</Box>
						<Box className={classes.profileInfoItem}>
							<Typography variant="h6">Follows</Typography>
							<Typography>{user.followees.length}</Typography>
						</Box>
						<Box className={classes.profileInfoItem}>
							<Typography variant="h6">Followers</Typography>
							<Typography>{user.followers.length}</Typography>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					{!isOwnProfile && isFollowingThisUser && (
						<Button
							variant="contained"
							color="secondary"
							onClick={onUnfollow}
						>
							Unfollow
						</Button>
					)}
					{!isOwnProfile && !isFollowingThisUser && (
						<Button
							variant="contained"
							color="primary"
							onClick={onFollow}
						>
							Follow
						</Button>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export { UserProfileInfo };
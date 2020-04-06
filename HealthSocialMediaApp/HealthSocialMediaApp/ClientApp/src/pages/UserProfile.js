import React from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Container } from "@material-ui/core";

import { Posts } from "../components/Posts";
import { UserProfileInfo } from "../components/UserProfileInfo";

import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { useRestApiWithAuth, fetchWithAuth } from "../hooks/useRestApiWithAuth";
import { usePostData } from "../hooks/usePostData";

const useStyles = makeStyles(theme => ({
	itemAlign: {
		marginTop: "50px",
		[theme.breakpoints.down("sm")]: {
			textAlign: "center"
		}
	}
}));

const UserProfile = () => {
	let { userId } = useParams();

	const [
		{ data: user, error: userError },
		fetchUserData
	] = useRestApiWithAuth(`/api/users/${userId}`, null);

	const classes = useStyles();

	const currentUserId = useCurrentUserId();

	const isOwnProfile = userId === currentUserId;
	const isFollowingThisUser =
		user &&
		user.followers.some(followerId => {
			return followerId === currentUserId;
		});

	const handleFollow = async () => {
		await fetchWithAuth(
			`/api/users/follow?followerId=${currentUserId}&followeeId=${user.id}`,
			{
				method: "PUT"
			}
		);
		fetchUserData();
	};

	const handleUnfollow = async () => {
		await fetchWithAuth(
			`/api/users/unfollow?followerId=${currentUserId}&followeeId=${user.id}`,
			{
				method: "PUT"
			}
		);
		fetchUserData();
	};

	const [
		{ posts, error: postsError },
		{ handleDelete, handleLikeToggle }
	] = usePostData(currentUserId, userId);

	return (
		<Container maxWidth="md">
			<Grid container className={classes.itemAlign}>
				{user && (
					<UserProfileInfo
						user={user}
						onFollow={handleFollow}
						onUnfollow={handleUnfollow}
						isOwnProfile={isOwnProfile}
						isFollowingThisUser={isFollowingThisUser}
						amountOfPosts={posts.length}
					></UserProfileInfo>
				)}

				{posts && (
					<Grid
						container
						justify="space-evenly"
						className={classes.itemAlign}
					>
						<Posts
							posts={posts}
							onDelete={handleDelete}
							onLikeToggle={handleLikeToggle}
						></Posts>
					</Grid>
				)}

				{(postsError || userError) && (
					<Typography>Error while loading profile.</Typography>
				)}
			</Grid>
		</Container>
	);
};

export { UserProfile };

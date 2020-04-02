import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Container } from "@material-ui/core";

import authService from "./api-authorization/AuthorizeService";

import { Posts } from "./Posts";
import { UserProfileInfo } from "./UserProfileInfo";

import { useCurrentUserId } from "./data-hooks/useCurrentUserId";
import { useUserData } from "./data-hooks/useUserData";
import { usePostData } from "./data-hooks/usePostData";

const useStyles = makeStyles(theme => ({
	itemAlign: {
		marginTop: "50px",
		[theme.breakpoints.down("sm")]: {
			textAlign: "center"
		}
	}
}));

const getAuthorizationHeaders = token => {
	return token
		? {
				Authorization: `Bearer ${token}`
		  }
		: {};
};

const UserProfile = () => {
	let { userId } = useParams();

	const { user, isLoading: isUserLoading, error: userError } = useUserData(
		userId
	);

	const classes = useStyles();

	const currentUserId = useCurrentUserId();

	const [followingThisUser, setFollowingThisUser] = useState(false);
	const [isOwnProfile, setIsOwnProfile] = useState(true);

	useEffect(() => {
		setIsOwnProfile(userId === currentUserId);
	}, [userId, currentUserId]);

	useEffect(() => {
		authService.getAccessToken().then(token => {
			authService.getUser().then(userProf => {
				fetch(
					`/api/applicationusers/follow?currentUserId=${userProf.sub}&profileUserId=${userId}`,
					{
						headers: getAuthorizationHeaders(token)
					}
				)
					.then(response => {
						return response.json();
					})
					.then(isFollowingUser => {
						setFollowingThisUser(isFollowingUser);
					});
			});
		});
	}, [setFollowingThisUser, userId]);

	const handleFollow = async () => {
		setFollowingThisUser(true);
		const token = await authService.getAccessToken();
		const authorizationHeaders = getAuthorizationHeaders(token);
		await fetch(
			`/api/applicationusers/follow?userId=${currentUserId}&followUserName=${user.userName}`,
			{
				method: "PUT",
				headers: authorizationHeaders
			}
		);
	};

	const handleUnfollow = async () => {
		setFollowingThisUser(false);
		const token = await authService.getAccessToken();
		const authorizationHeaders = getAuthorizationHeaders(token);
		await fetch(
			`/api/applicationusers/unfollow?userId=${currentUserId}&followUserName=${user.userName}`,
			{
				method: "PUT",
				headers: authorizationHeaders
			}
		);
	};

	const [
		{ posts, isLoading: isPostsLoading, error: postsError },
		{ handleDelete, handleLikeToggle }
	] = usePostData(currentUserId, userId);

	return (
		<Container maxWidth="md">
			<Grid container className={classes.itemAlign}>
				{!isUserLoading && !userError && user && (
					<>
						<UserProfileInfo
							user={user}
							onFollow={handleFollow}
							onUnfollow={handleUnfollow}
							isOwnProfile={isOwnProfile}
							isFollowingThisUser={followingThisUser}
							amountOfPosts={posts.length}
						></UserProfileInfo>
					</>
				)}

				{!isUserLoading &&
					!isPostsLoading &&
					!userError &&
					!postsError && (
						<>
							<Grid
								container
								justify="space-evenly"
								className={classes.itemAlign}
							>
								<Posts
									posts={posts}
									isLoading={isPostsLoading}
									error={postsError}
									onDelete={handleDelete}
									onLikeToggle={handleLikeToggle}
								></Posts>
							</Grid>
						</>
					)}

				{(postsError || userError) && (
					<Typography>Error while loading profile.</Typography>
				)}
			</Grid>
		</Container>
	);
};

export default UserProfile;

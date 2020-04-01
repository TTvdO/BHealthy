import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Container, Avatar, Button } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

import authService from "./api-authorization/AuthorizeService";

import { Posts } from "./Posts";
import { usePostData } from "./usePostData";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	Media: {
		width: "100%",
		maxWidth: "150px",
		height: "150px",
		[theme.breakpoints.down("sm")]: {
			margin: "0 auto 20px auto"
		},
		backgroundColor: red[500]
	},
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
	let { userName } = useParams();

	const classes = useStyles();

	const [currentUserId, setUserId] = useState(null);
	const [isOwnProfile, setIsOwnProfile] = useState(true);
	const [followingThisUser, setFollowingThisUser] = useState(false);

	useEffect(() => {
		authService.getUser().then(user => {
			if (user) {
				setUserId(user.sub);
			} else {
				setUserId(null);
			}
		});
	}, [setUserId]);

	useEffect(() => {
		authService.getAccessToken().then(token => {
			authService.getUser().then(user => {
				fetch(
					`/api/applicationusers/follow?currentUserId=${user.sub}&profileUserName=${userName}`,
					{
						headers: !token
							? {}
							: {
									Authorization: `Bearer ${token}`,
									"Content-Type":
										"application/json;charset=utf-8"
							  }
					}
				)
					.then(response => {
						return response.json();
					})
					.then(arrayOfBooleans => {
						setFollowingThisUser(arrayOfBooleans[0]);
						setIsOwnProfile(arrayOfBooleans[1]);
					});
			});
		});
	}, [setFollowingThisUser]);

	const Follow = async () => {
		setFollowingThisUser(true);
		const token = await authService.getAccessToken();
		const authorizationHeaders = getAuthorizationHeaders(token);
		await fetch(
			`/api/applicationusers/follow?userId=${currentUserId}&followUserName=${userName}`,
			{
				method: "PUT",
				headers: authorizationHeaders
			}
		);
	};

	const Unfollow = async () => {
		setFollowingThisUser(false);
		const token = await authService.getAccessToken();
		const authorizationHeaders = getAuthorizationHeaders(token);
		await fetch(
			`/api/applicationusers/unfollow?userId=${currentUserId}&followUserName=${userName}`,
			{
				method: "PUT",
				headers: authorizationHeaders
			}
		);
	};

	const [
		{ posts, isLoading, error },
		{ handleDelete, handleLikeToggle }
	] = usePostData(currentUserId, userName);

	return (
		<>
			<Container maxWidth="md">
				<Grid container className={classes.itemAlign}>
					<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
						<Avatar className={classes.Media}>
							{userName[0] + userName[1]}
						</Avatar>
					</Grid>
					<Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							<Typography variant="h4">{userName}</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							<Typography>{posts.length} posts</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							{!isOwnProfile && followingThisUser && (
								<Button
									variant="contained"
									color="secondary"
									onClick={Unfollow}
								>
									Unfollow
								</Button>
							)}
							{!isOwnProfile && !followingThisUser && (
								<Button
									variant="contained"
									color="primary"
									onClick={Follow}
								>
									Follow
								</Button>
							)}
						</Grid>
					</Grid>
					<Container maxWidth="sm">
						<Typography variant="h5">{`${userName}'s posts`}</Typography>
					</Container>
					<Grid
						container
						justify="space-evenly"
						className={classes.itemAlign}
					>
						<Posts
							posts={posts}
							isLoading={isLoading}
							error={error}
							onDelete={handleDelete}
							onLikeToggle={handleLikeToggle}
						></Posts>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default UserProfile;

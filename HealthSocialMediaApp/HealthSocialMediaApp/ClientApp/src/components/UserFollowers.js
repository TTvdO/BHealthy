import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "./api-authorization/AuthorizeService";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { FollowFeed } from "./FollowFeed";

const UserFollowers = () => {
	let { userId } = useParams();

	const [listOfFollowers, setListOfFollowers] = useState([]);

	useEffect(() => {
		authService.getAccessToken().then(token => {
			authService.getUser().then(user => {
				fetch(
					`/api/applicationusers/followers?profileUserId=${userId}&currentUserId=${user.sub}`,
					{
						headers: token
                        ? {
                                Authorization: `Bearer ${token}`
                          }
                        : {}
					}
				)
					.then(response => {
						return response.json();
					})
					.then(listOfAllFollowers => {
						setListOfFollowers(listOfAllFollowers);
					});
			});
		});
	}, []);

	return (
        <FollowFeed listOfUsers={listOfFollowers}></FollowFeed>
	);
};

export { UserFollowers };

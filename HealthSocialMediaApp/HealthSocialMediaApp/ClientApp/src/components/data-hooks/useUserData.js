import { useState, useEffect } from "react";

import authService from "../api-authorization/AuthorizeService";

async function fetchUserData(userId) {
	const token = await authService.getAccessToken();
	const response = await fetch(`/api/applicationusers/${userId}`, {
		headers: !token
			? {}
			: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json;charset=utf-8"
			  }
	});

	const responseJson = await response.json();

	if (responseJson.status) {
		if (!(responseJson.status >= 200 && responseJson < 300)) {
			throw new Error("Fetching error");
		}
	}

	return responseJson;
}

/**
 * Use this for getting user data only
 * @param {*} userId the user to get data from
 */
function useUserData(userId) {
	const [userData, setUserData] = useState({
		user: null,
		isLoading: false,
		error: null
	});

	useEffect(() => {
		setUserData({ user: null, isLoading: true, error: null });
		fetchUserData(userId)
			.then(user => {
				setUserData({
					user: user,
					isLoading: false,
					error: null
				});
			})
			.catch(error => {
				setUserData({
					user: null,
					isLoading: false,
					error
				});
			});
	}, [setUserData, userId]);

	return userData;
}

export { useUserData, fetchUserData };

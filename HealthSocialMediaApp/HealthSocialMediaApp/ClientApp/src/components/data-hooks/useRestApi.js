import { useState, useEffect, useCallback } from "react";

/**
 * Use this for getting user data only
 * @param {*} userId the user to get data from
 */
function useRestApi(initialUrl, initialData) {
	const [data, setData] = useState(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(() => {
		setIsLoading(true);
		fetch(initialUrl)
			.then(response => {
				return response.json();
			})
			.then(dataRes => {
				setData(dataRes);
				setIsLoading(false);
			})
			.catch(errorMsg => {
				setError(errorMsg);
				setIsLoading(false);
			});
	}, [initialUrl]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return [{ data, isLoading, error }, fetchData];
}

export { useRestApi };

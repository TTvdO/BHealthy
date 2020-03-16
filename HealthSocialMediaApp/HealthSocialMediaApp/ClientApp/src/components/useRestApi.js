import { useState, useEffect, useCallback } from "react";

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
			.then(data => {
				setData(data);
				setIsLoading(false);
			})
			.catch(error => {
				setError(error);
				setIsLoading(false);
			});
	}, [initialUrl]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return [{ data, isLoading, error }, fetchData];
}

export { useRestApi };

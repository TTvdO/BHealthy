import authService from "./api-authorization/AuthorizeService";
import { useRestApi } from "./useRestApi";

function usePostData(currentUserId, userName) {
	const [{ data: posts, isLoading, error }, fetchData] = useRestApi(
		`/api/posts?currentUserId=${currentUserId}&userId=${userName}`,
		[]
	);

	const handleDelete = id => {
		fetch(`/api/posts/${id}`, { method: "DELETE" })
			.then(() => {
				fetchData();
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleLikeToggle = post => {
		authService.getAccessToken().then(token => {
			if (!post.isLikedByCurrentUser) {
				fetch(`/api/posts/${post.id}/like?userId=${currentUserId}`, {
					method: "PUT",
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(() => {
					fetchData();
				});
			} else {
				fetch(`/api/posts/${post.id}/unlike?userId=${currentUserId}`, {
					method: "PUT",
					headers: !token
						? {}
						: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json;charset=utf-8"
						  }
				}).then(() => {
					fetchData();
				});
			}
		});
	};

	return [
		{ posts, isLoading, error },
		{ fetchPosts: fetchData, handleDelete, handleLikeToggle }
	];
}

export { usePostData };

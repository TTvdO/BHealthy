import authService from "./api-authorization/AuthorizeService";
import { useRestApi } from "./useRestApi";

function usePostData(currentUserId, userName) {
	const [{ data: posts, isLoading, error }, fetchPosts] = useRestApi(
		`/api/posts?currentUserId=${currentUserId}&userId=${userName}`,
		[]
	);

	const handleDelete = id => {
		fetch(`/api/posts/${id}`, { method: "DELETE" })
			.then(() => {
				fetchPosts();
			})
			.catch(error => {
				console.error("Could not delete posts. Error message: ", error);
			});
	};

	const handleLikeToggle = post => {
		authService.getAccessToken().then(token => {
			const authorizationHeaders = !token
				? {}
				: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json;charset=utf-8"
				  };

			if (!post.isLikedByCurrentUser) {
				fetch(`/api/posts/${post.id}/like?userId=${currentUserId}`, {
					method: "PUT",
					headers: authorizationHeaders
				}).then(() => {
					fetchPosts();
				});
			} else {
				fetch(`/api/posts/${post.id}/unlike?userId=${currentUserId}`, {
					method: "PUT",
					headers: authorizationHeaders
				}).then(() => {
					fetchPosts();
				});
			}
		});
	};

	return [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	];
}

export { usePostData };

import authService from "./api-authorization/AuthorizeService";
import { useRestApi } from "./useRestApi";

const getAuthorizationHeaders = token => {
	return token
		? {
				Authorization: `Bearer ${token}`
		  }
		: {};
};

function usePostData(currentUserId, userName) {
	let url = `/api/posts?currentUserId=${currentUserId}`;
	if (userName) {
		url = `/api/posts?currentUserId=${currentUserId}&userName=${userName}`;
	}
	const [{ data: posts, isLoading, error }, fetchPosts] = useRestApi(url, []);

	const handleDelete = async id => {
		const token = await authService.getAccessToken();
		try {
			await fetch(`/api/posts/${id}`, {
				method: "DELETE",
				headers: getAuthorizationHeaders(token)
			});
			fetchPosts();
		} catch (error) {
			console.error("Could not delete posts. Error message: ", error);
		}
	};

	const handleLikeToggle = async post => {
		const token = await authService.getAccessToken();
		const authorizationHeaders = getAuthorizationHeaders(token);

		if (!post.isLikedByCurrentUser) {
			await fetch(`/api/posts/${post.id}/like?userId=${currentUserId}`, {
				method: "PUT",
				headers: authorizationHeaders
			});
		} else {
			await fetch(
				`/api/posts/${post.id}/unlike?userId=${currentUserId}`,
				{
					method: "PUT",
					headers: authorizationHeaders
				}
			);
		}
		fetchPosts();
	};

	return [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	];
}

export { usePostData };

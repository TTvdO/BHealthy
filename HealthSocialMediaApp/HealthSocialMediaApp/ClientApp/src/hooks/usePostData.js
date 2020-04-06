import { useRestApi } from "./useRestApi";
import { fetchWithAuth } from "./useRestApiWithAuth";

function usePostData(currentUserId, userId, following) {
	let url = `/api/posts?currentUserId=${currentUserId}`;
	if (userId) {
		url = url + `&userId=${userId}`;
	}
	if (following) {
		url = url + `&following=${true}`;
	}
	const [{ data: posts, isLoading, error }, fetchPosts] = useRestApi(url, []);

	const handleDelete = async id => {
		try {
			await fetchWithAuth(`/api/posts/${id}`, {
				method: "DELETE"
			});
			fetchPosts();
		} catch (errMsg) {
			console.error("Could not delete posts. Error message: ", errMsg);
		}
	};

	const handleLikeToggle = async post => {
		if (!post.isLikedByCurrentUser) {
			await fetchWithAuth(
				`/api/posts/${post.id}/like?userId=${currentUserId}`,
				{
					method: "PUT"
				}
			);
		} else {
			await fetchWithAuth(
				`/api/posts/${post.id}/unlike?userId=${currentUserId}`,
				{
					method: "PUT"
				}
			);
		}
		await fetchPosts();
	};

	return [
		{ posts, isLoading, error },
		{ fetchPosts, handleDelete, handleLikeToggle }
	];
}

export { usePostData };

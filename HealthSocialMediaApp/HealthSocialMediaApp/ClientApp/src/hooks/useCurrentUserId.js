import { useEffect, useState } from "react";

import authService from "../components/api-authorization/AuthorizeService";

function useCurrentUserId() {
	const [currentUserId, setCurrentUserId] = useState(null);

	useEffect(() => {
		authService.getUser().then(user => {
			if (user !== null) {
				setCurrentUserId(user.sub);
			}
		});
	}, [setCurrentUserId]);

	return currentUserId;
}

export { useCurrentUserId };

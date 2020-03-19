import React from "react";
import { IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { red, grey } from "@material-ui/core/colors";

const Like = ({ isLiked, onToggle }) => {
	return (
		<IconButton aria-label="like" onClick={onToggle}>
			<FavoriteIcon style={{ color: isLiked ? red[500] : grey[500] }} />
		</IconButton>
	);
};

export { Like };

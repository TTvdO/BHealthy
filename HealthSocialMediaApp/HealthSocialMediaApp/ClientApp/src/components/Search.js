import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import authService from "./api-authorization/AuthorizeService";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	searchDiv: {
		marginTop: "16px",
		flexGrow: 1
	},
	searchComponent: {
		display: "flex"
	},
	searchGridPaper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	},
	searchInput: {
		height: "100%",
		width: "100%"
	},
	searchIcon: {
		marginTop: "3px",
		marginRight: "10px"
	},
	individualUser: {
		margin: "10px"
	}
}));

const Search = () => {
	const classes = useStyles();

	const [query, setQuery] = useState("");
	const [users, setUsers] = useState([]);

	const handleKeyDown = e => {
		if (e.key === "Enter") {
			searchUsers();
		}
	};

	const searchUsers = () => {
		authService.getAccessToken().then(token => {
			fetch(`/api/search?searchInput=${query}`, {
				headers: !token
					? {}
					: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json;charset=utf-8"
					  }
			})
				.then(response => {
					return response.json();
				})
				.then(data => {
					setUsers(data);
				});
		});
	};

	return (
		<div className={classes.searchDiv}>
			<Grid height="100%" className={classes.searchGrid} xs={12}>
				<Paper className={classes.searchGridPaper}>
					<div className={classes.searchComponent}>
						<SearchIcon className={classes.searchIcon}></SearchIcon>
						<InputBase
							className={classes.searchInput}
							placeholder="Search..."
							onChange={event => setQuery(event.target.value)}
							onKeyDown={event => handleKeyDown(event)}
						></InputBase>
					</div>
				</Paper>
			</Grid>
			<div>
				{!users.length > 0 && <h2>No results found</h2>}
				{users.length > 0 &&
					users.map((user, index) => {
						return (
							<div className={classes.individualUser}>
								<Link
									component={RouterLink}
									to={`/user/${user.id}`}
									key={index}
								>
									{user.userName}
								</Link>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export { Search };

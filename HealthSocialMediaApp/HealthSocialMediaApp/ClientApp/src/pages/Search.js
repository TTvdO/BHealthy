import React, { useState } from "react";

import SearchIcon from "@material-ui/icons/Search";
import { InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { UsersList } from "../components/UsersList";
import { useRestApiWithAuth } from "../hooks/useRestApiWithAuth";

const useStyles = makeStyles(theme => ({
	searchDiv: {
		marginTop: "16px",
		flexGrow: 1
	},
	searchComponent: {
		display: "flex"
	},
	searchPaper: {
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

	const [{ data: users, isLoading }] = useRestApiWithAuth(
		`/api/search?searchInput=${query}`,
		[]
	);

	return (
		<div className={classes.searchDiv}>
			<Paper className={classes.searchPaper}>
				<div className={classes.searchComponent}>
					<SearchIcon className={classes.searchIcon}></SearchIcon>
					<InputBase
						className={classes.searchInput}
						placeholder="Search..."
						onChange={event => setQuery(event.target.value)}
					></InputBase>
				</div>
			</Paper>
			<br></br>
			{!isLoading && users && <UsersList users={users}></UsersList>}
		</div>
	);
};

export { Search };

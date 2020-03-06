import React from "react";
import { Link as RouterLink } from "react-router-dom";

import {
	AppBar,
	Button,
	CssBaseline,
	Container,
	Toolbar,
	Typography
} from "@material-ui/core";

import { LoginMenu } from "./api-authorization/LoginMenu";

import "typeface-roboto";

const Layout = ({ children }) => {
	return (
		<>
			<CssBaseline />
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6">BHealthy</Typography>
					<Button component={RouterLink} to="/" color="inherit">
						Home
					</Button>

					<LoginMenu></LoginMenu>
				</Toolbar>
			</AppBar>

			<Container maxWidth="md">{children}</Container>
		</>
	);
};

export { Layout };

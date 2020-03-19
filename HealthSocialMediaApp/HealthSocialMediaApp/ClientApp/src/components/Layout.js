import React from "react";
import { Link as RouterLink } from "react-router-dom";

import {
	AppBar,
	Button,
	CssBaseline,
	Toolbar,
	Typography,
	Container
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
					<Button
						component={RouterLink}
						to="/PrivacyPolicy"
						color="inherit"
					>
						PrivacyPolicy
					</Button>
				</Toolbar>
			</AppBar>

			<Container maxWidth="md">{children}</Container>
		</>
	);
};

export { Layout };

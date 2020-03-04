import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { LoginMenu } from "./api-authorization/LoginMenu";

import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	Button
} from "@material-ui/core";

const Layout = ({ children }) => {
	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
					<Typography variant="h6">HealthSocialMediaApp</Typography>
					<Button component={RouterLink} to="/" color="inherit">
						Home
					</Button>

					<LoginMenu></LoginMenu>
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg">{children}</Container>
		</>
	);
};

export { Layout };

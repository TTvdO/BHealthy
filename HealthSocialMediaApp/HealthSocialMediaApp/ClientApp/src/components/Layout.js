import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "typeface-roboto";
import clsx from "clsx";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";

import MenuIcon from "@material-ui/icons/Menu";

import {
	AppBar,
	CssBaseline,
	Toolbar,
	Typography,
	Container,
	IconButton,
	List,
	Divider,
	ListItem,
	ListItemText,
	SwipeableDrawer
} from "@material-ui/core";

import { LoginMenu } from "./api-authorization/LoginMenu";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#44b98a"
		},
		secondary: {
			main: "#FFFFFF"
		}
	}
});

const useStyles = makeStyles(theme => ({
	outerContainer: {
		position: "relative",
		height: "100vh"
	},
	putBottom: {
		position: "absolute",
		bottom: "20px",
		width: "100%"
	},
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	list: {
		width: 250,
		overflow: "hidden"
	},
	fullList: {
		width: "auto"
	},
	pushBottom: {
		margin: "0 auto"
	},
	siteTitle: {
		textDecorationLine: "none"
	}
}));

const Layout = ({ children }) => {
	const classes = useStyles();

	const currentUserId = useCurrentUserId();

	// Menu Drawer
	const [menuState, setMenuState] = useState({
		left: false
	});

	const toggleDrawer = (anchor, open) => event => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setMenuState({ ...menuState, [anchor]: open });
	};

	const list = anchor => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === "top" || anchor === "bottom"
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				<div className={classes.outerContainer}>
					<ListItemText>
						<Typography variant="h6" align="center">
							BHealthy
						</Typography>
					</ListItemText>
					<Divider />
					<ListItem
						button
						component={RouterLink}
						to="/"
						color="inherit"
					>
						<ListItemText>Home</ListItemText>
					</ListItem>
					{currentUserId && (
						<>
							<Divider />
							<ListItem
								button
								component={RouterLink}
								to="/Following"
								color="inherit"
							>
								<ListItemText>Following</ListItemText>
							</ListItem>
							<Divider />
						</>
					)}

					{currentUserId && (
						<ListItem
							button
							component={RouterLink}
							to={`/user/${currentUserId}`}
							color="inherit"
						>
							<ListItemText>My Profile</ListItemText>
						</ListItem>
					)}
					<Divider />
					<ListItem
						button
						component={RouterLink}
						to="/search"
						color="inherit"
					>
						<ListItemText>Search</ListItemText>
					</ListItem>
					<Divider />
					<div className={classes.grow}>
						<div className={classes.putBottom}>
							{currentUserId && (
								<ListItem
									button
									component={RouterLink}
									to={`/account`}
									color="inherit"
								>
									<ListItemText>My Account</ListItemText>
								</ListItem>
							)}
							<Divider />
							<ListItem
								button
								component={RouterLink}
								to="/privacy-policy"
								color="inherit"
							>
								<ListItemText>Privacy policy</ListItemText>
							</ListItem>
						</div>
					</div>
				</div>
			</List>
		</div>
	);

	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className={classes.grow}>
					<AppBar position="static" style={{ background: "#44b98a" }}>
						<Toolbar>
							{["left"].map(anchor => (
								<React.Fragment key={anchor}>
									<IconButton
										edge="start"
										className={classes.menuButton}
										color="secondary"
										aria-label="open drawer"
										onClick={toggleDrawer(anchor, true)}
									>
										<MenuIcon />
									</IconButton>
									<SwipeableDrawer
										anchor={anchor}
										open={menuState[anchor]}
										onClose={toggleDrawer(anchor, false)}
										onOpen={toggleDrawer(anchor, true)}
									>
										{list(anchor)}
									</SwipeableDrawer>
								</React.Fragment>
							))}
							<Typography
								className={classes.siteTitle}
								color="secondary"
								variant="h6"
								noWrap
								component={RouterLink}
								to="/"
							>
								BHealthy
							</Typography>
							<div className={classes.grow} />
							<div>
								<LoginMenu></LoginMenu>
							</div>
						</Toolbar>
					</AppBar>
				</div>
				<Container maxWidth="md">{children}</Container>
			</ThemeProvider>
		</>
	);
};

export { Layout };

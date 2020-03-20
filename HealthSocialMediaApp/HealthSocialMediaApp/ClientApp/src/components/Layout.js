import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "typeface-roboto";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";

import {
	AppBar,
	CssBaseline,
	Toolbar,
	Typography,
	Container,
	IconButton,
	MenuItem,
	Menu,
	List,
	Divider,
	ListItem,
	ListItemText,
	SwipeableDrawer
} from "@material-ui/core";

import { LoginMenu } from "./api-authorization/LoginMenu";
import authService from "./api-authorization/AuthorizeService";

const useStyles = makeStyles(theme => ({
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex"
		}
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none"
		}
	},
	list: {
		width: 250
	},
	fullList: {
		width: "auto"
	}
}));

const Layout = ({ children }) => {
	const [userName, setUserName] = useState("");

	useEffect(() => {
		authService.getUser().then(user => {
			if (user !== null) {
				setUserName(user.name);
			}
		});
	}, [setUserName]);

	const classes = useStyles();

	//Menu
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	// Menu Drawer
	const [state, setState] = React.useState({
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

		setState({ ...state, [anchor]: open });
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
				<ListItemText>
					<Typography variant="h6" align="center">
						BHealthy
					</Typography>
				</ListItemText>
				<Divider />
				<ListItem button component={RouterLink} to="/" color="inherit">
					<ListItemText>Home</ListItemText>
				</ListItem>
				<Divider />
				<ListItem
					button
					component={RouterLink}
					to="/privacy-policy"
					color="inherit"
				>
					<ListItemText>Privacy policy</ListItemText>
				</ListItem>
			</List>
		</div>
	);

	const handleProfileMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = event => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem
				onClick={handleMenuClose}
				component={RouterLink}
				to={`./user/${userName}`}
				color="inherit"
			>
				Profile
			</MenuItem>
			<MenuItem
				onClick={handleMenuClose}
				component={RouterLink}
				to={`./account`}
			>
				My account
			</MenuItem>
			<MenuItem>
				<LoginMenu></LoginMenu>
			</MenuItem>
		</Menu>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="false"
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<>
			<CssBaseline />
			<div className={classes.grow}>
				<AppBar position="static">
					<Toolbar>
						{["left"].map(anchor => (
							<React.Fragment key={anchor}>
								<IconButton
									edge="start"
									className={classes.menuButton}
									color="inherit"
									aria-label="open drawer"
									onClick={toggleDrawer(anchor, true)}
								>
									<MenuIcon />
								</IconButton>
								<SwipeableDrawer
									anchor={anchor}
									open={state[anchor]}
									onClose={toggleDrawer(anchor, false)}
									onOpen={toggleDrawer(anchor, true)}
								>
									{list(anchor)}
								</SwipeableDrawer>
							</React.Fragment>
						))}
						<Typography
							className={classes.title}
							variant="h6"
							noWrap
						>
							BHealty
						</Typography>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<IconButton
								edge="end"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								onClick={handleProfileMenuOpen}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
						</div>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{renderMobileMenu}
				{renderMenu}
			</div>

			<Container maxWidth="md">{children}</Container>
		</>
	);
};

export { Layout };

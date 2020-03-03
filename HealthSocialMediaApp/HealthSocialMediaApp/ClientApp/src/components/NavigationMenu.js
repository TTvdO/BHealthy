import React, { useState } from "react";
import {
	Collapse,
	Container,
	Navbar,
	NavbarBrand,
	NavbarToggler,
	NavItem,
	NavLink
} from "reactstrap";
import { Link } from "react-router-dom";
import { LoginMenu } from "./api-authorization/LoginMenu";
import "./NavMenu.css";

const NavigationMenu = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleToggle = () => {
		setIsCollapsed(isCollapsed => !isCollapsed);
	};

	return (
		<header>
			<Navbar
				className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
				light
			>
				<Container>
					<NavbarBrand tag={Link} to="/">
						HealthSocialMediaApp
					</NavbarBrand>
					<NavbarToggler onClick={handleToggle} className="mr-2" />
					<Collapse
						className="d-sm-inline-flex flex-sm-row-reverse"
						isOpen={isCollapsed}
						navbar
					>
						<ul className="navbar-nav flex-grow">
							<NavItem>
								<NavLink
									tag={Link}
									className="text-dark"
									to="/"
								>
									Home
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									tag={Link}
									className="text-dark"
									to="/counter"
								>
									Counter
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									tag={Link}
									className="text-dark"
									to="/fetch-data"
								>
									Fetch data
								</NavLink>
							</NavItem>
							<LoginMenu></LoginMenu>
						</ul>
					</Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export { NavigationMenu };

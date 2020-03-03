import React from "react";
import { Container } from "reactstrap";
import { NavigationMenu } from "./NavigationMenu";

const Layout = ({ children }) => {
	return (
		<div>
			<NavigationMenu />
			<Container>{children}</Container>
		</div>
	);
};

export { Layout };

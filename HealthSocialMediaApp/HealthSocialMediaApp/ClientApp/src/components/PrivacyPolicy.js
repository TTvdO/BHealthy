import React from "react";

const PrivacyPolicy = () => {
	return (
		<>
			<h2>What personal information is being collected?</h2>
			<p>
				Email address<br></br>Phone number<br></br>User name
			</p>
			<h2>How will your personal information be used?</h2>
			<p>
				The email address and phone number will be used for
				Authentication. The email address will be used for login
				purposes and the phone number will be used for 2 factor
				authentication.
			</p>
			<p>
				The other personal information that is stored is the username.
				The username is used to display your account to yourself and
				others.
			</p>
			<h2>How will your personal information be stored?</h2>
			<p>
				Your personal information will be stored on a private server
				hosted in datacenters in amsterdam, netherlands. The database is
				a MSSQL database protected against sql injection.
			</p>
			<h2>
				Are there security measures protecting your personal
				information?
			</h2>
			<p>
				We have been educated about database security and use this
				information to safeguard your information. Our encrypted access
				tokens are not accessible to the public.
			</p>
			<h2>
				How long will your personal information be kept by the company?
			</h2>
			<p>Your account will be stored for 5 years after last activity*.</p>
			<h2>Will your personal information be shared with others?</h2>
			<p>No.</p>
			<h2>How can you contact the company?</h2>
			<p>Email: 15090604@student.hhs.nl</p>
			<p>
				<sup>* an activity is posting or liking a post</sup>
			</p>
		</>
	);
};

export { PrivacyPolicy };

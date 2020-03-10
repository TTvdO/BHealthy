import React, { useState, useEffect } from "react";


const PrivacyPolicy = () => {
	return (
		<>
			<p><b>How will your personal information be used?</b></p>
			<p>Email address<br></br>Phone number<br></br>User name</p>
			<p><b>What personal information is being collected?</b></p>
			<p>The email address and phone number will be used for Authentication. The email address will be used for login purposes and the phone number will be used for 2 factor authentication.</p>
			<p>The other personal information that is stored is the username. The username is used to display your account to yourself and others.</p>
			<p><b>How will your personal information be stored?</b></p>
			<p>Your personal information will be stored on a private server hosted in datacenters in amsterdam, netherlands. The database is a MSSQL database protected against sql injection.</p>
			<p><b>Are there security measures protecting your personal information?</b></p>
			<p>We have been educated about database security and use this information to safeguard your information. Our encrypted access tokens are not accessible to the public.</p>
			<p><b>How long will your personal information be kept by the company?</b></p>
			<p>Your account will be stored for 5 years after last activity*.</p>
			<p><b>Will your personal information be shared with others?</b></p>
			<p>No.</p>
			<p><b>How can you contact the company?</b></p>
			<p>Email: 15090604@student.hhs.nl</p>
			<p><sup>* an activity is posting or liking a post</sup></p>
		</>
	);
}

export { PrivacyPolicy };
import React, { useState } from "react";

const ApplicationUser = () => {
	//TODO: https://stackoverflow.com/questions/55923610/is-there-any-way-to-update-multiple-usestatereact-hook-or-multiple-properties
	//multiple values useState
	const [state, setState] = useState({
		id: "",
		email: "",
		username: "",
		description: "",
		birthday: ""
	});

	const [temp, setTemp] = useState("");

	const handleState = () => {
		// setState(givenEmail => this.email);
	};

	console.log("temp", temp);

	// if (blabla) {
	//     return <div>Account created</div>
	// }

	const submitValue = () => {
		const formDetails = {
			id: state.id,
			email: state.email,
			username: state.username,
			description: state.description,
			birthday: state.birthday
		};
	};

	return (
		//moet je vervormen tot useState
		//const { id, username, } = this.state

		<div>
			<form>
				<label>temp </label>
				<input
					type="text"
					placeholder="..."
					onChange={e => setTemp(e.target.value)}
					style={{ display: "block" }}
				/>
				<label>temp </label>
				<input
					type="text"
					placeholder="..."
					onChange={e => setTemp(e.target.value)}
					style={{ display: "block" }}
				/>
				<label>temp </label>
				<input
					type="text"
					placeholder="..."
					onChange={e => setTemp(e.target.value)}
					style={{ display: "block" }}
				/>
				<label>ID </label>
				<input
					type="text"
					placeholder="..."
					onChange={e =>
						setState({
							...state,
							id: e.target.value
						})
					}
					value={state.id}
					style={{ display: "block" }}
				/>
				<label>Email </label>
				<input
					type="text"
					placeholder="..."
					onChange={e =>
						setState(previousState => ({
							...previousState,
							email: e.target.value
						}))
					}
					style={{ display: "block" }}
				/>
				<label>Username </label>
				<input
					type="text"
					name="username"
					//value={username}
					style={{ display: "block" }}
				/>
				<label>Description </label>
				<input
					type="text"
					name="description"
					//value={description}
					style={{ display: "block" }}
				/>
				<label>Birthday </label>
				<input
					type="text"
					name="birthday"
					//value={birthday}
					style={{ display: "block" }}
				/>
				{/* wanneer je op submit klikt moet je verwezen worden naar de Read van de CRUD operaties en moeten de waardes die je hebt opgegeven 
                mee worden gegeven. in de READ
                pagina wacht je met een HttpGet method en pak je de waardes daar. later met database */}
				{/* zie: https://stackoverflow.com/questions/49738249/react-router-v4-redirecting-on-form-submit */}

				{/* conditional rendering, inline if with logical && operator */}
				<button onClick={submitValue}>Submit</button>
			</form>
		</div>
	);
};
export { ApplicationUser };

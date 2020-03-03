import React, { useState } from "react";

const Counter = () => {
	const [count, setCount] = useState(0);

	const handleIncrement = () => {
		setCount(count => count + 1);
	};

	return (
		<div>
			<h1>Counter</h1>

			<p>This is a simple example of a React component.</p>

			<p aria-live="polite">
				Current count: <strong>{count}</strong>
			</p>

			<button className="btn btn-primary" onClick={handleIncrement}>
				Increment
			</button>
		</div>
	);
};
export { Counter };

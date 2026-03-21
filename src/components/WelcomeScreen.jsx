import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function WelcomeScreen() {
	const { login, loading, error, clearError } = useAuth();

	const handleLuffaLogin = async () => {
		clearError();
		// Simulate getting a userToken from Luffa Account
		const token = `dev_${Math.floor(Math.random() * 10000)}`;
		await login(token);
	};

	return (
		<div className="welcome-screen screen-glass">
			<div className="welcome-screen__content">
				<h1 className="welcome-screen__title">
					King Luffa
				</h1>
				<p className="welcome-screen__subtitle">
					Dominate the map. Claim your turf.
				</p>
				<button
					className="btn-premium"
					onClick={handleLuffaLogin}
					disabled={loading}
				>
					{loading
						? "Authenticating..."
						: "Login with Luffa Account"}
				</button>
				{error && (
					<p className="welcome-screen__error">
						{error}
					</p>
				)}
			</div>
		</div>
	);
}

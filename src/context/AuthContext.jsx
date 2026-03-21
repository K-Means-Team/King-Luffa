/**
 * Session state: initSession with userId, optional logout; exposes session for sockets and profile.
 */

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { initSession, logoutSession } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const login = useCallback(async (userId) => {
		setError(null);
		setLoading(true);
		try {
			const data = await initSession(userId);
			setSession({ ...data, userId: data.userId ?? userId });
			return data;
		} catch (e) {
			setError(e?.message || "Login failed");
			throw e;
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		const token = session?.jwtToken;
		await logoutSession(token);
		setSession(null);
	}, [session]);

	const value = useMemo(
		() => ({
			session,
			user: session?.user ?? null,
			sessionId: session?.sessionId ?? null,
			jwtToken: session?.jwtToken ?? null,
			error,
			loading,
			login,
			logout,
			clearError: () => setError(null),
		}),
		[session, error, loading, login, logout],
	);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

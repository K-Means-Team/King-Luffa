/**
 * Slide-in account panel: session summary and logout; closes on overlay click.
 */
import { previewImage } from "../services/wxService";

export function AccountSidebar({ open, onClose, session, onLogout }) {
	if (!open) return null;

	const handlePreview = () => {
		previewImage(
			[
				"https://img1.gtimg.com/10/1048/104857/10485731_980x1200_0.jpg",
				"https://img1.gtimg.com/10/1048/104857/10485726_980x1200_0.jpg",
				"https://img1.gtimg.com/10/1048/104857/10485729_980x1200_0.jpg",
			],
			"http://inews.gtimg.com/newsapp_bt/0/1693121381/641",
		).catch((err) => console.error("Preview failed:", err));
	};

	return (
		<>
			<div
				className="sidebar-backdrop"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) =>
					e.key === "Escape" && onClose()
				}
				aria-label="Close"
			/>
			<aside
				className="sidebar-panel"
				role="dialog"
				aria-label="Account"
			>
				<h2 className="sidebar-panel__title">
					<span>Account</span>
					<button
						className="sidebar-panel__close"
						onClick={onClose}
					>
						×
					</button>
				</h2>
				<dl className="sidebar-panel__dl">
					<dt>Session</dt>
					<dd>{session?.sessionId || "—"}</dd>
					<dt>User token</dt>
					<dd className="sidebar-panel__mono">
						{session?.userId
							? "••••" +
								String(
									session.userId,
								).slice(-6)
							: "—"}
					</dd>
					<dt>Avatar</dt>
					<dd>
						<button
							type="button"
							onClick={handlePreview}
							style={{
								padding: "4px 8px",
								fontSize: "12px",
								borderRadius:
									"4px",
								cursor: "pointer",
								background: "var(--color-primary, #6b21a8)",
								color: "#fff",
								border: "none",
							}}
						>
							Preview Images
						</button>
					</dd>
				</dl>
				<button
					type="button"
					className="sidebar-panel__logout"
					onClick={onLogout}
				>
					Log out
				</button>
			</aside>
		</>
	);
}

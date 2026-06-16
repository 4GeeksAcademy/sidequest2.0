import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Container,
	Card,
	Form,
	Button,
	Alert,
} from "react-bootstrap";
import {
	FiMail,
	FiLock,
	FiUserPlus,
	FiUser,
	FiBriefcase,
	FiStar,
	FiArrowLeft,
	FiAtSign,
	FiMapPin,
	FiTag,
} from "react-icons/fi";
import logoSideQuest from "../assets/img/logoSideQuest.png";

// Style coherent avec Friends / Profile / EventModal (dark mode, accents indigo)
const AUTH_CSS = `
.sq-auth-wrap {
	min-height: calc(100vh - 56px);
	display: flex;
	align-items: center;
	justify-content: center;
	background: radial-gradient(circle at top, #1a1d29 0%, #0b0d13 70%);
	padding: 4rem 1rem 2rem;
}
.sq-auth-card {
	background: #161922;
	color: #e9ecef;
	border: 1px solid #262a36;
	border-radius: 14px;
	max-width: 460px;
	width: 100%;
	box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}
.sq-auth-card .form-control,
.sq-auth-card .form-control:focus,
.sq-auth-card .form-select,
.sq-auth-card .form-select:focus {
	background-color: #0f111a !important;
	color: #e9ecef !important;
	border-color: #2a2f42 !important;
	box-shadow: none;
}
.sq-auth-card .form-control::placeholder { color: #6c757d; }
.sq-auth-card .form-label {
	color: #adb5bd;
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	margin-bottom: 0.35rem;
}
.sq-auth-title {
	font-weight: 700;
	background: linear-gradient(135deg, #6366f1, #ec4899);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}
.sq-auth-submit {
	background: linear-gradient(135deg, #6366f1, #4f46e5);
	border: none;
	font-weight: 600;
}
.sq-auth-submit:hover,
.sq-auth-submit:focus {
	background: linear-gradient(135deg, #4f46e5, #4338ca);
}
.sq-auth-link {
	color: #6366f1;
	text-decoration: none;
	font-weight: 600;
}
.sq-auth-link:hover { color: #ec4899; }

/* ── account-type chooser (3 buttons from the wireframe) ── */
.sq-type-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.75rem;
}
.sq-type-btn {
	display: flex;
	align-items: center;
	gap: 0.9rem;
	text-align: left;
	background: #0f111a;
	border: 1px solid #2a2f42;
	border-radius: 12px;
	color: #e9ecef;
	padding: 0.95rem 1.1rem;
	width: 100%;
	transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.sq-type-btn:hover {
	border-color: #6366f1;
	transform: translateY(-1px);
	box-shadow: 0 8px 24px rgba(99,102,241,0.18);
}
.sq-type-btn__icon {
	flex: 0 0 auto;
	width: 42px;
	height: 42px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #6366f1, #ec4899);
	color: #fff;
}
.sq-type-btn__title { font-weight: 600; line-height: 1.1; }
.sq-type-btn__sub { font-size: 0.78rem; color: #8a90a2; }
.sq-back-btn {
	color: #adb5bd;
	border: none;
	background: transparent;
	padding: 0;
	font-size: 0.85rem;
}
.sq-back-btn:hover { color: #6366f1; }
`;

const API = import.meta.env.VITE_BACKEND_URL;

// =============================================================
// ACCOUNT TYPE CHOOSER
// =============================================================
const TYPES = [
	{
		key: "person",
		title: "Register as a person",
		sub: "A regular SideQuest account",
		icon: <FiUser />,
	},
	{
		key: "business",
		title: "Register as a company",
		sub: "Restaurant, bar, café, brand…",
		icon: <FiBriefcase />,
	},
	{
		key: "influencer",
		title: "Register as an influencer",
		sub: "Share the places you go to",
		icon: <FiStar />,
	},
];

export const Register = () => {
	const navigate = useNavigate();

	// null = show the chooser; otherwise one of person|business|influencer
	const [accountType, setAccountType] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// shared fields
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// influencer-only
	const [homebase, setHomebase] = useState("");
	const [proEmail, setProEmail] = useState("");

	// business-only (first business; full setup comes after)
	const [bizName, setBizName] = useState("");
	const [bizCategory, setBizCategory] = useState("");

	const resetChoice = () => {
		setAccountType(null);
		setError(null);
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setError(null);

		const payload = {
			email,
			username,
			password,
			account_type: accountType,
		};
		if (accountType === "influencer") {
			payload.homebase = homebase || null;
			payload.professional_email = proEmail || null;
		}
		if (accountType === "business") {
			payload.business = {
				name: bizName,
				category: bizCategory || null,
			};
		}

		setSubmitting(true);
		try {
			const response = await fetch(`${API}/api/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await response.json();

			if (!response.ok) {
				setError(data.msg || "Error creating account");
				return;
			}

			navigate("/login?registered=1");
		} catch (err) {
			console.error("Register error:", err);
			setError("Server error — please try again");
		} finally {
			setSubmitting(false);
		}
	};

	const titleFor = {
		person: "Create your account",
		business: "Register your company",
		influencer: "Create your influencer profile",
	};

	return (
		<>
			<style>{AUTH_CSS}</style>

			<div className="sq-auth-wrap">
				<Container className="d-flex justify-content-center">
					<Card className="sq-auth-card p-4">
						<h2 className="sq-auth-title text-center mb-1">
							<img
								src={logoSideQuest}
								alt="SideQuest"
								style={{ filter: "brightness(0) invert(1)", height: "60px", width: "auto" }}
							/>
						</h2>

						{/* ── STEP 1: choose the account type ── */}
						{!accountType && (
							<>
								<p className="text-center text-secondary mb-4">
									How do you want to join SideQuest?
								</p>
								<div className="sq-type-grid">
									{TYPES.map((t) => (
										<button
											key={t.key}
											type="button"
											className="sq-type-btn"
											onClick={() => {
												setAccountType(t.key);
												setError(null);
											}}
										>
											<span className="sq-type-btn__icon">{t.icon}</span>
											<span>
												<span className="sq-type-btn__title d-block">{t.title}</span>
												<span className="sq-type-btn__sub">{t.sub}</span>
											</span>
										</button>
									))}
								</div>
							</>
						)}

						{/* ── STEP 2: the form for the chosen type ── */}
						{accountType && (
							<>
								<button type="button" className="sq-back-btn mb-3 d-inline-flex align-items-center" onClick={resetChoice}>
									<FiArrowLeft className="me-1" /> Choose a different type
								</button>

								<p className="text-center text-secondary mb-4">{titleFor[accountType]}</p>

								{error && (
									<Alert variant="danger" className="py-2">{error}</Alert>
								)}

								<Form onSubmit={handleRegister}>
									{/* Business: the owner's login is created with the company */}
									{accountType === "business" && (
										<>
											<Form.Group className="mb-3">
												<Form.Label><FiBriefcase className="me-2" /> Business name</Form.Label>
												<Form.Control
													value={bizName}
													onChange={(e) => setBizName(e.target.value)}
													placeholder="e.g. Café Aurora"
													required
												/>
											</Form.Group>
											<Form.Group className="mb-3">
												<Form.Label><FiTag className="me-2" /> Category</Form.Label>
												<Form.Select
													value={bizCategory}
													onChange={(e) => setBizCategory(e.target.value)}
												>
													<option value="">Select a category…</option>
													<option value="restaurant">Restaurant</option>
													<option value="bar">Bar</option>
													<option value="cafe">Café</option>
													<option value="brand">Clothing / brand</option>
													<option value="shop">Shop</option>
													<option value="other">Other</option>
												</Form.Select>
											</Form.Group>
										</>
									)}

									{/* Shared account credentials */}
									<Form.Group className="mb-3">
										<Form.Label><FiMail className="me-2" /> Email</Form.Label>
										<Form.Control
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Enter email"
											required
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label><FiAtSign className="me-2" /> Username</Form.Label>
										<Form.Control
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											placeholder="3-30 chars (letters, digits, . _ -)"
											required
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label><FiLock className="me-2" /> Password</Form.Label>
										<Form.Control
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="At least 6 characters"
											required
										/>
									</Form.Group>

									{/* Influencer extras */}
									{accountType === "influencer" && (
										<>
											<Form.Group className="mb-3">
												<Form.Label><FiMapPin className="me-2" /> Homebase</Form.Label>
												<Form.Control
													value={homebase}
													onChange={(e) => setHomebase(e.target.value)}
													placeholder="e.g. Lisbon"
												/>
											</Form.Group>
											<Form.Group className="mb-4">
												<Form.Label><FiMail className="me-2" /> Professional email</Form.Label>
												<Form.Control
													type="email"
													value={proEmail}
													onChange={(e) => setProEmail(e.target.value)}
													placeholder="contact@yourbrand.com"
												/>
											</Form.Group>
										</>
									)}

									{accountType === "business" && (
										<p className="text-secondary small mb-3">
											You'll add your location, opening hours, photo and posts
											right after, from your business profile.
										</p>
									)}

									<Button type="submit" className="sq-auth-submit w-100 py-2" disabled={submitting}>
										<FiUserPlus className="me-2" />
										{submitting ? "Creating…" : "Register"}
									</Button>
								</Form>
							</>
						)}

						<div className="text-center mt-4 text-secondary small">
							Already have an account?{" "}
							<Link to="/login" className="sq-auth-link">
								Log in
							</Link>
						</div>
					</Card>
				</Container>
			</div>
		</>
	);
};

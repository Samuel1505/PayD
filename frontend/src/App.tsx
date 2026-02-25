<<<<<<< OAuth2-Social-Login-Integration
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Debugger from "./pages/Debugger";
import PayrollScheduler from "./pages/PayrollScheduler";
import EmployeeEntry from "./pages/EmployeeEntry";
import AppLayout from "./components/AppLayout";
import HelpCenter from "./pages/HelpCenter";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorFallback from "./components/ErrorFallback";
import { OnboardingTour } from "./components/OnboardingTour";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

// ── Icon components ────────────────────────────────────────────────────────────

const PayrollIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

const EmployeesIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const DebugIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

// ── Page wrapper ───────────────────────────────────────────────────────────────

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="page-fade" style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
);

// ── AppLayout ──────────────────────────────────────────────────────────────────

const AppLayout: React.FC = () => {
    const location = useLocation();
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem("payd_tour_completed");
        if (!completed) {
            setRunTour(true);
        }
    }, []);

    const handleTourComplete = () => {
        setRunTour(false);
        localStorage.setItem("payd_tour_completed", "true");
    };

    const restartTour = () => {
        setRunTour(false);
        setTimeout(() => {
            setRunTour(true);
        }, 100);
    };

    return (
        <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* ── Header ── */}
            <header className="app-header noise" style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                height: "var(--header-h)",
                display: "flex", alignItems: "center",
                padding: "0 24px",
                background: "rgba(8,11,16,0.85)",
                backdropFilter: "blur(20px) saturate(180%)",
                borderBottom: "1px solid var(--border)",
                gap: "24px"
            }}>
                {/* Logo */}
                <NavLink id="tour-logo" to="/" className="logo-lockup" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <div className="logo-mark" style={{
                        width: "32px", height: "32px",
                        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                        borderRadius: "8px",
                        display: "grid", placeItems: "center",
                        fontSize: "14px", fontWeight: 800, color: "#000", letterSpacing: "-0.5px",
                        boxShadow: "0 0 20px rgba(74,240,184,0.3)",
                        position: "relative", overflow: "hidden"
                    }}>P</div>
                    <span className="logo-name" style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                        Pay<span style={{ color: "var(--accent)" }}>D</span>
                    </span>
                    <span className="logo-tag" style={{
                        fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 400, color: "var(--muted)",
                        letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid var(--border-hi)",
                        padding: "2px 6px", borderRadius: "4px", marginLeft: "2px"
                    }}>BETA</span>
                </NavLink>

                {/* Nav */}
                <nav className="app-nav" style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
                    <NavLink
                        id="tour-payroll"
                        to="/payroll"
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                        style={{
                            position: "relative", display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px",
                            borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)",
                            textDecoration: "none", transition: "all 0.2s"
                        }}
                    >
                        <span className="nav-icon" style={{ opacity: 0.7 }}><PayrollIcon /></span>
                        Payroll
                    </NavLink>

                    <NavLink
                        id="tour-employees"
                        to="/employee"
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                        style={{
                            position: "relative", display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px",
                            borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)",
                            textDecoration: "none", transition: "all 0.2s"
                        }}
                    >
                        <span className="nav-icon" style={{ opacity: 0.7 }}><EmployeesIcon /></span>
                        Employees
                    </NavLink>

                    <div className="nav-sep" style={{ width: "1px", height: "20px", background: "var(--border-hi)", margin: "0 8px" }} />

                    <NavLink
                        to="/debug"
                        className={({ isActive }) => `nav-link debug-link${isActive ? " active" : ""}`}
                        style={{
                            fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.05em", color: "var(--accent2)",
                            border: "1px solid rgba(124,111,247,0.25)", background: "rgba(124,111,247,0.06)",
                            marginLeft: "8px", padding: "7px 14px", borderRadius: "8px", textDecoration: "none"
                        }}
                    >
                        <span className="nav-icon"><DebugIcon /></span>
                        debugger
                    </NavLink>
                </nav>

                {/* Connect account */}
                <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px" }}>
                    <ConnectAccount />
                </div>
                <OnboardingTour run={runTour} onComplete={handleTourComplete} />
            </header>

            {/* ── Content ── */}
            <main className="app-content" key={location.pathname} style={{ flex: 1, paddingTop: "calc(var(--header-h) + 1px)", display: "flex", flexDirection: "column" }}>
                <PageWrapper>
                    <ErrorBoundary fallback={<ErrorFallback />}>
                        <Outlet />
                    </ErrorBoundary>
                </PageWrapper>
            </main>

            {/* ── Footer ── */}
            <footer className="app-footer" style={{
                padding: "20px 24px", borderTop: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px"
            }}>
                <span className="footer-copy" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>
                    © {new Date().getFullYear()} PayD — Licensed under the{" "}
                    <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                        Apache License 2.0
                    </a>
                </span>
                <div className="footer-status" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>
                    <button
                        onClick={restartTour}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent)",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0"
                        }}
                    >
                        Restart Tour
                    </button>
                    <div className="status-sep" style={{ width: "1px", height: "10px", background: "var(--border-hi)" }} />
                    <div className="status-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
                    STELLAR NETWORK · MAINNET
                </div>
            </footer>
        </div>
    );
};

// ── App ────────────────────────────────────────────────────────────────────────
=======
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Debugger from './pages/Debugger';
import PayrollScheduler from './pages/PayrollScheduler';
import EmployeeEntry from './pages/EmployeeEntry';
import AppLayout from './components/AppLayout';
import HelpCenter from './pages/HelpCenter';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import Settings from './pages/Settings';
import CustomReportBuilder from './pages/CustomReportBuilder';
import CrossAssetPayment from './pages/CrossAssetPayment';
import TransactionHistory from './pages/TransactionHistory';
import EmployeePortal from './pages/EmployeePortal';
import { useTranslation } from 'react-i18next';
>>>>>>> main

function App() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title={t('errorFallback.homeTitle')}
                  description={t('errorFallback.homeDescription')}
                />
              }
            >
              <Home />
            </ErrorBoundary>
          }
        />
        <Route
          path="/payroll"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title={t('errorFallback.payrollTitle')}
                  description={t('errorFallback.payrollDescription')}
                />
              }
            >
              <PayrollScheduler />
            </ErrorBoundary>
          }
        />
        <Route
          path="/employee"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title={t('errorFallback.employeesTitle')}
                  description={t('errorFallback.employeesDescription')}
                />
              }
            >
              <EmployeeEntry />
            </ErrorBoundary>
          }
        />
        <Route
          path="/portal"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title="Employee Portal Error"
                  description="Something went wrong loading your portal."
                />
              }
            >
              <EmployeePortal />
            </ErrorBoundary>
          }
        />
        <Route
          path="/reports"
          element={
            <ErrorBoundary fallback={<ErrorFallback />}>
              <CustomReportBuilder />
            </ErrorBoundary>
          }
        />
        <Route
          path="/debug"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title={t('errorFallback.debuggerTitle')}
                  description={t('errorFallback.debuggerDescription')}
                />
              }
            >
              <Debugger />
            </ErrorBoundary>
          }
        />
        <Route
          path="/debug/:contractName"
          element={
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title={t('errorFallback.debuggerTitle')}
                  description={t('errorFallback.debuggerDescription')}
                />
              }
            >
              <Debugger />
            </ErrorBoundary>
          }
        />
        <Route
<<<<<<< OAuth2-Social-Login-Integration
            path="/settings"
                    element={
                        <ErrorBoundary fallback={<ErrorFallback />}>
                            <Settings />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/help"
                    element={
                        <ErrorBoundary fallback={<ErrorFallback />}>
                            <HelpCenter />
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/cross-asset-payment"
                    element={
                        <ErrorBoundary fallback={<ErrorFallback />}>
                            <CrossAssetPayment />
                        </ErrorBoundary>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
            </Route>
        </Routes>
    );
=======
          path="/settings"
          element={
            <ErrorBoundary fallback={<ErrorFallback onReset={() => {}} />}>
              <Settings />
            </ErrorBoundary>
          }
        />
        <Route
          path="/help"
          element={
            <ErrorBoundary fallback={<ErrorFallback onReset={() => {}} />}>
              <HelpCenter />
            </ErrorBoundary>
          }
        />
        <Route
          path="/cross-asset-payment"
          element={
            <ErrorBoundary fallback={<ErrorFallback onReset={() => {}} />}>
              <CrossAssetPayment />
            </ErrorBoundary>
          }
        />
        <Route
          path="/transactions"
          element={
            <ErrorBoundary fallback={<ErrorFallback onReset={() => {}} />}>
              <TransactionHistory />
            </ErrorBoundary>
          }
        />
      </Route>
    </Routes>
  );
>>>>>>> main
}

export default App;

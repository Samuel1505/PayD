import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Card, Icon, Heading } from '@stellar/design-system';
import { useWallet } from '../hooks/useWallet';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import ConnectAccount from './ConnectAccount';
import { Menu, X } from 'lucide-react';

interface OrganizationData {
  name: string;
  balance: string;
  balanceAsset: string;
}

// Mock organization data - replace with actual API call
const useOrganizationData = (): OrganizationData => {
  const { address } = useWallet();
  const [orgData, setOrgData] = useState<OrganizationData>({
    name: 'PayD Organization',
    balance: '0.00',
    balanceAsset: 'XLM',
  });

  useEffect(() => {
    if (address) {
      // TODO: Replace with actual API call to fetch organization data
      setOrgData({
        name: 'Stellar Global Corp',
        balance: '125,480.25',
        balanceAsset: 'USDC',
      });
    }
  }, [address]);

  return orgData;
};

const EmployerDashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const organization = useOrganizationData();
  const { address } = useWallet();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Icon.Home01 },
    { path: '/payroll', label: 'Payroll', icon: Icon.Coins01 },
    { path: '/employee', label: 'Employees', icon: Icon.Users01 },
    { path: '/reports', label: 'Reports', icon: Icon.File02 },
    { path: '/analytics', label: 'Analytics', icon: Icon.BarChart01 },
    { path: '/settings', label: 'Settings', icon: Icon.Settings01 },
  ];

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden font-body">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-surface border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center font-black text-black text-sm tracking-tight shadow-lg shadow-accent/20 bg-gradient-to-br from-accent to-accent2">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none">
                  Pay<span className="text-accent">D</span>
                </span>
                <span className="text-[10px] font-mono text-muted tracking-widest uppercase">
                  Employer
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-muted hover:text-text rounded-lg hover:bg-surface-hi"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 py-8 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-xl
                    transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-muted hover:bg-surface-hi hover:text-text'
                    }
                  `}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-accent' : 'text-muted group-hover:text-text'}`}
                  />
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Org Selector / Context */}
          <div className="p-4 mx-4 mb-6 rounded-2xl bg-surface-hi border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 grid place-items-center">
                <Icon.Anchor className="w-4 h-4 text-accent" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-mono text-muted uppercase tracking-tighter truncate">
                  Connected Organization
                </p>
                <p className="text-xs font-black truncate">{organization.name}</p>
              </div>
            </div>
            <button
              className="w-full py-2 bg-bg hover:bg-black/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border transition-colors text-muted hover:text-text"
              onClick={() => {
                void navigate('/settings');
              }}
            >
              Switch Org
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-bg/50">
            <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]" />
              Mainnet Activity
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-surface-hi border border-border text-muted hover:text-text rounded-xl"
            >
              <Menu size={24} />
            </button>

            {/* Breadcrumb / Title area */}
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-0.5">
                Employer Console
              </p>
              <Heading as="h1" size="xs" weight="bold">
                {navigationItems.find((item) => item.path === location.pathname)?.label ||
                  'Overview'}
              </Heading>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            <div className="h-10 w-px bg-border hidden lg:block" />

            {/* Balance Card using SDS */}
            {address && (
              <Card addlClassName="!p-0 !bg-transparent !border-0 hidden sm:block">
                <div className="flex flex-col items-end px-4 py-1 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-[9px] text-accent/70 font-mono font-bold uppercase tracking-widest leading-none mb-1">
                    Available Balance
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-text">{organization.balance}</span>
                    <span className="text-[10px] font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      {organization.balanceAsset}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <ConnectAccount />
          </div>
        </header>

        {/* Content Area with Route Outlet */}
        <main className="flex-1 overflow-y-auto bg-bg p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto page-fade">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboardLayout;

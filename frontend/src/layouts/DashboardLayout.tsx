import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

export interface DashboardLink {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
}

const DashboardLayout = ({ links, title }: { links: DashboardLink[]; title: string }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 space-y-1 lg:block">
        <div className="card mb-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-1 truncate font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <link.icon className="text-lg" />
            {link.label}
          </NavLink>
        ))}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

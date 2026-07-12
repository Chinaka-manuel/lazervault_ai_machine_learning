import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiSun, FiMoon, FiShoppingCart, FiUser, FiLogOut, FiGrid, FiSearch,
} from 'react-icons/fi';
import { NAV_LINKS } from '@/utils/constants';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuthStore();
  const count = useCartStore((s) => s.count);
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/dashboard';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/courses?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-extrabold">
          <motion.span
            initial={{ rotate: -12, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"
          >
            LV
          </motion.span>
          <span className="hidden text-lg sm:block">
            Lazer<span className="gradient-text">Vault</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-md lg:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI & ML courses..."
            className="input pl-10"
          />
        </form>

        <div className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition hover:text-brand-600 ${
                  isActive ? 'text-brand-600' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cart">
            <FiShoppingCart />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-semibold text-white"
              >
                {user.name?.[0]?.toUpperCase() || <FiUser />}
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    onMouseLeave={() => setMenu(false)}
                  >
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link to={dashboardPath} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMenu(false)}>
                      <FiGrid /> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMenu(false)}>
                      <FiUser /> Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setMenu(false); navigate('/'); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost px-4 py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">Sign Up</Link>
            </div>
          )}

          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 xl:hidden dark:border-slate-800"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="btn-ghost flex-1 py-2 text-sm" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary flex-1 py-2 text-sm" onClick={() => setOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

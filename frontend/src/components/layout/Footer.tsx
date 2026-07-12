import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiGithub, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed to the LazerVault newsletter!');
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">LV</span>
            <span className="text-lg">Lazer<span className="gradient-text">Vault</span></span>
          </div>
          <p className="text-sm text-slate-500">Learn Today. Build Tomorrow. Master AI. Premium AI & Machine Learning recordings, snapshots and resources.</p>
          <div className="flex gap-3 text-slate-500">
            <a href="#" aria-label="GitHub" className="hover:text-brand-600"><FiGithub /></a>
            <a href="#" aria-label="Twitter" className="hover:text-brand-600"><FiTwitter /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-600"><FiLinkedin /></a>
            <a href="#" aria-label="YouTube" className="hover:text-brand-600"><FiYoutube /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/courses" className="hover:text-brand-600">Courses</Link></li>
            <li><Link to="/videos" className="hover:text-brand-600">Videos</Link></li>
            <li><Link to="/snapshots" className="hover:text-brand-600">Snapshots</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-600">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-brand-600">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
            <li><a href="#" className="hover:text-brand-600">Blog</a></li>
            <li><a href="#" className="hover:text-brand-600">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Newsletter</h4>
          <p className="mb-3 text-sm text-slate-500">Get the latest AI courses & offers.</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input"
              required
            />
            <button className="btn-primary px-4">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} LazerVault AI & Machine Learning. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

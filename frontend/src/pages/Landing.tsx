import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiSearch, FiZap, FiAward, FiUsers, FiPlayCircle,
  FiCpu, FiShield, FiTrendingUp,
} from 'react-icons/fi';
import { productApi } from '@/services/product.api';
import ProductCard from '@/components/product/ProductCard';
import { GridSkeleton } from '@/components/ui/Skeleton';
import Reveal from '@/components/ui/Reveal';
import { CATEGORIES } from '@/utils/constants';
import { staggerContainer, staggerItem, fadeInUp } from '@/utils/motion';

const testimonials = [
  { name: 'Chinelo A.', role: 'Data Scientist', text: 'LazerVault recordings took me from beginner to deploying ML models in production.' },
  { name: 'Marcus T.', role: 'ML Engineer', text: 'The snapshots and source code are gold. Best value for AI learning online.' },
  { name: 'Priya S.', role: 'AI Researcher', text: 'High quality lectures on transformers and LLMs. Highly recommended.' },
];

const faqs = [
  { q: 'How do I access my purchases?', a: 'All purchased videos and files are available instantly in your student dashboard.' },
  { q: 'Can I download resources?', a: 'Yes, snapshots, PDFs, and source code are downloadable after purchase.' },
  { q: 'Which payment methods are supported?', a: 'We support Paystack and Stripe for secure global payments.' },
  { q: 'Do you offer certificates?', a: 'Yes, completion certificates are issued for eligible courses.' },
];

const Landing = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  useEffect(() => {
    productApi
      .featured()
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/courses${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-300">
              <FiZap /> AI-Powered Learning Platform
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Learn Today. Build Tomorrow. <span className="gradient-text">Master AI.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-500">
              Buy and stream premium AI & Machine Learning class recordings, snapshots, PDF notes,
              source code and downloadable resources — all in one vault.
            </p>

            <form onSubmit={doSearch} className="relative mt-8 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for AI, ML, Deep Learning..."
                className="input py-3.5 pl-11 pr-32"
              />
              <button className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 py-2">
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary">
                Browse Courses <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-ghost">Get Started Free</Link>
            </div>

            <div className="mt-10 flex gap-8">
              {[
                { icon: FiUsers, label: '12k+ Students' },
                { icon: FiPlayCircle, label: '500+ Recordings' },
                { icon: FiAward, label: '4.9 Avg Rating' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm text-slate-500">
                  <s.icon className="text-brand-500" /> {s.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass animate-float rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {[FiCpu, FiTrendingUp, FiShield, FiZap].map((Icon, i) => (
                  <div key={i} className="rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-500/20 p-6">
                    <Icon className="h-8 w-8 text-brand-500" />
                    <div className="mt-3 h-2 w-3/4 rounded-full bg-brand-500/30" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-accent-500/30" />
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 p-6 text-white">
                <p className="text-sm opacity-90">Now streaming</p>
                <p className="text-xl font-bold">Deep Learning with PyTorch</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="mb-8 text-2xl font-bold">Explore Categories</h2>
        </Reveal>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={staggerContainer(0.03)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat} variants={staggerItem}>
              <Link
                to={`/courses?search=${encodeURIComponent(cat)}`}
                className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800"
              >
                {cat}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <Link to="/courses" className="flex items-center gap-1 text-sm font-medium text-brand-600">
              View all <FiArrowRight />
            </Link>
          </div>
        </Reveal>
        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featured.map((p) => (
              <motion.div key={p._id} variants={staggerItem}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-bold">Loved by learners worldwide</h2>
        </Reveal>
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={staggerItem} whileHover={{ y: -6 }} className="card">
              <p className="text-slate-600 dark:text-slate-300">“{t.text}”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="card cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between font-semibold">
                  {f.q}
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-xl leading-none">
                    +
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-sm text-slate-500"
                    >
                      <span className="mt-3 block">{f.a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal variants={fadeInUp}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-accent-500 p-12 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to master AI?</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              Join thousands of learners building the future with AI & Machine Learning.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="mt-6 inline-block">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700">
                Start Learning Now <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Landing;

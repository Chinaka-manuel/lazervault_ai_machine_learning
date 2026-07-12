import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import Reveal from '@/components/ui/Reveal';
import { staggerContainer, staggerItem } from '@/utils/motion';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    features: ['Access free recordings', 'Community support', 'Basic snapshots', 'Newsletter'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro Learner',
    price: '$29/mo',
    features: ['All Starter features', 'Unlimited course purchases discount', 'Downloadable resources', 'Certificates', 'Priority support'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$99/mo',
    features: ['All Pro features', 'Up to 10 seats', 'Team analytics', 'Dedicated manager'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const Pricing = () => (
  <div className="mx-auto max-w-6xl px-4 py-16">
    <Reveal>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-3 text-slate-500">Buy individual products or subscribe for the best value.</p>
      </div>
    </Reveal>
    <motion.div
      className="mt-12 grid gap-6 md:grid-cols-3"
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {plans.map((plan) => (
        <motion.div key={plan.name} variants={staggerItem} whileHover={{ y: -8 }} className={`card flex flex-col ${plan.highlight ? 'ring-2 ring-brand-500' : ''}`}>
          {plan.highlight && <span className="mb-2 w-fit rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most Popular</span>}
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="mt-2 text-3xl font-extrabold gradient-text">{plan.price}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <FiCheck className="text-green-500" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className={`mt-6 ${plan.highlight ? 'btn-primary' : 'btn-ghost'} w-full`}>{plan.cta}</Link>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default Pricing;

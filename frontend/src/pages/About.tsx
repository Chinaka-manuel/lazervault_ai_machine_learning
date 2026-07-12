import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiZap } from 'react-icons/fi';
import Reveal from '@/components/ui/Reveal';
import { staggerContainer, staggerItem } from '@/utils/motion';

const About = () => (
  <div className="mx-auto max-w-4xl px-4 py-16">
    <Reveal>
      <h1 className="text-4xl font-bold">About <span className="gradient-text">LazerVault</span></h1>
      <p className="mt-4 text-lg text-slate-500">
        LazerVault AI & Machine Learning is a premium digital marketplace where learners purchase,
        stream, and download high-quality AI/ML class recordings, snapshots, notes, and source code.
      </p>
    </Reveal>
    <motion.div
      className="mt-12 grid gap-6 md:grid-cols-3"
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {[
        { icon: FiTarget, title: 'Our Mission', text: 'Make world-class AI education accessible to everyone, everywhere.' },
        { icon: FiUsers, title: 'Our Community', text: 'A growing network of students, instructors, and AI practitioners.' },
        { icon: FiZap, title: 'Our Promise', text: 'Learn Today. Build Tomorrow. Master AI — with practical, hands-on content.' },
      ].map((c) => (
        <motion.div key={c.title} variants={staggerItem} whileHover={{ y: -6 }} className="card">
          <c.icon className="h-8 w-8 text-brand-500" />
          <h3 className="mt-3 font-bold">{c.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{c.text}</p>
        </motion.div>
      ))}
    </motion.div>
    <Reveal>
      <div className="mt-12">
        <Link to="/courses" className="btn-primary">Browse Courses</Link>
      </div>
    </Reveal>
  </div>
);

export default About;

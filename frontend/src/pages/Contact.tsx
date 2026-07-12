import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { staggerContainer, staggerItem } from '@/utils/motion';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = () => {
    toast.success('Message sent! We will get back to you shortly.');
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-slate-500">Questions about courses or payments? Reach out anytime.</p>
      </Reveal>
      <motion.div
        className="mt-10 grid gap-8 md:grid-cols-2"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={staggerItem} className="space-y-4">
          {[
            { icon: FiMail, label: 'Email', value: 'support@lazervault.com' },
            { icon: FiPhone, label: 'Phone', value: '+1 (555) 010-2030' },
            { icon: FiMapPin, label: 'Address', value: 'Remote-first, Worldwide' },
          ].map((c) => (
            <div key={c.label} className="card flex items-center gap-4">
              <c.icon className="text-2xl text-brand-500" />
              <div>
                <p className="text-xs text-slate-400">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.form variants={staggerItem} onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <input className="input" placeholder="Your name" {...register('name', { required: true })} />
          <input type="email" className="input" placeholder="Your email" {...register('email', { required: true })} />
          <textarea className="input" rows={5} placeholder="Your message" {...register('message', { required: true })} />
          <Button type="submit" className="w-full">Send Message</Button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Contact;

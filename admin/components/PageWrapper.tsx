'use client';
import { motion } from 'framer-motion';
export default function PageWrapper({ children }: { children: React.ReactNode }) { return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">{children}</motion.div>); }

import { motion } from 'framer-motion'

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 ${className}`}
    >
      {children}
    </motion.div>
  )
}

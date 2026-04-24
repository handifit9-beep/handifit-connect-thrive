import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import handifitLogo from "@/assets/handifit-logo.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-400/20"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Logo container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo with glow */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.img
            src={handifitLogo}
            alt="HANDIFIT"
            className="relative w-64 md:w-80 h-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-3 text-sm text-muted-foreground text-center max-w-xs"
        >
          Fitness intelligent et accessible pour tous
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 z-10"
      >
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        <p className="mt-2 text-xs text-center text-muted-foreground">
          Chargement... {Math.round(progress)}%
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;

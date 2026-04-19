"use client";
import { motion } from "framer-motion";

const Loader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div className="relative flex flex-col items-center">
                {/* Animated Logo Text */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-4 text-gray-800"
                >
                    Career<span className="text-blue-600">Sync</span>
                </motion.h1>

                {/* Modern Bar Animation */}
                <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut",
                        }}
                        className="absolute top-0 h-full w-1/2 bg-blue-600"
                        style={{ borderRadius: "inherit" }}
                    />
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-4 text-gray-500 text-sm tracking-widest uppercase"
                >
                    Loading Opportunities...
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Loader;
// components/popup/mint-success.js
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { base } from "viem/chains";

export default function MintSuccessPopup({ isOpen, onClose, txHash }) {
  const explorerUrl = `${base.blockExplorers.default.url}/tx/${txHash}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-2xl p-8 shadow-xl"
            style={{
              background: 'radial-gradient(ellipse at 60% 40%, #7f9cf5 0%, #a78bfa 40%, #c4b5fd 100%)',
              boxShadow: '0 10px 32px 0 rgba(80, 80, 180, 0.15)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">
                Mint successfully!
              </h3>

              <div className="mt-6">
                <Link
                  href={explorerUrl}
                  legacyBehavior
                  passHref
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#2F2F2F] px-4 py-2 text-sm font-medium text-white hover:bg-[#3F3F3F] transition-colors"
                  >
                    <span>Explorer on scan</span>
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
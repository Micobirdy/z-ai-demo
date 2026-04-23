import { motion } from 'motion/react'
import { useSidebar } from '@/hooks/useSidebar'

export default function ZHoverEffect() {
  const { theme } = useSidebar()
  const dk = theme === 'dark'

  const pathData = "M398.97 0.5L147.576 319.5H1.03027L37.5996 273.081L120.167 169.603L120.171 169.598L215.342 47.5605L215.343 47.5615L252.424 0.5H398.97ZM264.544 273.271H372.527L336.082 319.498H189.886L202.642 303.307C217.584 284.34 240.398 273.271 264.544 273.271ZM209.164 0.5L202.786 8.58887C183.782 32.6885 154.782 46.752 124.091 46.752H25.9805L62.4268 0.5H209.164Z"

  return (
    <div
      className="absolute left-[calc(50%+26px)] top-[97px] py-2 pointer-events-none"
      style={{
        zIndex: 0,
        animation: 'zBackgroundEntrance 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0s both, zBackgroundBreathing 6s ease-in-out 1.4s infinite'
      }}
    >
      <svg
        width="400"
        height="320"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paint0_linear_z" x1="200" y1="31.5" x2="200" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor={dk ? '#333333' : '#DBDBDB'}/>
            <stop offset="1" stopColor={dk ? '#1e1e1e' : '#F8F8F8'}/>
          </linearGradient>
        </defs>

        <motion.path
          d={pathData}
          stroke="url(#paint0_linear_z)"
          strokeWidth="1"
          fill="none"
          pathLength="1"
          initial={{
            strokeDashoffset: 1,
            opacity: 0
          }}
          animate={{
            strokeDashoffset: 0,
            opacity: 1
          }}
          transition={{
            strokeDashoffset: {
              duration: 1.4,
              ease: [0.4, 0, 0.2, 1]
            },
            opacity: {
              duration: 0.3,
              ease: 'easeOut'
            }
          }}
          style={{
            strokeDasharray: 1
          }}
        />
      </svg>
    </div>
  )
}

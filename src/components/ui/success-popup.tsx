import { useEffect } from 'react'

interface SuccessPopupProps {
  open: boolean
  heading: string
  subheading?: string
  duration?: number
  onClose: () => void
}

export function SuccessPopup({ open, heading, subheading, duration = 3000, onClose }: SuccessPopupProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-in fade-in-0 duration-200" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 flex flex-col items-center text-center max-w-sm w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-300">

        {/* Animated check circle */}
        <div className="mb-5">
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle */}
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="#138266"
              strokeWidth="3"
              fill="#e8f5f1"
              className="animate-in fade-in-0 zoom-in-50 duration-300"
            />
            {/* Checkmark path with stroke-dasharray animation */}
            <path
              d="M18 32 L27 42 L46 22"
              stroke="#138266"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 0,
                animation: 'drawCheck 0.4s ease-out 0.2s both',
              }}
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold text-gray-900">{heading}</h3>
        {subheading && (
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{subheading}</p>
        )}

        <style>{`
          @keyframes drawCheck {
            from { stroke-dashoffset: 40; }
            to   { stroke-dashoffset: 0;  }
          }
        `}</style>
      </div>
    </div>
  )
}

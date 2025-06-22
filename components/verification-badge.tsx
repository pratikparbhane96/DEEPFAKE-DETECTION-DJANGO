import { cn } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"

interface VerificationBadgeProps {
  isReal: boolean
  className?: string
}

export function VerificationBadge({ isReal, className }: VerificationBadgeProps) {
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5",
        isReal
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        className
      )}
    >
      {isReal ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Authentic</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>Deepfake</span>
        </>
      )}
    </div>
  )
}
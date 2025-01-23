import { memo, useEffect } from "react"
import { useStopwatch } from "react-timer-hook"

interface StopWatchProps {
  isOpen?: boolean
}

export default function StopWatch({ isOpen }: StopWatchProps) {
  const stopwatch = useStopwatch({ autoStart: false })

  useEffect(() => {
    if (isOpen) stopwatch.reset(undefined, true)
    stopwatch.pause()
  }, [isOpen, stopwatch])

  return `${
    stopwatch.hours ? String(stopwatch.hours).padStart(2, "0") + ":" : ""
  }${String(stopwatch.minutes).padStart(2, "0")}:${String(
    stopwatch.seconds,
  ).padStart(2, "0")}`
}

export const StopwatchMemozied = memo(StopWatch)

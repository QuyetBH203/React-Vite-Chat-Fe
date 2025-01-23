import { Tooltip as NextTooltip, TooltipProps } from "@nextui-org/react"

export default function Tooltip(props: TooltipProps) {
  return (
    <NextTooltip
      closeDelay={0}
      classNames={{
        base: "py-2 rounded-md font-semibold",
      }}
      {...props}
    />
  )
}

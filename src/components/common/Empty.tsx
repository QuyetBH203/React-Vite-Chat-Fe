import { MdErrorOutline } from "react-icons/md"

interface EmptyProps {
  text: string
}

export default function Empty({ text }: EmptyProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-gray-400">
      <MdErrorOutline size="30" />
      <div className="font-medium text-sm">{text}</div>
    </div>
  )
}

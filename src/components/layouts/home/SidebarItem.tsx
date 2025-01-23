import Tooltip from "components/core/Tooltip"
import { PropsWithChildren, useMemo } from "react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { TiMessages } from "react-icons/ti"
import { colors } from "styles/theme"

interface SidebarItemProps {
  label: string
  src?: string
  handleClick?: () => void
}

export default function SidebarItem({
  label,
  src,
  children,
  handleClick,
}: PropsWithChildren<SidebarItemProps>) {
  const isDirectMessages = useMemo(() => label === "Direct Messages", [label])
  const isAddGroup = useMemo(() => label === "Add Group", [label])

  return (
    <div className="flex justify-center">
      <Tooltip placement="right" offset={18} content={label}>
        <div className="relative group cursor-pointer">
          <div
            onClick={handleClick}
            className="w-12 h-12 flex justify-center items-center rounded-[48px] hover:rounded-2xl bg-white bg-center bg-cover transition-all"
            style={{
              backgroundImage: src && `url('${src}')`,
            }}
          >
            {isDirectMessages ? (
              <TiMessages size={24} color={colors.primary[500]} />
            ) : isAddGroup ? (
              <AiOutlineUsergroupAdd size={24} color={colors.primary[500]} />
            ) : (
              children
            )}
          </div>
          <div className="absolute -left-5 group-hover:-left-4 top-1/2 -translate-y-1/2 w-2 h-0 group-hover:h-5 rounded-full bg-black transition-all"></div>
        </div>
      </Tooltip>
    </div>
  )
}

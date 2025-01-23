import {
  Avatar as AvatarNextUI,
  AvatarProps,
  forwardRef,
} from "@nextui-org/react"

interface Props extends AvatarProps {
  name: string
}

const Avatar = forwardRef((props: Props, ref) => {
  return (
    <AvatarNextUI
      ref={ref}
      size="lg"
      {...props}
      classNames={{
        ...props.classNames,
        name: "font-semibold" + " " + props.classNames?.name,
      }}
    />
  )
})

export default Avatar

import { Spinner } from "@nextui-org/react"

export default function LoadingPage() {
  return (
    <div className=" h-screen flex justify-center items-center">
      <Spinner
        classNames={{
          wrapper: "w-20 h-20",
          circle1: "border-5",
          circle2: "border-5",
        }}
      />
    </div>
  )
}

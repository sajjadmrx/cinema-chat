import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createRoomService } from "../../../services/rooms.service"
import { ButtonComponent } from "../../Shared"
import ProfileDropdown from "./ProfileDropdown"

const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen((cur) => !cur)

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
      <ButtonComponent
        variant="primary"
        className="!px-4 !mx-3 flex"
        onClick={handleOpen}
      >
        Create Room
      </ButtonComponent>
      <ProfileDropdown />
      <DialogWithForm open={open} handler={handleOpen} />
    </nav>
  )
}

interface DProp {
  open: boolean
  handler: any
}
function validatePassword(password: string) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

export function DialogWithForm(prop: DProp) {
  const [roomName, setRoomName] = useState("")
  const [password, setPassword] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const navigate = useNavigate()
  const handleCreateRoom = async () => {
    if (isPrivate && !validatePassword(password)) {
      setPasswordError(
        "رمز عبور باید حداقل 8 کاراکتر با حداقل یک حرف بزرگ و کوچک و یک عدد باشد.",
      )
      return
    }

    setPasswordError("")
    const room = await createRoomService({
      name: roomName,
      avatar: "DEFAULT_AVATAR",
      isPublic: isPrivate,
    })
    prop.handler()
    navigate(`/rooms/${room.roomId}`)

    console.log("نام اتاق:", roomName)
    console.log("رمز عبور:", password)
    console.log("اتاق خصوصی:", isPrivate)
  }

  return (
    <>
      <Dialog
        size="xs"
        open={prop.open}
        handler={prop.handler}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="grid mb-4 h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              ایجاد اتاق
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="اسم اتاق"
              size="lg"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
              label="رمزعبور"
              size="lg"
              type="password"
              disabled={!isPrivate}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-600">{passwordError}</p>}
            <div className="-ml-2.5">
              <Checkbox
                label="فقط با رمزعبور(اتاق خصوصی)"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              onClick={handleCreateRoom}
              fullWidth
              disabled={!roomName || (isPrivate && !password)}
            >
              ساختن
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}

export default Navbar

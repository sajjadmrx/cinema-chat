import { Pagination } from "@interfaces/schemas/api.interface"
import { FetchMembers, Member } from "@interfaces/schemas/member.interface"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react"
import { Avatar } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { FiMoreHorizontal } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { socket } from "../../../hooks/useSocket"
import { fetchMembersService } from "../../../services/members.service"
import { createRoomInvite } from "../../../services/rooms.service"

interface Prop {
  roomId: number
  showMembers: boolean
  setShowMembers: any
}
const MembersComponent = (prop: Prop) => {
  const [members, setMembers] = useState<Array<Member>>([])
  const [onlineMembers, setOnlineMembers] = useState<Array<number>>([])
  const [pagination, setPagination] = useState<Pagination>({
    nextPage: 2,
    totalPages: 0,
    totalDoc: 0,
  })

  useEffect(() => {
    if (!onlineMembers.length) {
      socket.emit("FETCH_ONLINE_MEMBERS", { roomId: prop.roomId })
      socket.on("FETCH_ONLINE_MEMBERS", (data) => setOnlineMembers(data))
      socket.on("UPDATE_MEMBER_STATUS", (data) => {
        if (data.roomId == prop.roomId) {
          if (data.status == "ONLINE") {
            onlineMembers.push(data.memberId)
            setOnlineMembers((prev) => [...prev, data.memberId])
          } else {
            const newOnlineMembers = onlineMembers.filter(
              (memberId) => memberId != data.memberId,
            )
            setOnlineMembers(newOnlineMembers)
          }
        }
      })
    }
    return () => {
      socket?.off("FETCH_ONLINE_MEMBERS")
    }
  }, [onlineMembers])

  useEffect(() => {
    fetchMembers(prop.roomId, pagination.nextPage--).then((data) => {
      const filteredData = data.members.filter(
        (member) => !members.some((m) => m.id === member.id),
      )
      setMembers(filteredData)
      setPagination(data)
    })
  }, [])

  return (
    <section
      className={`${
        prop.showMembers ? "fixed" : "hidden"
      } top-0 bg-dark text-white bottom-0 left-0 right-0 lg:border-r lg:w-72 px-6 py-5 lg:h-full lg:relative lg:block z-50`}
    >
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
        <h2 className="text-lg font-semi-bold">Members</h2>
        <div className="flex gap-x-2">
          <OptionDivider />
          <AiOutlineCloseCircle
            onClick={() => prop.setShowMembers(false)}
            className={`lg:hidden ${prop.showMembers ? "block" : "hidden"}`}
            size={24}
          />
        </div>
      </div>

      <div className="space-y-3  h-[calc(100%-61px)] overflow-y-auto">
        {members.map((member, index) => (
          <div key={index} className="flex items-center">
            {/* <Avatar
              size={"sm"}
              shape={"circle"}
              src="/assets/images/avatar.jpg"
              online={onlineMembers.includes(member.userId)}
              offline={!onlineMembers.includes(member.userId)}
            /> */}
            <Avatar src="https://github.com/shadcn.png"></Avatar>
            <div>
              <h4 className="ml-2.5 -mb-1.5">
                {member.nickname || member.user.username}
              </h4>
              <span className="ml-2.5 text-xs text-gray-400">{member.user.username}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MembersComponent
export function OptionDivider() {
  const [openDialogInvite, setOpenDialogInvite] = React.useState<boolean>(false)
  const handleOpenDInvite = () => setOpenDialogInvite((cur) => !cur)
  const params = useParams()
  return (
    <Menu>
      <MenuHandler>
        {/* <Button className={"normal-case"}>More</Button> */}
        <button className="flex flex-col items-center justify-center">
          <span>More</span>
          <FiMoreHorizontal className={"text-2xl"} />
        </button>
      </MenuHandler>
      <MenuList>
        <MenuItem className={"normal-case"} onClick={handleOpenDInvite}>
          Create Invite Link
        </MenuItem>
        <MenuItem className={"normal-case"}>Member Managment</MenuItem>
      </MenuList>
      <DialogInvite
        open={openDialogInvite}
        handleOpen={setOpenDialogInvite}
        roomId={String(params.id)}
      />
    </Menu>
  )
}

export function DialogInvite({
  open,
  handleOpen,
  roomId,
}: {
  open: boolean
  handleOpen: any
  roomId: string
}) {
  const [max_use, setMax_use] = useState<number>(0)
  const [inviteCode, setInviteCode] = useState<string>("waiting...")
  const [isForEver, setIsForEver] = useState<boolean>(false)
  async function createHandle() {
    const code = await createRoomInvite({
      roomId,
      isForEver,
      max_use,
    })
    setInviteCode(code.data)
  }
  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="grid mb-4 h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              ساخت لینک دعـوت
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="لینک دعوت:"
              size="lg"
              disabled={true}
              value={`http://localhost:3000/i/${inviteCode}`}
            />
            <Input
              label="تعیین تعداد مجاز استفاده (مقدار پیشفرض بدون محدودیت)"
              size="lg"
              type={"number"}
              value={0}
            />
            <div className="-ml-2.5">
              <Checkbox label="بدون انقضا" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={createHandle} fullWidth>
              ساختن
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}
async function fetchMembers(roomId: number, page: number): Promise<FetchMembers> {
  const { data } = await fetchMembersService(roomId, page)
  return data
}

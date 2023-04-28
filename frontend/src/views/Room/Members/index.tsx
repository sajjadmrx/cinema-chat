import React, { useEffect, useState } from "react"
import { FetchMembers, Member } from "@interfaces/schemas/member.interface"
import { fetchMembersService } from "../../../services/members.service"
import {AiOutlineCloseCircle} from "react-icons/ai"

interface Prop {
  roomId: number
}
const MembersComponent = (prop: Prop) => {
  const [members, setMembers] = useState<Array<Member>>([])
  const [membersPage, setMembersPage] = useState<number>(1)

  useEffect(() => {
    fetchMembers(prop.roomId, membersPage).then((data) => {
      const filteredData = data.members.filter(
        (member) => !members.some((m) => m.id === member.id),
      )
      setMembers(filteredData)
    })
  }, [membersPage])

  return (
    <section className={`${prop.showMembers? 'fixed' : 'hidden' } top-0 bottom-0 left-0 right-0 lg:border-r lg:w-72 px-6 py-5 lg:h-full lg:relative lg:block bg-white z-50`}>
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-semi-bold">Members</h2>
        <div className="flex gap-x-2">
          <span className="rounded-full bg-primary grid place-items-center leading-[25px] w-6 h-6 text-white text-sm">
            9
          </span>
          <AiOutlineCloseCircle onClick={()=>prop.setShowMembers(false)} className={`lg:hidden ${prop.showMembers ? "block" : "hidden" }`} size={24} />
        </div>
      </div>

      <div className="space-y-3  h-[calc(100%-61px)] overflow-y-auto">
        {members.map((member, index) => (
          <div key={index} className="flex items-center">
            <img
              className="w-12 rounded-full border border-gray-200"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt={"xx"}
            />
            <div>
              <h4 className="ml-2.5 -mb-1.5">
                {member.nickname || member.user.username}
              </h4>
              {/* @ts-ignore*/}
              <span className="ml-2.5 text-xs text-gray-400">{member.user.username}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MembersComponent

async function fetchMembers(roomId: number, page: number): Promise<FetchMembers> {
  const { data } = await fetchMembersService(roomId, page)
  return data
}

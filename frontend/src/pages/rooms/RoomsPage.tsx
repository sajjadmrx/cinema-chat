import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import { ButtonComponent, IconComponent } from "../../components/Shared"

import { Room } from "@interfaces/schemas/Room.interface"
import React, { useEffect, useState } from "react"
import { HiOutlineUserGroup } from "react-icons/hi"
import { MdOutlinePublic } from "react-icons/md"
import { VscLock, VscUnlock } from "react-icons/vsc"
import { Link } from "react-router-dom"
import {
  getCurrentRoomsService,
  getPublicRoomsService,
} from "../../services/rooms.service"

const RoomsPage = () => {
  const [publicRooms, setPublicRooms] = useState<Array<Room>>([])
  const [currentRooms, setCurrentRooms] = useState<Array<Room>>([])
  useEffect(() => {
    async function fetch() {
      const [responsePublic, responseCurrent] = await Promise.all([
        getPublicRoomsService(1),
        getCurrentRoomsService(1),
      ])

      const currentRoomsMap = new Map(
        responseCurrent.data.rooms.map((room) => [room.id, room]),
      )
      const newPublicRooms = responsePublic.data.rooms.filter((room) => {
        return !currentRoomsMap.has(room.id)
      })

      setPublicRooms(newPublicRooms)
      const newCurrentRooms = responseCurrent.data.rooms.filter((room) => {
        return !newPublicRooms.some((newRoom) => newRoom.id === room.id)
      })
      setCurrentRooms(newCurrentRooms)
      console.log(currentRoomsMap)
    }
    return () => {
      fetch()
    }
  }, [])

  return (
    <Layout>
      <div className="bg-[#f8f7fa] min-h-screen">
        <Navbar />
        <div className="relative my-12 mt-10">
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
            <span className="bg-[#f8f7fa] px-3 text-lg font-semi-bold text-gray-600 flex  gap-2 ">
              Your Rooms
              <HiOutlineUserGroup className={"mt-1"} />
            </span>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {currentRooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col items-center justify-center w-full bg-white shadow-sm h-max rounded-3xl px-7 py-7"
            >
              <div className="flex flex-col items-start">
                <div className="flex ">
                  <img
                    className="w-20 rounded-full border-[6px] border-gray-200"
                    src="https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg"
                    alt={""}
                  />
                  {/* room details */}
                  <div className="flex flex-col mt-4 ml-3 ">
                    <h1 className="flex gap-2 text-xl font-semi-bold">
                      <p>{room.name}</p>
                      <span>{room.isPublic ? "🔐" : "🔓"}</span>
                    </h1>
                    <div className="flex text-sm">
                      <HiOutlineUserGroup size={16} color="gray" className="mr-1" />
                      <span className="leading-[23px]"> {room._count.members}/10 </span>
                    </div>
                    <div className="flex">
                      <IconComponent
                        name="radar"
                        size={18}
                        color="green"
                        className="mr-1 delay-75 animate-pulse"
                      />
                      <span className="text-sm">Live</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-3 text-[#60637B]"></div>
                <Link to={`/rooms/${room.roomId}`}>
                  <ButtonComponent
                    variant={"primary"}
                    size="small"
                    className="mt-2 !px-14"
                  >
                    open room
                  </ButtonComponent>
                </Link>
              </div>
            </div>
          ))}
        </section>
        <div className="relative mt-4 mb-5">
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
            <span className="bg-[#f8f7fa] px-3 text-lg font-semi-bold text-gray-600 flex  gap-2 ">
              Public Rooms
              <MdOutlinePublic className={"mt-1"} />
            </span>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {publicRooms.map((item) => (
            <div
              key={item.id}
              className="w-full h-40 bg-white shadow-sm rounded-3xl px-7 py-7"
            >
              <div className="flex items-start">
                <img
                  className="w-20 rounded-full border-[6px] border-gray-200"
                  src="https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg"
                  alt={""}
                />
                <div className="mt-4 ml-2">
                  <h4 className="flex gap-1 font-semi-bold">
                    {item.isPublic ? <VscUnlock /> : <VscLock />}
                    {item.name}
                  </h4>

                  <div className="mt-2 flex items-center space-x-3 text-[#60637B]">
                    <div className="flex text-sm">
                      <HiOutlineUserGroup size={16} color="gray" className="mr-1" />
                      <span className="leading-[23px]"> {item._count.members}/10 </span>
                    </div>
                    <div>
                      <div className="flex">
                        <IconComponent
                          name="radar"
                          size={18}
                          className="mr-1 delay-75 animate-pulse"
                        />
                        <span className="text-sm leading-[23px]">current playing</span>
                      </div>
                    </div>
                  </div>
                  <ButtonComponent
                    variant={"outline-primary"}
                    size="small"
                    className="mt-2 !px-0"
                    rounded="full"
                    disabled={!item.isPublic}
                  >
                    Join to room
                  </ButtonComponent>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  )
}
export default RoomsPage

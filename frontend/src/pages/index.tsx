import Layout from "@/components/Layout"
import MainPage from "@/components/MainPage"
import { Button, Icon } from "@/components/Shared"
// import CreateRoomPage from "@/components/CreateRoomPage";
import { SessionProvider } from "next-auth/react";

import { VscLock, VscUnlock } from "react-icons/vsc"
import { HiOutlineUserGroup } from "react-icons/hi"
import Navbar from "@/components/Layout/Navbar"

const data = [
  {
    id: "6442bebb67d69647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442bebqb6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442beb6b6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: false,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442bebb67693647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "64452bebb6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: false,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442b9ebb6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: false,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "64423bebb6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442bebb67696647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: false,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442hbebb6769647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
  {
    id: "6442bebb676dc9647618f4cc5c",
    roomId: 32255782,
    ownerId: 173796573357,
    name: "Sua Smythe",
    isPublic: true,
    avatar: "DEFAULT_AVATAR",
  },
]

const IndexPage = () => {
  return (
    <SessionProvider>
      <Layout>
        {/* <CreateRoomPage /> */}
      </Layout>
    </SessionProvider>
  );
}
export default IndexPage

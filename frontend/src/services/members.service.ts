import { ReturnFormat } from "@interfaces/schemas/api.interface"
import http from "../config/http"
import { FetchMembers, MemberWithRoom } from "@interfaces/schemas/member.interface"

export async function getMemberByMemberId(
  roomId: number,
  memberId: number,
): Promise<ReturnFormat<MemberWithRoom>> {
  try {
    const response = await http.get(`/rooms/${roomId}/members/${memberId}`)
    return {
      data: response.data.data,
    }
  } catch (e) {
    throw e
  }
}

export async function fetchMembersService(
  roomId: number,
  page: number,
): Promise<ReturnFormat<FetchMembers>> {
  try {
    const response = await http.get(`/rooms/${roomId}/members?page=${page}&limit=${10}`)
    return {
      data: response.data.data,
    }
  } catch (e) {
    throw e
  }
}

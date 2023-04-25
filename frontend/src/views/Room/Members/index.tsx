const MEMBERS = [
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
  { username: "@username", nickname: "Nickname" },
]

const Members = () => {
  return (
    <section className="border-r w-72 px-6 py-5 h-full">
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-semibold">Members</h2>
        <span className="rounded-full bg-primary grid place-items-center leading-[25px] w-6 h-6 text-white text-sm">
          9
        </span>
      </div>

      <div className="space-y-3  h-[calc(100%-61px)] overflow-y-auto">
        {MEMBERS.map((item, index) => (
          <div key={index} className="flex items-center">
            <img
              className="w-12 rounded-full border border-gray-200"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            />
            <div>
              <h4 className="ml-2.5 -mb-1.5">{item.nickname}</h4>
              <span className="ml-2.5 text-xs text-gray-400">{item.username}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Members

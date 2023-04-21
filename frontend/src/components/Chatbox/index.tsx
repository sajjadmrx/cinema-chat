import { KeyboardEvent, useRef, useState } from "react";
import Image from "next/image";
import femaleUserPhoto from "../../../public/assets/images/female_user.png";
import styles from "./style.module.scss";

const fakeMessages = [
  { id: 1, name: "sara", text: "سلام" },
  { id: 2, name: "ayda", text: "خوبین؟" },
  { id: 3, name: "hosna", text: "ما خوبیم تو چطوری؟" },
];

const Chatbox = () => {
  const [messages, setMessages] = useState(fakeMessages);
  const [chatBoxMessage, setChatBoxMessage] = useState("");

  const messagesRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code == "Enter") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Math.random() * 10000, name: "saba", text: chatBoxMessage },
      ]);
      setChatBoxMessage("");
      // messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  return (
    <div className={styles.chatbox}>
      <input
        className={styles.chatbox__input}
        type="text"
        placeholder="پیام شما ..."
        value={chatBoxMessage}
        onChange={(event) => setChatBoxMessage(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div ref={messagesRef} className={styles.chatbox__messages}>
        {messages.map((message) => {
          return (
            <div key={message.id} className={styles.chatbox__messages__message}>
              <Image
                src={femaleUserPhoto}
                alt="female_user_photo"
                width={60}
                height={60}
              />
              <div className={styles.chatbox__messages__message__detail}>
                <span>{message.name}</span>
                <span>{message.text}</span>
              </div>
            </div>
          );
        })}
        <div
          className={styles.chatbox__messages__end}
          ref={endOfMessagesRef}
        ></div>
      </div>
    </div>
  );
};

export default Chatbox;

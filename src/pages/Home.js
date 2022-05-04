import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created New Room !!!");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID and USERNAME required!");
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div className="homePageWrapper flex display-block m-auto items-center justify-center bg-slate-900 h-screen">
      <div className="formWrapper  p-10 h-84 w-150 bg-slate-800 rounded-lg">
        <div className=" rounded-lg m-auto">
          <div className="ml-7 flex items-center">
            <img
              src="/logo192.png"
              alt="react-logo"
              className="h-16 w-16"
            ></img>
            <span className="text-pink-400 text-xl pl-3 font-normal">
              {" "}
              <span className="text-pink-500 underline decoration-dashed font-semibold">Synchronized</span> Code Editor{" "}
            </span>
          </div>
        </div>

        <h4 className="m-2 pt-5 mainLabel text-pink-400 font-bold">
          Paste invitation ROOM ID
        </h4>
        <div className="flex flex-col inputGroup">
          <input
            type="text"
            className="p-1.5 bg-slate-200 inputBox m-2 rounded-lg border-none outline-none"
            placeholder="ROOM ID"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            value={roomId}
          />
          <input
            type="text"
            className=" p-1.5 bg-slate-200 inputBox m-2 rounded-lg border-none outline-none"
            placeholder="USERNAME"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
          <button
            className="btn joinBtn cursor-pointer h-8 
                bg-pink-400 text-pink-900 border-none 
                outlin-none rounded-lg w-20 text-lg 
                font-bold mt-3 m-auto
                hover:bg-pink-300 "
            onClick={joinRoom}
          >
            Join
          </button>
          <span className="createInfo text-white pt-5">
            If you don't have an invite then create &nbsp;
            <a
              onClick={createNewRoom}
              href=""
              className="createNewBtn text-pink-400 underline decoration-dashed
                font-bold hover:text-pink-300"
            >
              new Room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;

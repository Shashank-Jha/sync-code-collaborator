import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "D:/MERN PROJECTS/code-editor/src/Action";
import Client from "D:/MERN PROJECTS/code-editor/src/component/Client";
import Editor from "D:/MERN PROJECTS/code-editor/src/component/Editor";
import { initSocket } from '../socket';
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null); // socket change hone pr rerender nhi krega yh
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams(); // url se roomId get krliya

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connet_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket Connection failed, try again later");
        reactNavigator("/");
      }
      //client page khul gya hai mujhe join kralo
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listning for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room `);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className=" flex flex-row justify-start h-screen bg-slate-900">
      <div className="aside flex flex-col bg-slate-800">
        <div className="asideInner flex flex-col h-screen">
          <div className="logo bg-slate-700 p-2">
            <div className="ml-8 mr-8 mt-2 flex items-center ">
              <img
                src="/logo192.png"
                alt="react-logo"
                className="h-16 w-16"
              ></img>
              <span className="text-pink-400 text-xl pl-3 font-normal">
                {" "}
                Real Time Code Editor{" "}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-emerald-400 m-5 ">
            Connected...
          </h3>
          <div className="ml-10 clientsList flex flex-wrap gap-10">
            {clients.map((client) => (
              
                <Client key={client.socketId} username={client.username} />
            
            ))}
          </div>
        </div>
        <button
          className="
        cursor-pointer h-14 
        bg-slate-900 text-emerald-400 border-none 
        outlin-none rounded-lg w-1/2 text-lg 
        font-semibold mt-3 m-auto
        hover:bg-slate-600 "
          onClick={copyRoomId}
        >
          Copy ROOM ID
        </button>
        <button
          className="cursor-pointer h-8 w-1/2
                bg-pink-900 text-pink-100 border-none 
                outlin-none rounded-lg w-20 text-lg 
                font-bold mt-3 m-auto mb-5 
                hover:bg-pink-700"
          onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
      <div className="editorWrapper bg-slate-100 w-full h-full">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;

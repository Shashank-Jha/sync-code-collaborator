import React, { useEffect,useRef } from "react";
import "../App.css";
import Codemirror from "codemirror";
import ACTIONS from "../Action";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = ({socketRef, roomId, onCodeChange}) => {

  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("realTimeEditor"), {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
      // change ek codemirror ka event hai 
      editorRef.current.on('change',(instance,changes)=>{
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue'){
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
              roomId,
              code,
            });
        }
      })

      // editorRef.current.setValue(`console.log("WELCOME TO REAL-TIME CODE SYNCRONIZATION EDITOR :)");`);

     


    }
    init();
  }, []);

  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code !== null){
          editorRef.current.setValue(code);
        }
      })
    }
    
  },[socketRef.current]);

  return <textarea id="realTimeEditor"></textarea>;
};

export default Editor;

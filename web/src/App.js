import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [messageDetails, setMessageDetails] = useState({
    message: "",
    name: "",
  });
  const [chat, setChat] = useState([]);

  const [commentDetails, setCommentDetails] = useState({
    name: "",
    comment: "",
  });
  const [comments, setComments] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("messageReply", ({ name, message, dateTime }) => {
      setChat([...chat, { name, message, dateTime }]);
    });
    socketRef.current.on("comment", ({ name, comment }) => {
      setComments([...comments, { name, comment }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat, comments]);

  const onMessageDetailsChange = (e) => {
    setMessageDetails({ ...messageDetails, [e.target.name]: e.target.value });
  };
  const onCommentDetailsChange = (e) => {
    setCommentDetails({ ...commentDetails, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = messageDetails;
    socketRef.current.emit("messageSend", { name, message });
    e.preventDefault();
    setMessageDetails({ message: "", name });
  };

  const onCommentSubmit = (e) => {
    const { name, comment } = commentDetails;
    debugger;
    socketRef.current.emit("comment", { name, comment });
    e.preventDefault();
    setCommentDetails({ comment: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message, dateTime }, index) => (
      <div key={index}>
        <h3>
          {`${name}(${dateTime})`}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <div className={"row"}>
        <form onSubmit={onMessageSubmit}>
          <h1>Messenger</h1>
          <div className="name-field">
            <TextField
              name="name"
              onChange={(e) => onMessageDetailsChange(e)}
              value={messageDetails.name}
              label="Name"
            />
          </div>
          <div>
            <TextField
              name="message"
              onChange={(e) => onMessageDetailsChange(e)}
              value={messageDetails.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />
          </div>
          <button>Send Message</button>
        </form>
        <div className="render-chat">
          <h1>Chat Log</h1>
          {renderChat()}
        </div>
      </div>

      <div className={"row"}>
        <form onSubmit={onCommentSubmit}>
          <h1>Comments</h1>
          <div className="name-field">
            <TextField
              name="name"
              onChange={(e) => onCommentDetailsChange(e)}
              value={commentDetails.name}
              label="Name"
            />
          </div>
          <div>
            <TextField
              name="comment"
              onChange={(e) => onCommentDetailsChange(e)}
              value={commentDetails.comment}
              id="outlined-multiline-static"
              variant="outlined"
              label="Comment"
            />
          </div>
          <button>Post Comment</button>
        </form>
        <div className="render-chat">
          <h1>Comments</h1>
          {comments.map((m) => {
            return (
              <div>
                <h3>{m.name}</h3>
                <span>{m.comment}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

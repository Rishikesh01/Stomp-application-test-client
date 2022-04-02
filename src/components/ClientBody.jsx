import { useState } from "react";
import "./ClientStyling.css";
import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
export const ClientBody = () => {
  let [data, setData] = useState({
    authUrl: "",
    stompUrl: "",
    destination: "",
    subscribe: "",
    headers: [],
  });

  let [messageData, setMessageData] = useState({
    message: "",
  });

  let [incomingMessageData, setIncomingMessageData] = useState({
    message: [],
  });
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
    console.log(name);
  };

  const messageDataHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMessageData({ ...messageData, [name]: value });
  };

  let stomp = new Client({
    webSocketFactory: () => {
      return new SockJS(data.stompUrl);
    },
  });

  const connectToStompServer = () => {
    fetch(data.authUrl, {
      method: "POST",
      headers: new Headers({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        Authorization: data.headers,
      }),
    });

    stomp.activate();
  };

  const Disconnect = () => {
    stomp.deactivate();
  };

  const sendMessage = () => {
    stomp.publish({
      destination: data.destination.toString(),
      body: messageData.message.toString(),
      headers: { "content-type": "application/json" },
    });
  };

  const getMessage = (message) => {
    if (message.body) {
      console.log("message exits");
      setIncomingMessageData({ ...incomingMessageData, message: message.body });
    } else {
      console.log("no message");
    }
  };

  const subcribe = () => {
    stomp.subscribe(data.subscribe, getMessage);
  };

  return (
    <div className="container">
      <form>
        <div>
          <label>stompUrl:</label>
          <input
            onChange={inputHandler}
            type={"text"}
            name={"stompUrl"}
            value={data.stompUrl}
          />
        </div>
        <div>
          <label>authUrl:</label>
          <input
            onChange={inputHandler}
            type={"text"}
            name={"authUrl"}
            value={data.authUrl}
          />
        </div>
        <div>
          <label>Subcribe:</label>
          <input
            onChange={inputHandler}
            type={"text"}
            name={"subscribe"}
            value={data.subscribe}
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            onChange={inputHandler}
            type={"text"}
            name={"destination"}
            value={data.destination}
          />
        </div>
        <div>
          <label className="label label-default">Add Headers:</label>
          <input
            onChange={inputHandler}
            type={"text"}
            name={"headers"}
            value={data.headers}
          />
        </div>
        <div className="col">
          <input
            type={"button"}
            onClick={connectToStompServer}
            value="Connect"
          />
          <input type={"button"} onClick={Disconnect} value="Disconnect" />
        </div>
      </form>
      <div>
        <textarea
          onChange={messageDataHandler}
          name={"message"}
          value={messageData.message}
        ></textarea>
      </div>
      <div>
        <input type={"button"} onClick={sendMessage} value="send message" />
      </div>
      <div>
        <label> incoming message</label>
      </div>
      <div>
        <textarea
          readOnly={true}
          name={" incoming-message"}
          value={incomingMessageData.message}
        ></textarea>
      </div>
      <div>
        <input type={"button"} onClick={subcribe} value="subcribe" />
      </div>
    </div>
  );
};

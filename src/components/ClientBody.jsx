import { useState } from "react";
import "./ClientStyling.css";
import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
export const ClientBody = () => {
  const [data, setData] = useState({
    authUrl:"",
    stompUrl: "",
    subscribe: "",
    headers: [],
  });

  const [messageData, setMessageData] = useState({
    message: "",
  });

  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
    console.log(value)
  };

  const messageDataHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMessageData({ ...messageData, [name]: value });
    console.log(name);
  };

  const sendMessage = () => {
    console.log(messageData.subscribe);
    stomp.publish({
      destination: data.subscribe,
      body: messageData.message,
      headers: "Content-Type:application/json",
    });
  };

  const stomp = new Client({
    webSocketFactory: () => {
      return new SockJS(data.stompUrl);
    },
    debug: function (str) {
      console.log(str);
    },
  });

  const Disconnect = () => {
    stomp.deactivate();
  };

  const connectToStompServer = () => {
    fetch(data.authUrl, {
      method: "POST",
      headers: new Headers({
        "Access-Control-Allow-Origin":"http://localhost:3000/",
        "Authorization": "Basic dGVzdDp0ZXN0"
      }),
    });
    stomp.activate();
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
    </div>
  );
};

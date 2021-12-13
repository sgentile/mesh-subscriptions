import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Button, Grid, TextField } from "@mui/material";
import gql from "graphql-tag";
import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
interface ChatMessage {
  content: string;
}

interface ChatGroup {
  groupId: string;
  name: string | null;
}

const createNewMessageMutation = gql`
  mutation createNewMessage($messageInput: MessageInput!) {
    createNewMessage(messageInput: $messageInput) {
      content
    }
  }
`;

const newMessageSubscription = gql`
  subscription newMessage {
    newMessage {
      content
    }
  }
`;

const Home: NextPage = () => {
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>(
    []
  );

  const currentChatGroup = { groupId: "testGroupId", name: "testGroup" };
  const [userName, setUserName] = useState("Test Chat User");
  const [messageInput, setMessageInput] = useState("");

  const APP_ID = "testAppId";
  const [createNewMessage] = useMutation(createNewMessageMutation, {
    onError: (error): void => {
      console.error({ error });
    },
  });

  const handleMessageChange = (event: any) => {
    setMessageInput(event.target.value);
  };
  const sendMessage = () => {
    createNewMessage({
      variables: {
        messageInput: {
          content: messageInput,
        },
      },
    });
  };

  useSubscription(newMessageSubscription, {
    fetchPolicy: "network-only",
    // variables: { groupId: currentChatGroup?.groupId, appId: APP_ID },
    onSubscriptionData: (d) => {
      console.log("sub data", d);
      setCurrentChatMessages([
        ...currentChatMessages,
        d.subscriptionData.data.newMessage,
      ]);
    },
  });
  return (
    <div className={styles.container}>
      <Grid item>
        <TextField size={"small"} onChange={handleMessageChange}></TextField>
      </Grid>
      <Button onClick={sendMessage} variant="contained">
        Send Message
      </Button>
      {currentChatMessages?.map(
        (chatMessage: ChatMessage) => chatMessage.content
      )}
    </div>
  );
};

export default Home;

import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Button, Grid, TextField } from "@mui/material";
import gql from "graphql-tag";
import type { NextPage } from "next";
import React, { useState } from "react";
interface ChatMessage {
  content: string;
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

  const [messageInput, setMessageInput] = useState("");

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
    onSubscriptionData: (d) => {
      console.log("Subscription Data recieved:", d);
      setCurrentChatMessages([
        ...currentChatMessages,
        d.subscriptionData.data.newMessage,
      ]);
    },
  });
  return (
    <Grid container>
      <Grid item>
        <TextField size={"small"} onChange={handleMessageChange}></TextField>
      </Grid>
      <Grid item>
        <Button onClick={sendMessage} variant="contained">
          Send Message
        </Button>
      </Grid>
      <Grid container item direction="column">
        <Grid item>Messages</Grid>
        {currentChatMessages?.map((chatMessage: ChatMessage) => (
          <Grid item>{chatMessage.content}</Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Home;

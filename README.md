### Install

run npm install in api and gateway folders

cd into the api folder

start the api

```
npm start
```

goto the playground:
http://0.0.0.0:9001/graphql

in one tab create the subscription listener

```
subscription messages {
  newMessage {
    content
  }
}
```

in another tab create a message

```
mutation createMessage {
  createNewMessage(messageInput: {content: "New Message"}){
    content
  }
}
```

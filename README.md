### Install

run npm install in api and gateway folders

cd into the api folder

start the api (if you want to run helix, goto helix-api folder)

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

expected result in subscription tab:

```
{
  "data": {
    "newMessage": {
      "content": "New Message"
    }
  }
}
```

### gateway

run the gateway next, cd into gateway, run npm start

attempt to use the same subscription as above

results in this error:

```
{
  "errors": [
    {
      "path": [
        "newMessage"
      ],
      "extensions": {},
      "name": "GraphQLError",
      "originalError": {},
      "source": {
        "locationOffset": {}
      },
      "stack": [
        "GraphQLError",
        "    at Object.relocatedError (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/utils/index.js:3761:12)",
        "    at mergeDataAndErrors (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/delegate/index.js:875:34)",
        "    at checkResultAndHandleErrors (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/delegate/index.js:863:38)",
        "    at Transformer.transformResult (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/delegate/index.js:966:16)",
        "    at /Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/delegate/index.js:1190:75",
        "    at /Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/utils/index.js:3693:43",
        "    at new Promise (<anonymous>)",
        "    at asyncMapValue (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/utils/index.js:3693:12)",
        "    at mapResult (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/@graphql-tools/utils/index.js:3664:39)",
        "    at async Object.next (/Users/sgentile/Documents/Workspaces/mesh-subscriptions/gateway/node_modules/graphql/execution/mapAsyncIterator.js:41:24)"
      ]
    }
  ],
  "data": null
}
```

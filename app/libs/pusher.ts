import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us2',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: 'us2',
  }
);


// TODO: Whenever the server needs to push a change to the client, use pusherServer.trigger
// once the server triggers a change, the client needs to reflect it (binding the event)
// Subscribe and bind to the event in a useEffect hook
// On unmount, unsubscribe and unbind
//
// TODO:
// What should happen when a message is sent for the sender?
// 1. The message is automatically displayed in the current users screen
// 2. The message is seen by the current user
// 3. The newest message is updated in the conversations tab
// 4. Conversation scrolls to the bottom
//
// TODO:
// What should happen when a message is received?
// 1. Automatically displayed on the current users screen if they are in the conversation
// 2. Automatically updated in the users conversations list
// 3. Seen status on the message is updated
// 4. Conversation scrolls to the bottom 
//
// TODO:
// Seen status should also automatically update whenever a user sees a message (pusher trigger for other users)
// Extra: Handle edit messages (first update seen on messages, then allow editing as well)
//
// TODO:
// Any complications for groups?
// Adding new conversations should instantly push that to any users added to the group conversation.
// This should also be done with any new conversation requests
// Any general changes are binded to the users email... is that a good idea? Bind to id or something? Could that be a security risk?
// uhh prob not since you need the secret and stuff in order to be able to bind, and if you let other people have those its ggs for security already anyways

## Additional Features to Implement
### Pagination for messages COMP
  - Offset Pagination:
    - two additional parameters are added to the database query
      - offset: how many records to skip before we reach the data we're looking for
      - limit: how many records we are fetching 
    - The issue with Offset Pagination is that to go through the offset takes O(n) time. This can be addressed with Cursor Pagination
  - Cursor Pagination: 
    - with Cursor Pagination, we use pointers within each record to fetch the corresponding record
    - the pointer here can be a specially created one, or simply an enumerated id
    - basically providing a place to start, instead of stepping through records with an offset
  - Implementation Details:
    - Implementing Cursor Pagination: better for live data that is constantly updating 
    - Add in a field in the database that increments with each messages
      - NOTE: It doesn't seem like Prisma supports auto-incrementing for fields that aren't ids. Just something to watch out for 
    - On initial load of a conversation, fetch the last 20 messages
    - On scrolling to the top of the conversation, fetch the previous 20 messages based on the increment field
    - NextJS Annoyances:
      - The initial data load occurs in the conversation page server component
        - The variable here is initialMessages
      - Refreshes are triggered through the client Body component
        - Ok to update the message state

### Group messaging
- Clicking on the top right button opens up a small menu that allows you to select people to add to a conversation... 
- Open to a new conversation screen
### Search bar
- Search for conversations
- Search for users
### Message editing
  - Hover sections: more, reply, reaction
    - Occurs when hovering over the entire row
    - date only displays when hover over the text box
### User active status
### Conversation Settings
  - Pinned messages
  - Conversation Themes
  - Icons
  - Search

## Bugs
### Pusher connections... not too sure what's going on here
  - The connections need to be closed when:
    - The user closes the page
    - The user logs out 
  - Implementing connection opening and closing in Pusher
    1. When the user logs in, need to authenticate the user through pusher with the user data and socket information
    2. If possible, check for already open connections, and use those if available, otherwise open new connections?
      - This... might not be possible? Don't see any documentation for it. 
    3. On logout, disconnect connections. If 2 is not possible, also need to disconnect when closed or restarted. It's supposed to be doing this automatically?
      - Maybe it's because I'm in dev
  - This looks like it might be an issue with hot reloading in development.
### Pusher event handling
  - Cannot bind multiple events using the pusherClient.bind() function
  - Solution: use pusherClient.bind_global() and handle events individually within


## Interesting Tips and Tricks (Lessons Learned)
### CSS
- Use absolute positioning within a relative div (with top, bottom, left, right) to positive relative to the relative parent div
- Use transforms and translates to position relative to the div's own proportions 
### Tailwind
- Add custom classes (ex. radial gradients) through the tailwind.config.ts file


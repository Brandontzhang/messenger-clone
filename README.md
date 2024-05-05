## Notes for the future
- Additional Items to consider for future projects:
  - How do sockets actually work? Is there another server managing the calls? Seems to be like so for Pusher. How would I create one myself?
  - State management across child components. useContext is a bit annoying, maybe look into Redux?

## Additional Features to Implement
- Pagination for messages
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

- Group messaging
- Message editing
- Conversation Settings
  - Pinned messages
  - Conversation Themes
  - Icons
  - Search

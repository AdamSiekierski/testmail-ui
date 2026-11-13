# testmail-ui

A tiny local browser for [Testmail](https://testmail.app) inboxes: pick an inbox (tag), list its emails, read them as HTML, text or raw JSON.

```bash
cp .env.example .env   # fill in your Testmail API key and namespace
bun server.ts          # http://localhost:4777 (PORT to change)
```

The API key stays on the server; the page only calls the local `/api/*` proxy. The server binds to `127.0.0.1`.
Testmail has no "list tags" call, so the inbox list is built from the 500 most recent emails.

# Trello Real‑Time Board — Frontend & Backend

This repository contains a production‑style implementation of a real‑time Trello‑like board using **React**, **Node.js/Express**, **Socket.IO**, and **Trello REST APIs + Webhooks**. The project supports:
- Real‑time synchronization across multiple clients
- Card creation, deletion, updation, movement between lists
- Drag‑and‑drop card reordering
- Webhook‑driven updates from Trello
- Full Postman Collection (v2.1)

---
##  Demo Video
Click the thumbnail below to watch the full demonstration:

[![Demo Video](https://img.youtube.com/vi/uD3tRlTwwiY/maxresdefault.jpg)](https://youtube.com/watch?v=uD3tRlTwwiY)

---

##  Repository Structure
```
root/
│── frontend/      # React application
│── backend/       # Node.js/Express API + Webhook + Socket.IO
└── README.md
```

---

##  Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/SMDevJi/TrelloWeb.git
cd TrelloWeb
```

### 2. Install dependencies
#### Backend
```
cd backend
npm install
```
#### Frontend
```
cd frontend
npm install
```

### 3. Create Environment Files

#### Backend `.env` (See `.env.example` for reference)
```

TRELLO_API_KEY=your_trello_key
TRELLO_API_TOKEN=your_trello_token
TRELLO_USERNAME=trello_username
TRELLO_API_BASE = https://api.trello.com/1
PORT=3000
PUBLIC_URL=https://your-ngrok-url

```

#### Frontend `.env`
```
VITE_BACKEND_URL=http://localhost:3000
```

---

##  How to Obtain Trello API Key & Token
1. Visit the Trello API key page:
   https://trello.com/power-ups/admin
2. Click 'New', enter details and create your power up.
3. Click on 'Generate API Key' and copy the key.
4. Click on 'Generate a token', allow permission, then copy the key.
4. Paste these and your Trello username in .env file

---

##  Webhook handling
Trello requires a publicly accessible callback URL.  
You can use **ngrok** (for local development).

### 1. Start your backend
```
cd backend
npm start
```

### 2. Expose backend using ngrok
```
ngrok http 3000
```
Copy the generated HTTPS URL and paste in .env file at PUBLIC_URL


The backend will now receive updates from Trello.



### Trello Webhook Registration — Automatically Handled in Backend
When a **new board is created**, the backend automatically registers a Trello webhook. No manual action is required .

For reference, here is the exact API request the backend executes internally:

```js
await axios.post(
  `${BASE}/webhooks/`,
  new URLSearchParams({
    description: `Webhook for board ${board.id}`,
    callbackURL: `${process.env.PUBLIC_URL}/trello/webhook`,
    idModel: board.id,
    key: auth.key,
    token: auth.token
  })
);
```

And the equivalent `curl` form (for reference only):
```bash
curl --request POST \
  --url "https://api.trello.com/1/webhooks/?key=<YOUR_API_KEY>&token=<YOUR_API_TOKEN>" \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data "description=Webhook for board <BOARD_ID>&callbackURL=<PUBLIC_WEBHOOK_URL>&idModel=<BOARD_ID>&key=<YOUR_API_KEY>&token=<YOUR_API_TOKEN>"
```



##  Running the Project
### Backend
```
cd backend
npm start
```
### Frontend
```
cd frontend
npm run dev
```
Open two browser windows to see real‑time sync in action.

---

##  Postman Collection (v2.1)
A complete API collection (v2.1 format) is included in:
```
/TrelloWeb.postman_collection.json
```
It contains examples for:
- Create Card
- Update Card
- Delete Card
- Create Board
- GetBoardDetails  (To get some information required for other endpoints)
---

##  Testing
Use the included Postman collection. Import and run requests directly.

---

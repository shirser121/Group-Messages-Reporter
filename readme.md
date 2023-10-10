# WhatsApp Web Bot

A bot that listens to messages from specified WhatsApp groups and forwards them to a designated API.

## 🚀 Features

- **QR Authentication**: Easily scan and connect.
- **Auto Reconnection**: Handles disconnects and errors seamlessly.
- **API Integration**: Forwards group messages to an API.
- **Popup Handling**: Automatically dismisses any dialog popups.

## 🛠 Setup

1. **Clone the Repository**:
   ```
   git clone https://github.com/your_username/whatsapp-web-bot.git
   cd whatsapp-web-bot
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Configuration**:

Create a `config.json` in the root directory with the following format:

```json
{
"url": "YOUR_API_ENDPOINT",
"authorization": "YOUR_API_AUTHORIZATION_HEADER",
"groupsIds": ["GROUP_ID1", "GROUP_ID2"]
}
```

Alternatively, you can set groupsIds to empty array to listen to all groups.
```json
{
   "url": "YOUR_API_ENDPOINT",
   "authorization": "YOUR_API_AUTHORIZATION_HEADER",
   "groupsIds": []
}
```

4. **Run the Bot**:
   ```
   npm start
   ```

5. **Scan the QR Code**:
    - Open WhatsApp on your phone.
    - Go to `Settings > Linked devices > Link a device`.
    - Scan the QR code displayed in the terminal.


6. **Start Chatting**:
    - Send a message to any of the groups specified in `config.json`.
    - The bot will forward the message to the API.

## 🔧 Troubleshooting

- Ensure your phone maintains connection with WhatsApp Web.
- If the bot doesn't connect, try restarting or scanning the QR code again.

## 📝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

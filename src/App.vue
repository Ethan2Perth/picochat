<template>
  <div class="app">
    <div class="chat-title">
      <div class="title-line">PicoChat</div>
    </div>
    <div v-if="connectionClosed" class="connection-closed">"The connection has been lost. Please refresh the page, otherwise there is a small chance that the sent messages may be lost."</div>
    <div class="chat-container">
      <div class="chat-messages" ref="chatMessages">
        <div v-for="message in messages" :key="message.id" class="message">
          <div class="message-sender">{{ message.sender }}</div>
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Enter to send..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      socket: null,
      connectionClosed: false,
      unsentMessages: [],
    };
  },
  mounted() {
    this.initWebSocket();
    this.messages = [];
    this.fetchMessages();
    this.loadUnsentMessages();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    initWebSocket() {
      const socketUrl = 'ws://127.0.0.1:3939';
      this.socket = new WebSocket(socketUrl);

      this.socket.addEventListener('open', () => {
        console.log('WebSocket connected');
        this.connectionClosed = false;
        this.sendUnsentMessages();
      });

      this.socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        this.messages.push(message);
        this.scrollToBottom();
      });

      this.socket.addEventListener('close', () => {
        console.log('WebSocket disconnected');
        this.connectionClosed = true;
      });
    },
    fetchMessages() {
      axios
        .get('http://127.0.0.1:3939/api/messages')
        .then((response) => {
          this.messages = response.data;
          this.scrollToBottom();
        })
        .catch((error) => {
          console.error('Failed to fetch messages:', error);
        });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') {
        return;
      }

      const newMessage = {
        id: Date.now(),
        sender: 'wow',
        content: this.newMessage,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      };


if (this.socket.readyState === WebSocket.OPEN) {
  // If WebSocket connection is open, send the message immediately
  this.socket.send(JSON.stringify(newMessage));
} else {
  // If WebSocket connection is not open, add the message to unsentMessages
  this.unsentMessages.push(newMessage);
  localStorage.setItem('unsentMessages', JSON.stringify(this.unsentMessages));
}

// Add the message to the messages array
this.messages.push(newMessage);
this.newMessage = '';
this.scrollToBottom();


    },
    sendUnsentMessages() {
      if (this.unsentMessages.length === 0) {
        return;
      }

      this.unsentMessages.forEach((message) => {
        // Send the unsent message only if the WebSocket connection is open
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(message));
        }
      });

      // Clear the unsent messages array and remove the data from local storage
      this.unsentMessages = [];
      localStorage.removeItem('unsentMessages');
    },
    loadUnsentMessages() {
      const unsentMessages = localStorage.getItem('unsentMessages');
      if (unsentMessages) {
        this.unsentMessages = JSON.parse(unsentMessages);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    },
  },
};
</script>


<style>
.app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa; /* 更浅的背景色 */
  font-family: "Roboto", Arial, sans-serif; /* 简洁字体 */
}

.chat-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.title-line {
  line-height: 1.2;
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  /* 添加阴影效果 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  margin-top: 10px; /* 将聊天容器下移 */
  background-color: #ffffff;
  border: 1px solid #e3e5e8; /* 边框颜色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 更柔和的阴影 */
}

.message-sender {
  color: #4a90e2; /* 发送者名称颜色 */
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.message-sender {
  font-weight: bold;
}

.message-content {
  margin-top: 5px;
  background-color: #f0f2f5; /* 消息背景色 */
  border-radius: 8px; /* 圆角 */
  padding: 8px 12px; /* 内边距 */
}


.message-time {
  font-size: 12px;
  color: #9a9a9a; /* 时间戳颜色 */
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8f8f8;
  /* 添加阴影效果 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 10px; /* 将输入框下移 */
}

.chat-input input {
  flex: 1;
  padding: 5px;
  border-radius: 5px;
  border: none;
  outline: none;
  border: 1px solid #e3e5e8; /* 输入框边框 */
}

.chat-input button {
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  /*background-color: #4caf50;
  color: white;*/
  cursor: pointer;
  background-color: #4a90e2; /* 按钮颜色 */
  color: white; /* 按钮文字颜色 */
}

.connection-closed {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: red;
  margin-top: 10px;
}

.chat-messages::-webkit-scrollbar {
  width: 5px; /* 设置滚动条宽度 */
}

.chat-messages::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 设置滚动条背景色 */
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #888; /* 设置滚动条滑块颜色 */
  border-radius: 4px; /* 设置滚动条滑块的圆角 */
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 设置鼠标悬停时滚动条滑块颜色 */
}

</style>


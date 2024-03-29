const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const Message = require('./Message.js');

const app = express();
const port = 3939;


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.js');
const router = express.Router();



// 连接到MongoDB数据库
mongoose.connect('mongodb://localhost:27017/userdata', {
  
})
  .then(() => {
    console.log('Connected to userdata');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// 注册
router.post('/LoginRegister/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// 登录
router.post('/LoginRegister/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 创建并返回JWT令牌
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});


module.exports = router;


// 使用内存数组存储聊天消息
let messages = [];

// 解析请求体中的 JSON 数据
app.use(express.json());

// 允许跨域请求
app.use(cors());

// 连接到MongoDB数据库
/*mongoose.connect('mongodb://localhost:27017/chatdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to chatdata');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
*/


// 处理 GET 请求，返回所有聊天消息
app.get('/api/messages', (req, res) => {
  // 从数据库中检索所有消息记录
  Message.find()
    .then(messages => {
      //console.log('Retrieved messages from database:', messages);
      res.json(messages);
    })
    .catch(error => {
      console.error('Error retrieving messages from database:', error);
      res.status(500).json({ error: 'Failed to retrieve messages from database' });
    });
});

// 处理 POST 请求，保存新的聊天消息
app.post('/api/messages', (req, res) => {
const newMessage = req.body;

const message = new Message({
sender: newMessage.sender,
content: newMessage.content,
time: newMessage.time
});

message.save()
.then(savedMessage => {
console.log('Message saved to database:', savedMessage);


  wss.clients.forEach(client => {
    client.send(JSON.stringify(newMessage));
  });

  res.status(201).json(newMessage);
})
.catch(error => {
  console.error('Error saving message to database:', error);
  res.status(500).json({ error: 'Failed to save message to database' });
});
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  let historyBroadcasted = false;

  // 处理新的 WebSocket 连接
  ws.on('message', (message) => {
    console.log('Received message:', message);

    

    // 解析接收到的消息为 JavaScript 对象
    const parsedMessage = JSON.parse(message);

    // 创建新的消息实例
    const newMessage = new Message(parsedMessage);

    // 将消息保存到数据库
    newMessage.save()
      .then(savedMessage => {
        console.log('Message saved to database:', savedMessage);

        // 广播消息给所有连接的客户端，除了当前客户端
        wss.clients.forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify(savedMessage));
          }
        });
      })
      .catch(error => {
        console.error('Error saving message to database:', error);
      });
    
  });
});


// 将 WebSocket 服务器附加到 Express 服务器
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  server.timeout = 600000;
  
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const taskRouter = require('./routes/taskRouter');
const { startSchedule } = require('./scheduler');
const PORT = process.env.PORT || 5000;
const app = express();
const allowedOrigins = ['http://localhost:8080', 'http://another-domain.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Не разрешено CORS'));
      }
    },
  })
);
app.use(express.json());
app.use('/auth', authRouter);
app.use('/task', taskRouter);

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://timealive:Rerere23@cluster.nwuaiol.mongodb.net/auth_roles?retryWrites=true&w=majority'
    );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    startSchedule();
  } catch (e) {
    console.log(e);
  }
};
start();

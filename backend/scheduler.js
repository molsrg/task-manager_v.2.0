const cron = require('node-cron');
const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://timealive:Rerere23@cluster.nwuaiol.mongodb.net/auth_roles?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const refreshToken = require('./models/refreshToken');
const DateNow = new Date(Date.now());
function startSchedule() {
  cron.schedule('* * * * *', async () => {
    console.log('Загрузка очистки базы данных');
    try {
      const result = await refreshToken.deleteMany({
        expiresAt: { $lt: DateNow },
      });
      console.log(
        'Все круто брат, БД почистили:',
        result.deletedCount,
        'документов удалено'
      );
    } catch (err) {
      console.log('Ошибка:', err);
    }
  });
}

module.exports = { startSchedule };

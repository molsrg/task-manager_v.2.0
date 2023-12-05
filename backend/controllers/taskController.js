const jwt = require('jsonwebtoken');
const { AccessSecret } = require('../config');
const Task = require('../models/Task');
const TaskList = require('../models/taskList');
const authValidation = (req) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new Error('Нет токена доступа в запросе');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Неверный формат токена');
    }
    return parts[1];
  } catch (error) {
    throw new Error('Ошибка при валидации токена', error);
  }
};
getIdFromToken = (token) => {
  try {
    id = jwt.verify(token, AccessSecret).id;
    return id;
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка при получении id');
  }
};

class TaskController {
  async createTask(req, res) {
    try {
      const { name, type, text, status, startTime, endTime } = req.body;
      const token = authValidation(req);
      const id = getIdFromToken(token);
      const task = new Task({
        name: name,
        type: type,
        text: text,
        status: status,
        startTime: startTime,
        endTime: endTime,
        owner: id,
      });

      const existingTaskList = await TaskList.findOne({
        owner: id,
        startTime: { $lte: new Date(startTime) },
        endTime: { $gte: new Date(endTime) },
      });
      console.log(existingTaskList);
      if (existingTaskList) {
        existingTaskList.tasks.push(task);
        await existingTaskList.save();
      }

      await task.save();
      res.status(201).json({ message: 'Задача успешно создана', task });
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при создании задачи', error });
    }
  }
  async getTasks(req, res) {
    try {
      const { startTime, endTime } = req.query;
      const token = authValidation(req);
      const id = getIdFromToken(token);
      const tasks = await Task.find({
        startTime: { $gte: new Date(startTime) },
        endTime: { $lte: new Date(endTime) },
        owner: id,
      });
      return res.status(200).json({ tasks });
    } catch (error) {
      res.status(401).json({ message: 'Ошибка при поиске задач', error });
    }
  }
  async editTask(req, res) {
    try {
      const { name, type, text, status, startTime, endTime, id } = req.body;
      const token = authValidation(req);
      Task.findByIdAndUpdate(id, {
        name: name,
        type: type,
        text: text,
        status: status,
        startTime: startTime,
        endTime: endTime,
        owner: id,
      });
    } catch (error) {
      res.status(200).json({ message: 'Непредвиденная ошибка', error });
    }
  }
  async createTaskList(req, res) {
    try {
      const { title, toggleCircle, isTasklistVisible, startTime, endTime } =
        req.body;
      const token = authValidation(req);
      const id = getIdFromToken(token);
      //
      const existingLists = await TaskList.find({
        owner: id,
      });
      let isValid = true;
      console.log(existingLists);
      existingLists.forEach((element) => {
        if (element.title === title) {
          isValid = false;
        }
        console.log(isValid);
      });

      if (!isValid) {
        return res
          .status(400)
          .json({ message: 'Лист с таким названием уже существует' });
      }
      //
      const tasks = await Task.find({
        startTime: { $gte: new Date(startTime) },
        endTime: { $lte: new Date(endTime) },
        owner: id,
      });
      const taskList = new TaskList({
        title: title,
        toggleCircle: toggleCircle,
        isTasklistVisible: isTasklistVisible,
        tasks: tasks,
        startTime: startTime,
        endTime: endTime,
        owner: id,
      });
      await taskList.save();
      res.status(200).json({ message: 'Лист задач успешно создан' });
    } catch (error) {
      console.log(error);
      throw new Error('Ошибка при создании списка');
    }
  }
  async getTaskList(req, res) {
    try {
      const token = authValidation(req);
      const id = getIdFromToken(token);
      const tasksList = await TaskList.find({
        owner: id,
      });
      res.status(200).json({ tasksList });
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при получении задачи', error });
    }
  }
}
module.exports = new TaskController();
//метод для создания задачи (done)
//чтение задач в промежутке времени (done)
// метод для редактирования задачи (done)
//методы для создания/получения и хранения именованных списков задач (done)
// метод для создания списка задач
// метод для удаления задачи (?)
//уведомление о скором сроке завершения задачи

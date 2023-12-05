const Router = require('express');
const router = new Router();
const controller = require('../controllers/taskController');
router.post('/createTask', controller.createTask);
router.get('/getTask', controller.getTasks);
router.post('/createTaskList', controller.createTaskList);
router.get('/getTaskList', controller.getTaskList);

module.exports = router;

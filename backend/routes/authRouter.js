const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/gh_oauth', controller.gh_oauth);

module.exports = router;

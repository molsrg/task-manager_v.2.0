import Vuex from 'vuex'
import User from './modules/User'
import Calendar from './modules/Calendar'
import Application from './modules/Application'
const store = new Vuex.Store ({

    modules: {
        User, 
        Calendar,
        Application
    }
})


export default store 

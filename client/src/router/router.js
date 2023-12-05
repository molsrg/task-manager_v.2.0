import { createRouter, createWebHistory } from 'vue-router'
import Authorization from '../views/AuthorizationClient.vue'
import Home from '../views/HomePage.vue'
import Waiting from '../components/WaitingApp.vue'
import PersonalArea from '../views/PersonalArea.vue'


const routes = [
    {
        path:'/',
        name:'Authorization',
        component: Authorization,
    },
    {
        path: '/home',
        name: 'Home', 
        component: Home
    }, 
    {
        path: '/waiting',
        name: 'Waiting', 
        component: Waiting
    }, 
    {
        path: '/personal',
        name: 'PersonalArea', 
        component: PersonalArea
    }, 

    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
import Vue from 'vue';
import Router from 'vue-router';

// Custom.
import Login from '@/components/Login/Login';
import Home from '@/components/Home/Home';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Login
        }, {
            path: "/home",
            component: Home
        }
  ]
});
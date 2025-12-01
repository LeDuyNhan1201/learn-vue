import SignIn from "@/views/pages/SignIn.vue";
import SignUp from "@/views/pages/SignUp.vue";
import Forgot from "@/views/pages/Forgot.vue";
import Reset from "@/views/pages/Reset.vue";
import type {RouteRecordRaw} from "vue-router";

const authRoutes: RouteRecordRaw[] = [
    {
        path: '/auth',        // prefix path
        name: 'Auth',         // parent route name
        children: [
            {
                path: 'sign-in',  // full path: /auth/sign-in
                name: 'SignIn',
                component: SignIn,
                meta: {title: 'Sign In'}
            },
            {
                path: 'sign-up',  // /auth/sign-up
                name: 'SignUp',
                component: SignUp,
                meta: {title: 'Sign Up'}
            },
            {
                path: 'forgot',   // /auth/forgot
                name: 'Forgot',
                component: Forgot,
                meta: {title: 'Forgot'}
            },
            {
                path: 'reset',    // /auth/reset
                name: 'Reset',
                component: Reset,
                meta: {title: 'Reset password'}
            }
        ],
    }
]

export default authRoutes
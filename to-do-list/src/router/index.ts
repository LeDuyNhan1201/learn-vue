import {createRouter, createWebHistory} from 'vue-router';
import authRoutes from '@/router/auth.routes';
import tasksRoutes from '@/router/tasks.routes';
import {useUserStore} from "@/stores/user.store.ts";

const routes = [
    ...authRoutes,
    ...tasksRoutes,
    {path: '/', redirect: '/tasks'}, // default route
    {path: '/:pathMatch(.*)*', redirect: '/tasks'} // fallback
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();
    if (to.meta.requiresAuth && !userStore.isAuthenticated) next('/auth/login')
    else {
        document.title = typeof to.meta.title === 'function'
            ? to.meta.title(to)
            : to.meta.title || 'To Do List';
        next();
    }
});

export default router;
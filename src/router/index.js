import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainView from "@/views/MainView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        // {
        //     path: '/main',
        //     name: 'main',
        //     component: MainView
        // }
        {
            path: '/:username/main', // 修改为动态路径参数
            name: 'MainView',
            component: () => import('../views/MainView.vue'),
            props: true // 允许将路由参数作为 props 传递
        },
        {
            path: '/:username/autoaim', // 修改为动态路径参数
            name: 'AutoAimView',
            component: () => import('../views/AutoAimView.vue'),
            props: true // 允许将路由参数作为 props 传递
        },
    ]
})

/* 默认跳转页面 */
// router.beforeEach((to, from, next)=>{
//     if(to.path == '/login'){
//         next()
//     }else{
//         const username = sessionStorage.getItem("username")
//         if(username == null){
//             next('/login')
//         }else{
//             next()
//         }
//     }
// })

export default router
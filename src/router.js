import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/Default'
import Login from '@/components/Login'
import Employee from '@/components/Employee'
import QueryImage from '@/components/QueryImage'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path:'/',
      name:'Default',
      component: Default,
      meta:{
        requireAuth: true
      },
      children:[
        {
          path: 'Employee',
          name: 'Employee',
          component: Employee
        },
        {
          path: 'QueryImage',
          name: 'QueryImage',
          component: QueryImage
        }
      ]
    }
  ]
})

export default router;

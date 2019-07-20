import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/Default'
import Login from '@/components/Login'
import Employee from '@/components/Employee'
import QueryImage from '@/components/QueryImage'
import Dictionary from '@/components/Dictionary'
import DictionaryValue from '@/components/DictionaryValue'

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
        },
        {
          path: 'Dictionary',
          name: 'Dictionary',
          component: Dictionary
        },
        {
          path: 'DictionaryValue',
          name: 'DictionaryValue',
          component: DictionaryValue
        }
      ]
    }
  ]
})

export default router;

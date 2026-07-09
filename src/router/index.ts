import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/shared/views/HomeView.vue'
import AboutView from '@/shared/views/AboutView.vue'
import { pokemonRoute } from '@/pokemons/router'
import ClientsLayout from '@/clients/layout/ClientsLayout.vue'
import ClientList from '@/clients/pages/ClientList.vue'
import ClientPage from '@/clients/pages/ClientPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/counter',
      name: 'counter',
      component: () => import('../counter/views/CounterView.vue'),
    },
    {
      ...pokemonRoute,
      path: '/pokemons',
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsLayout,
      redirect: { name: 'list' },
      children: [
        { path: 'list', name: 'list', component: ClientList },
        { path: '/clients/:id', name: 'client-id', component: ClientPage }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      // redirect: () => ({ name: 'home' }),
      redirect: () => {
        console.log('ruta no existe')
        return { name: 'home' }
      }
    }
  ]
})

export default router;

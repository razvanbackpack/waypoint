import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from './components/layout/Layout'
import { Dailies } from './pages/Dailies'
import { Characters } from './pages/Characters'
import { Timers } from './pages/Timers'
import { Recipes } from './pages/Recipes'
import { RecipeDetailPage } from './pages/RecipeDetail'
import { Settings } from './pages/Settings'

// Root route component
const RootComponent = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

// Define the root route
const rootRoute = createRootRoute({
  component: RootComponent,
})

// Events/Timers route (index/home page)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Timers,
})

// Characters route
const charactersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/characters',
  component: Characters,
})

// Dailies route
const dailiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dailies',
  component: Dailies,
})


// Recipes route
const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recipes',
  component: Recipes,
})

// Recipe detail route
const recipeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recipes/$recipeId',
  component: RecipeDetailPage,
})

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  charactersRoute,
  dailiesRoute,
  recipesRoute,
  recipeDetailRoute,
  settingsRoute,
])

// Create the router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

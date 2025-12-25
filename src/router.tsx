import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from './components/layout/Layout'
import { TradingPost } from './pages/TradingPost'
import { Dailies } from './pages/Dailies'
import { Characters } from './pages/Characters'
import { Timers } from './pages/Timers'
import { Crafting } from './pages/Crafting'
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

// Characters route (index/home page)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Characters,
})

// Trading Post route
const tradingPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trading-post',
  component: TradingPost,
})

// Dailies route
const dailiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dailies',
  component: Dailies,
})

// Timers route
const timersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timers',
  component: Timers,
})

// Crafting route
const craftingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crafting',
  component: Crafting,
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
  tradingPostRoute,
  dailiesRoute,
  timersRoute,
  craftingRoute,
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

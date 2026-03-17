import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import PromotionList from '../views/PromotionList.vue'
import PromotionForm from '../views/PromotionForm.vue'
import PosDisplayView from '../views/PosDisplayView.vue'
import HistoryView from '../views/HistoryView.vue'
import ReportView from '../views/ReportView.vue'
import PanelManagementView from '../views/PanelManagementView.vue'

const routes = [
  { path: '/', redirect: '/promotions' },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  
  // Promotions
  { path: '/promotions', name: 'promotions-list', component: PromotionList },
  { path: '/promotions/create', name: 'promotions-create', component: PromotionForm },
  { path: '/promotions/:id/edit', name: 'promotions-edit', component: PromotionForm, props: true },
  { path: '/promotions/:id', name: 'promotions-detail', component: PromotionForm, props: route => ({ id: route.params.id, readonly: true }) },

  // POS Display & Panels
  { path: '/pos-display', name: 'pos-display', component: PosDisplayView },
  { path: '/panel-management', name: 'panel-management', component: PanelManagementView },
  
  // Data & Logs
  { path: '/history', name: 'history', component: HistoryView },
  { path: '/reports', name: 'reports', component: ReportView },

  // Placeholders for other modules requested in CRUD structure
  { path: '/users', redirect: '/dashboard' },
  { path: '/branches', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

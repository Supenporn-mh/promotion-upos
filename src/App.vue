<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans tracking-wide flex">
    <!-- Sidebar / Menu -->
    <aside class="w-[260px] bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col h-screen sticky top-0 z-20">
      <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white mr-3">
          <ph-storefront :size="20" weight="fill" />
        </div>
        <h1 class="text-[16px] font-semibold text-gray-900 tracking-tight">UPOS <span class="text-blue-600 font-medium">Plugin</span></h1>
      </div>
      <div class="flex-1 py-6 px-4 space-y-2 overflow-y-auto font-medium text-[13px] tracking-wide">
        <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] ml-2 mb-3 block">Main Menu</label>
        
        <router-link to="/dashboard" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <ph-squares-four :size="20" weight="bold" class="opacity-60" /> 
          แดชบอร์ด
        </router-link>
        
        <router-link to="/promotions" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <ph-tag :size="20" weight="bold" class="opacity-60" /> 
          รายการโปรโมชั่น
        </router-link>
        
        <router-link to="/pos-display" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center justify-between px-4 py-3 rounded-xl transition-all group text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <div class="flex items-center gap-3">
            <ph-desktop :size="20" weight="bold" class="opacity-60 group-hover:text-gray-900" /> 
            แสดงผลบน POS
          </div>
          <span class="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-md font-semibold">New</span>
        </router-link>

        <router-link to="/panel-management" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <ph-grid-four :size="20" weight="bold" class="opacity-60" /> 
          จัดการเมนูแนะนำ / Panel
        </router-link>
        
        <div class="pt-4 pb-2">
          <div class="border-t border-gray-100"></div>
        </div>
        <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] ml-2 mb-3 block">Data & logs</label>
        
        <router-link to="/history" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <ph-clock-counter-clockwise :size="20" weight="bold" class="opacity-60" /> 
          ประวัติการใช้งาน
        </router-link>
        
        <router-link to="/reports" active-class="bg-blue-50 text-blue-700 shadow-inner" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
          <ph-chart-bar :size="20" weight="bold" class="opacity-60" /> 
          รายงานภาพรวม
        </router-link>
      </div>
      
      <!-- Footer / Admin Info -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 shadow-inner">
          <div class="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex justify-center items-center text-blue-600 font-semibold text-xs">A</div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-semibold text-gray-900 truncate">Admin Account</p>
            <p class="text-[11px] text-gray-500 truncate">HQ Branch</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content container -->
    <main class="flex-1 flex flex-col min-w-0 bg-gray-50/50 relative">
      <!-- Mobile Header -->
      <header class="bg-white shadow-sm h-16 flex items-center px-6 border-b border-gray-100 shrink-0 md:hidden sticky top-0 z-10">
        <ph-list :size="24" weight="bold" class="text-gray-600 cursor-pointer" />
        <h1 class="text-lg font-semibold ml-3 text-gray-800 tracking-tight">UPOS Plugin</h1>
      </header>

      <!-- Router View Container -->
      <div class="flex-1 overflow-y-auto p-4 md:p-10 hide-scrollbar overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Global Components -->
    <BaseToast ref="toastRef" />
    <BaseConfirm 
      :show="confirmState.show" 
      :title="confirmState.title" 
      :message="confirmState.message" 
      :type="confirmState.type"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import BaseToast from './components/BaseToast.vue'
import BaseConfirm from './components/BaseConfirm.vue'

const toastRef = ref(null)
const confirmState = reactive({
  show: false,
  title: '',
  message: '',
  type: 'warning',
  resolve: null
})

const showToast = (msg, type = 'success') => toastRef.value?.addToast(msg, type)
const confirm = (options) => {
  confirmState.title = options.title || 'ยืนยัน'
  confirmState.message = options.message || 'ต้องการดำเนินการต่อหรือไม่?'
  confirmState.type = options.type || 'warning'
  confirmState.show = true
  return new Promise((resolve) => {
    confirmState.resolve = resolve
  })
}

const onConfirm = () => {
  confirmState.show = false
  if (confirmState.resolve) confirmState.resolve(true)
}

const onCancel = () => {
  confirmState.show = false
  if (confirmState.resolve) confirmState.resolve(false)
}

provide('globalUtils', { showToast, confirm })
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hide-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
}
</style>

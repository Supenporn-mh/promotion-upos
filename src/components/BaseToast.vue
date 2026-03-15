<template>
  <div class="fixed top-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] animate-toast-in"
        :class="[
          toast.type === 'success' ? 'bg-white border-green-100 text-green-800' : 
          toast.type === 'error' ? 'bg-white border-red-100 text-red-800' : 
          'bg-white border-blue-100 text-blue-800'
        ]"
      >
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          :class="[
            toast.type === 'success' ? 'bg-green-50 text-green-500' : 
            toast.type === 'error' ? 'bg-red-50 text-red-500' : 
            'bg-blue-50 text-blue-500'
          ]"
        >
          <ph-check-circle v-if="toast.type === 'success'" :size="20" weight="bold" />
          <ph-x-circle v-else-if="toast.type === 'error'" :size="20" weight="bold" />
          <ph-info v-else :size="20" weight="bold" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold tracking-tight">{{ toast.message }}</p>
        </div>
        <button @click="removeToast(toast.id)" class="text-gray-400 hover:text-gray-600 transition-colors">
          <ph-x :size="16" weight="bold" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let nextId = 0

const addToast = (message, type = 'success', duration = 3000) => {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), duration)
}

const removeToast = (id) => {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx > -1) toasts.value.splice(idx, 1)
}

defineExpose({ addToast })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>

<template>
  <div v-if="show" class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
    <div class="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 anime-slide-up text-center border border-gray-100">
      <div 
        class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
        :class="type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'"
      >
        <ph-warning-circle v-if="type === 'warning'" :size="32" weight="bold" />
        <ph-trash v-else :size="32" weight="bold" />
      </div>
      
      <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-[13px] font-medium text-gray-500 mb-8">{{ message }}</p>
      
      <div class="flex gap-3">
        <button 
          @click="$emit('cancel')" 
          class="flex-1 px-6 py-3.5 rounded-2xl font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all uppercase text-[11px] tracking-widest"
        >
          ยกเลิก
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 px-6 py-3.5 rounded-2xl font-bold text-white transition-all uppercase text-[11px] tracking-widest"
          :class="type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-500/20' : 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20'"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'ยืนยันการทำรายการ' },
  message: { type: String, default: 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ?' },
  type: { type: String, default: 'warning' } // warning, danger
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.anime-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

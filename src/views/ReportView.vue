<template>
  <div class="max-w-[1440px] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">รายงานภาพรวม (Reports)</h2>
        <p class="text-[13px] font-medium text-gray-500 mt-1.5 flex items-center gap-2"><ph-chart-bar weight="fill" class="text-gray-400" /> วิเคราะห์ประสิทธิภาพทางการตลาดและสรุปยอดขาย</p>
      </div>
      <div class="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
         <div class="w-full sm:w-40">
           <BaseInput id="rep_start" label="เริ่มวันที่" type="date" v-model="dates.start" />
         </div>
         <div class="w-full sm:w-40">
            <BaseInput id="rep_end" label="ถึงวันที่" type="date" v-model="dates.end" />
         </div>
         <button 
           @click="handleExport" 
           :disabled="isExporting"
           class="bg-primary-main text-white px-5 py-2.5 rounded-xl font-semibold uppercase tracking-widest active:scale-95 transition-all text-xs flex gap-2 h-11 items-center disabled:opacity-50 shadow-lg shadow-primary-main/20"
         >
            <ph-export weight="bold" v-if="!isExporting" />
            <ph-spinner weight="bold" class="animate-spin" v-else />
            {{ isExporting ? 'กำลังเตรียมไฟล์...' : 'ออกที่รายปันผล (Export)' }}
         </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <!-- Top Promotion Pie Chart Placeholder -->
       <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col items-center">
          <h3 class="font-bold text-gray-800 text-[13px] tracking-wide mb-8 w-full uppercase">สัดส่วนประเภทของโปรโมชันที่ถูกใช้</h3>
          <div class="relative w-48 h-48 rounded-full border-[20px] border-blue-600/20 flex justify-center items-center shadow-inner">
             <div class="absolute inset-0 border-[20px] border-blue-600 rounded-full" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 50%);"></div>
             <div class="absolute inset-0 border-[20px] border-teal-500 rounded-full" style="clip-path: polygon(100% 100%, 0 100%, 0 50%);"></div>
             <span class="text-2xl font-black text-gray-900">Total</span>
          </div>

          <div class="mt-8 flex gap-6 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
             <div class="flex items-center gap-2">
               <span class="w-3 h-3 bg-blue-600 rounded"></span> ส่วนลด (60%)
             </div>
             <div class="flex items-center gap-2">
               <span class="w-3 h-3 bg-teal-500 rounded"></span> ของแถม (30%)
             </div>
             <div class="flex items-center gap-2">
               <span class="w-3 h-3 bg-blue-600/20 rounded"></span> แลกซื้อ (10%)
             </div>
          </div>
       </div>

       <!-- Data Grid Table -->
       <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col">
          <h3 class="font-bold text-gray-800 text-[13px] tracking-wide mb-4 w-full uppercase border-b border-gray-100 pb-4">ตารางผลตอบแทนจากโปรโมชัน</h3>
          <div class="space-y-4 flex-1 mt-2">
             <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div>
                 <p class="font-semibold text-gray-800 text-sm">ลด 15% สมาชิกใหม่</p>
                 <p class="text-[10px] text-gray-400">ค่าใช้จ่ายแคมเปญ: 5,400 บาท</p>
               </div>
               <div class="text-right">
                 <p class="font-bold text-green-600">+12% ยอดขาย</p>
                 <p class="text-[10px] font-semibold text-gray-500">กำไรสุทธิ</p>
               </div>
             </div>

             <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div>
                 <p class="font-semibold text-gray-800 text-sm">ซื้อชาบู แถมเป๊ปซี่</p>
                 <p class="text-[10px] text-gray-400">ค่าใช้จ่ายต้นทุนของแถม: 3,200 บาท</p>
               </div>
               <div class="text-right">
                 <p class="font-bold text-green-600">+8% ลูกค้าใหม่</p>
                 <p class="text-[10px] font-semibold text-gray-500">การเข้าถึง</p>
               </div>
             </div>

             <div class="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
               <div>
                 <p class="font-semibold text-gray-800 text-sm">แลกซื้อน้ำดื่ม 5 บาท</p>
                 <p class="text-[10px] text-gray-400">ค่าใช้จ่ายสุทธิ: 800 บาท</p>
               </div>
               <div class="text-right">
                 <p class="font-bold text-red-600">-2% ขาดทุนย่อย</p>
                 <p class="text-[10px] font-semibold text-gray-500">ระยะสั้น</p>
               </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const dates = reactive({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const isExporting = ref(false)

const handleExport = () => {
    isExporting.value = true
    setTimeout(() => {
        isExporting.value = false
        alert('ส่งออกรายงาน Excel สำเร็จ! ไฟล์จะถูกดาวน์โหลดลงในเครื่องของคุณแล้ว')
    }, 1500)
}
</script>

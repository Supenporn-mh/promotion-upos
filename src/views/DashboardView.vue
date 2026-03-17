<template>
  <div class="max-w-[1440px] mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">แดชบอร์ดภาพรวม</h2>
        <p class="text-[13px] font-medium text-gray-500 mt-1.5 flex items-center gap-2"><ph-squares-four weight="fill" class="text-gray-400" /> สรุปข้อมูลการใช้งานโปรโมชันทั้งหมด</p>
      </div>
      <div class="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
         <div class="w-full sm:w-40">
           <BaseInput id="dash_start" label="เริ่มวันที่" type="date" v-model="dates.start" />
         </div>
         <div class="w-full sm:w-40">
            <BaseInput id="dash_end" label="ถึงวันที่" type="date" v-model="dates.end" />
         </div>
         <button class="bg-primary-main text-white p-3 rounded-xl shadow-lg shadow-primary-main/20 hover:bg-primary-dark transition-all active:scale-95 h-11 flex items-center justify-center">
            <ph-arrows-clockwise weight="bold" />
         </button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
         <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ph-tag :size="24" weight="fill" />
         </div>
         <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">โปรโมชันที่มีอยู่</p>
            <h4 class="text-2xl font-bold text-gray-900">24 <span class="text-sm font-medium text-gray-500">แคมเปญ</span></h4>
         </div>
      </div>
      
      <div class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
         <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <ph-check-circle :size="24" weight="fill" />
         </div>
         <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">เปิดใช้งานอยู่ (POS)</p>
            <h4 class="text-2xl font-bold text-gray-900">18 <span class="text-sm font-medium text-gray-500">แคมเปญ</span></h4>
         </div>
      </div>

      <div class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
         <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ph-users :size="24" weight="fill" />
         </div>
         <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">ผู้ใช้สิทธิ์วันนี้</p>
            <h4 class="text-2xl font-bold text-gray-900">342 <span class="text-sm font-medium text-gray-500">ครั้ง</span></h4>
         </div>
      </div>

      <div class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
         <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ph-currencys-circle-dollar :size="24" weight="fill" />
         </div>
         <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">ยอดส่วนลดรวมวันนี้</p>
            <h4 class="text-2xl font-bold text-gray-900">5,420 <span class="text-sm font-medium text-gray-500">บาท</span></h4>
         </div>
      </div>
    </div>

    <!-- Charts / Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-1 lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 flex flex-col min-h-[400px]">
        <h3 class="font-bold text-gray-800 text-[13px] tracking-wide mb-6 uppercase">สถิติการใช้โปรโมชัน ({{ chartData.length }} วัน)</h3>
        <div class="flex-1 flex items-end justify-between gap-1 overflow-x-auto mt-auto pb-4 hide-scrollbar">
            <!-- Dynamic Chart bars -->
            <div 
              v-for="(day, idx) in chartData" 
              :key="idx" 
              class="flex flex-col items-center gap-2 group min-w-[30px] flex-1"
            >
               <div class="w-full relative bg-blue-100 rounded-t-lg transition-all hover:bg-blue-300 flex-1 max-w-[40px]" :style="{ height: `${day.percentage}%` }">
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{{ day.value }}</div>
               </div>
               <span class="text-[9px] font-semibold text-gray-400 uppercase text-center block whitespace-nowrap mt-2" style="writing-mode: horizontal-tb;">{{ day.label }}</span>
            </div>
        </div>
      </div>

      <div class="col-span-1 bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-800 text-[13px] tracking-wide mb-6 uppercase">โปรโมชันยอดฮิต</h3>
        <div class="space-y-4">
           <!-- Rank 1 -->
           <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold flex justify-center items-center text-xs border border-yellow-200">1</div>
              <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">ลด 15% สมาชิกใหม่</p>
                  <p class="text-[11px] text-gray-500">ใช้งานแล้ว 1,240 ครั้ง</p>
              </div>
           </div>
           <!-- Rank 2 -->
           <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex justify-center items-center text-xs border border-gray-200">2</div>
              <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">ซื้อชาบู แถมเป๊ปซี่</p>
                  <p class="text-[11px] text-gray-500">ใช้งานแล้ว 890 ครั้ง</p>
              </div>
           </div>
           <!-- Rank 3 -->
           <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-600 font-bold flex justify-center items-center text-xs border border-orange-200">3</div>
              <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">แลกซื้อน้ำดื่ม 5 บาท</p>
                  <p class="text-[11px] text-gray-500">ใช้งานแล้ว 855 ครั้ง</p>
              </div>
           </div>
            <div class="flex items-center gap-4 opacity-70">
              <div class="w-8 h-8 rounded-full bg-gray-50 text-gray-400 font-bold flex justify-center items-center text-xs border border-gray-100">4</div>
              <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">ส่วนลดท้ายบิล 50 บาท</p>
                  <p class="text-[11px] text-gray-500">ใช้งานแล้ว 400 ครั้ง</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const dates = reactive({
  start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const chartData = computed(() => {
  const start = new Date(dates.start)
  const end = new Date(dates.end)
  
  if (isNaN(start) || isNaN(end) || start > end) return []

  // Calculate Difference in days
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  const data = []
  for (let i = 0; i < diffDays; i++) {
    const current = new Date(start)
    current.setDate(start.getDate() + i)
    
    // Random mock value for demonstration
    const randomVal = Math.floor(Math.random() * 200) + 50
    data.push({
      date: current,
      label: current.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
      value: randomVal,
      percentage: Math.min((randomVal / 250) * 100, 100) // Assumed max 250
    })
  }
  return data
})
</script>

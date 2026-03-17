<template>
  <div class="max-w-[1440px] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">ประวัติการใช้งานโปรโมชัน (History)</h2>
        <p class="text-[13px] font-medium text-gray-500 mt-1.5 flex items-center gap-2">
          <ph-clock-counter-clockwise weight="fill" class="text-gray-400" /> log การใช้งานโปรโมชันในแต่ละบิล ย้อนหลังได้ตามเงื่อนไข
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
         <div class="w-full sm:w-40">
           <BaseInput id="hist_start" label="เริ่มวันที่" type="date" v-model="dates.start" />
         </div>
         <div class="w-full sm:w-40">
            <BaseInput id="hist_end" label="ถึงวันที่" type="date" v-model="dates.end" />
         </div>
         <button @click="fetchHistory" class="bg-primary-main text-white p-3 rounded-xl shadow-lg shadow-primary-main/20 hover:bg-primary-dark transition-all active:scale-95 h-11 flex items-center justify-center">
            <ph-magnifying-glass weight="bold" />
         </button>
      </div>
    </div>

    <!-- Table Display -->
    <BaseTable :columns="columns" :data="historyData" :loading="loading">
       <template #cell-promo_code="{ row }">
         <code class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-bold">{{ row.promo_code }}</code>
       </template>
       <template #cell-discount="{ row }">
          <span :class="row.discount < 0 ? 'text-red-500' : 'text-gray-400'" class="font-bold">
            {{ row.discount < 0 ? row.discount.toLocaleString() : (row.discount > 0 ? row.discount.toLocaleString() : 'ของแถม') }} {{ row.discount !== 0 ? 'บาท' : '' }}
          </span>
       </template>
       <template #cell-price="{ row }">
          <span class="font-bold" :class="row.price > 0 ? 'text-green-600' : 'text-gray-400'">
            {{ row.price > 0 ? row.price.toLocaleString() + ' บาท' : '-' }}
          </span>
       </template>
       <template #cell-receipt_no="{ row }">
         <span class="text-blue-600 font-bold">{{ row.receipt_no }}</span>
       </template>
    </BaseTable>

    <!-- Pagination Mockup -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 text-[13px] font-medium text-gray-500 gap-4 bg-transparent px-2">
      <div class="flex items-center gap-4 text-xs font-semibold">
        <div>ทั้งหมด <span class="text-gray-900 mx-1">{{ historyData.length }}</span> รายการ</div>
        <div class="w-[1px] h-4 bg-gray-200"></div>
        <div class="flex items-center gap-3">
          <span class="text-gray-400">แสดงผล</span>
          <div class="relative">
            <select 
              class="appearance-none bg-[#111827] text-white font-semibold text-xs rounded-full py-2.5 pl-5 pr-10 outline-none cursor-pointer shadow-md tracking-wider border border-transparent focus:ring-2 focus:ring-primary-main/20 transition-all"
              v-model="limit"
            >
              <option :value="10">10 รายการ</option>
              <option :value="20">20 รายการ</option>
              <option :value="50">50 รายการ</option>
            </select>
            <ph-caret-down :size="12" weight="bold" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-1">
        <button class="w-8 h-8 rounded-full text-gray-300 hover:text-gray-600 transition-colors flex items-center justify-center disabled:opacity-50"><ph-caret-left weight="bold" /></button>
        <button class="w-8 h-8 bg-[#111827] rounded-full font-bold text-white shadow-md flex items-center justify-center text-xs">1</button>
        <button class="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center text-xs font-bold">2</button>
        <button class="w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"><ph-caret-right weight="bold" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const loading = ref(false)
const limit = ref(10)
const dates = reactive({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const columns = [
  { key: 'timestamp', label: 'เวลาที่ทำรายการ', align: 'left' },
  { key: 'receipt_no', label: 'เลขที่ใบเสร็จ', align: 'left' },
  { key: 'promo_code', label: 'รหัสโปรโมชัน', align: 'center' },
  { key: 'promo_name', label: 'ชื่อโปรโมชัน', align: 'left' },
  { key: 'price', label: 'ราคา', align: 'right' },
  { key: 'discount', label: 'มูลค่าส่วนลด', align: 'right' },
  { key: 'cashier', label: 'Cashier', align: 'left' },
]

const historyData = ref([
  { 
    timestamp: '16/03/2026 14:30', 
    receipt_no: 'INV-001', 
    promo_code: 'NEW15', 
    promo_name: 'ลดสมาชิกใหม่ 15%', 
    price: 450, 
    discount: -67.50, 
    cashier: 'สมหญิง' 
  },
  { 
    timestamp: '16/03/2026 14:15', 
    receipt_no: 'INV-002', 
    promo_code: 'FREE-COKE', 
    promo_name: 'ซื้อชาบู แถมโค้ก', 
    price: 299, 
    discount: 0, 
    cashier: 'สมหญิง' 
  },
  { 
    timestamp: '15/03/2026 12:45', 
    receipt_no: 'INV-003', 
    promo_code: 'RDM-WATER', 
    promo_name: 'แลกซื้อน้ำดื่ม 5 บาท', 
    price: 5, 
    discount: -15, 
    cashier: 'พนักงาน A' 
  },
  { 
    timestamp: '15/03/2026 11:30', 
    receipt_no: 'INV-004', 
    promo_code: 'COFFEE-SET', 
    promo_name: 'แลกซื้อ Coffee Lover Set', 
    price: 89, 
    discount: -110, 
    cashier: 'พนักงาน B' 
  },
  { 
    timestamp: '14/03/2026 18:20', 
    receipt_no: 'INV-005', 
    promo_code: 'BDAY20', 
    promo_name: 'ส่วนลดวันเกิด 20%', 
    price: 1200, 
    discount: -240, 
    cashier: 'สมหญิง' 
  },
  { 
    timestamp: '14/03/2026 13:00', 
    receipt_no: 'INV-006', 
    promo_code: 'HH-BOGO', 
    promo_name: 'Happy Hour 1 แถม 1', 
    price: 199, 
    discount: 0, 
    cashier: 'พนักงาน A' 
  },
])

const fetchHistory = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

onMounted(fetchHistory)
</script>

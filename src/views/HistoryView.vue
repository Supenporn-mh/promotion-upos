<template>
  <div class="max-w-[1440px] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">ประวัติการใช้งาน (History)</h2>
        <p class="text-[13px] font-medium text-gray-500 mt-1.5 flex items-center gap-2">
          <ph-clock-counter-clockwise weight="fill" class="text-gray-400" /> log การใช้งานโปรเด่นในแต่ละบิล ย้อนหลังได้ตามเงื่อนไข
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
           {{ row.discount < 0 ? row.discount.toLocaleString() : 'ของแถม' }} {{ row.discount < 0 ? 'บาท' : '' }}
         </span>
       </template>
       <template #cell-receipt_no="{ row }">
         <span class="text-blue-600 font-bold">{{ row.receipt_no }}</span>
       </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const loading = ref(false)
const dates = reactive({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const columns = [
  { key: 'timestamp', label: 'เวลาที่ทำรายการ', align: 'left' },
  { key: 'receipt_no', label: 'เลขที่ใบเสร็จ', align: 'left' },
  { key: 'promo_code', label: 'รหัสโปรโมชัน', align: 'center' },
  { key: 'promo_name', label: 'ชื่อโปรโมชั่น', align: 'left' },
  { key: 'promo_period', label: 'ช่วงวันที่โปรฯ', align: 'center' },
  { key: 'discount', label: 'มูลค่าส่วนลด', align: 'right' },
  { key: 'cashier', label: 'Cashier', align: 'left' },
]

const historyData = ref([
  { 
    timestamp: '13/03/2026 14:30', 
    receipt_no: 'INV-001', 
    promo_code: 'NEW20', 
    promo_name: 'ลดสมาชิกใหม่ 20%', 
    promo_period: '01/03 - 31/12', 
    discount: -150, 
    cashier: 'สมหญิง' 
  },
  { 
    timestamp: '13/03/2026 14:15', 
    receipt_no: 'INV-002', 
    promo_code: 'FREE-COKE', 
    promo_name: 'ซื้อชาบู แถมโค้ก', 
    promo_period: '10/03 - 10/04', 
    discount: 0, 
    cashier: 'สมหญิง' 
  },
  { 
    timestamp: '12/03/2026 12:45', 
    receipt_no: 'INV-003', 
    promo_code: 'RDM-01', 
    promo_name: 'แลกซื้อกะเพรา 39 บาท', 
    promo_period: '12/03 - 20/03', 
    discount: -39, 
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

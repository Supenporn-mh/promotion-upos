<template>
  <div class="flex flex-col w-full h-full pb-10">
    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 shadow-primary-main/5">
      <div class="flex items-center gap-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        <span>Show</span>
        <select 
          class="bg-gray-50 border border-transparent rounded-lg px-4 py-2.5 outline-none focus:bg-white focus:border-primary-main text-gray-900 shadow-inner transition-all w-20 appearance-none text-center cursor-pointer"
          v-model="limit"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        <span>entries</span>
      </div>
      <div class="flex items-center w-full sm:w-auto">
        <div class="relative w-full sm:w-80">
          <ph-magnifying-glass class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" weight="bold" />
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="ค้นหาโปรโมชั่น..."
            class="w-full bg-gray-50 border border-transparent rounded-xl pl-11 pr-4 py-3 outline-none focus:bg-white focus:border-primary-main shadow-inner transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
          />
        </div>
        <button @click="router.push('/promotions/create')" class="ml-4 bg-primary-main hover:bg-primary-dark text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-primary-main/20 active:scale-95 text-xs uppercase tracking-widest whitespace-nowrap">
          <ph-plus :size="16" weight="bold" />
          เพิ่มโปรโมชั่น
        </button>
      </div>
    </div>
    
    <!-- Table Display -->
    <BaseTable 
      :columns="tableColumns"
      :data="filteredPromotions"
      :loading="isLoading"
    >
      <!-- Manage Action -->
      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-2">
          <button @click="router.push(`/promotions/${row.id}/edit`)" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary-main hover:bg-blue-50 bg-gray-50 border border-gray-100 rounded-lg transition-all shadow-sm active:scale-95" title="แก้ไข">
            <ph-pencil-simple :size="16" weight="bold" />
          </button>
          <button @click="toggleStatus(row)" class="w-8 h-8 flex items-center justify-center transition-all bg-gray-50 border border-gray-100 rounded-lg shadow-sm active:scale-95" 
            :class="row.status === 'ACTIVE' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-500 bg-green-50 border-green-100'"
            :title="row.status === 'ACTIVE' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'"
          >
            <ph-prohibit v-if="row.status === 'ACTIVE'" :size="16" weight="bold" />
            <ph-check-circle v-else :size="16" weight="bold" />
          </button>
        </div>
      </template>

      <!-- Formatting -->
      <template #cell-seq="{ index }">
        <span class="font-semibold text-gray-900">{{ index + 1 }}</span>
      </template>
      <template #cell-promo_code="{ row }">
        <code class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold">{{ row.promo_code || row.code || 'N/A' }}</code>
      </template>
      <template #cell-name="{ row }">
        <span class="font-semibold text-primary-dark">{{ row.name }}</span>
      </template>
      <template #cell-eligibility="{ row }">
        <span v-if="row.eligibility === 'ALL'" class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-blue-100 italic">ทุกคน</span>
        <span v-else-if="row.eligibility === 'MEMBER'" class="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-100 italic">สมาชิก</span>
        <span v-else class="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100 italic">ทั่วไป</span>
      </template>
      <template #cell-promo_type="{ row }">
        <span class="bg-primary-main/10 text-primary-main text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-primary-main/20 shadow-sm" v-if="row.promo_type === 'DISCOUNT'">ส่วนลด</span>
        <span class="bg-teal-50 text-teal-700 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-teal-100 shadow-sm" v-else-if="row.promo_type === 'REDEMPTION'">แลกซื้อ</span>
        <span class="bg-fuchsia-50 text-fuchsia-700 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-fuchsia-100 shadow-sm" v-else-if="row.promo_type === 'FREEBIE'">ของแถม</span>
        <span v-else class="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border border-gray-200">{{row.promo_type}}</span>
      </template>
      <template #cell-quota_usage="{ row }">
        <div class="flex flex-col items-center">
          <span class="text-[11px] font-bold text-gray-700">{{ row.used_count || 0 }} / {{ row.quota || '∞' }}</span>
          <div class="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-primary-main" :style="{ width: row.quota ? (Math.min((row.used_count || 0) / row.quota * 100, 100)) + '%' : '0%' }"></div>
          </div>
        </div>
      </template>
      <template #cell-date_range="{ row }">
         <span class="text-[11px] font-semibold text-gray-600 block leading-tight">{{ formatDate(row.start_datetime) }} <br> <span class="text-gray-400">ถึง</span> {{ formatDate(row.end_datetime, true) }}</span>
      </template>
      <template #cell-time_range="{ row }">
         <span class="text-[11px] font-bold text-gray-500 whitespace-nowrap">{{ formatTime(row.start_datetime) }} - {{ formatTime(row.end_datetime, true) }}</span>
      </template>
      <template #cell-status_badge="{ row }">
         <div class="flex items-center justify-center">
            <span v-if="row.status === 'ACTIVE'" class="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-green-100 uppercase tracking-widest"><span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> เปิดใช้งาน</span>
            <span v-else class="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100 uppercase tracking-widest"><span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span> ปิดใช้งาน</span>
         </div>
      </template>
      
    </BaseTable>
    
    <!-- Pagination Mockup -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 text-[13px] font-medium text-gray-500 gap-4 bg-transparent px-2">
      <div>แสดงพบบันทึก <span class="text-gray-900 font-semibold mx-1">{{ filteredPromotions.length }}</span> รายการ (จากทั้งหมด <span class="text-gray-900 font-semibold mx-1">{{ totalItems || promotionsData.length }}</span>)</div>
      <div class="flex gap-2">
        <button class="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-700 rounded-lg text-gray-400 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center"><ph-caret-left weight="bold" /></button>
        <button class="w-8 h-9 bg-gray-900 rounded-lg font-semibold text-white shadow-md shadow-gray-900/20 flex items-center justify-center">1</button>
        <button class="w-8 h-9 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-gray-600 transition-all shadow-sm flex items-center justify-center">2</button>
        <button class="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-700 rounded-lg text-gray-400 transition-all shadow-sm flex items-center justify-center"><ph-caret-right weight="bold" /></button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const { showToast, confirm } = inject('globalUtils')
const router = useRouter()
const limit = ref(10)
const searchQuery = ref('')
const isLoading = ref(false)

const tableColumns = ref([
  { key: 'seq', label: 'ลำดับ', align: 'center' },
  { key: 'promo_code', label: 'รหัสโปรโมชัน', align: 'center' },
  { key: 'name', label: 'ชื่อโปรโมชั่น', align: 'left' },
  { key: 'date_range', label: 'วันที่เริ่ม - วันที่สิ้นสุด', align: 'center' },
  { key: 'time_range', label: 'เวลาที่เริ่ม - เวลาที่สิ้นสุด', align: 'center' },
  { key: 'eligibility', label: 'สิทธิ', align: 'center' },
  { key: 'promo_type', label: 'ประเภท', align: 'center' },
  { key: 'quota_usage', label: 'โควต้า', align: 'center' },
  { key: 'status_badge', label: 'สถานะ', align: 'center' },
  { key: 'actions', label: 'จัดการ', align: 'center' },
])

const promotionsData = ref([])
const totalItems = ref(0)

const fetchPromotions = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:3001/api/v1/promotions', {
      params: {
        page: 1, 
        limit: limit.value,
        search: searchQuery.value
      }
    })
    promotionsData.value = response.data.items || []
    totalItems.value = response.data.pagination.total || 0
  } catch (error) {
    console.error('Failed to fetch promotions', error)
  } finally {
    isLoading.value = false
  }
}

watch([limit, searchQuery], () => {
  fetchPromotions()
})

onMounted(() => {
  fetchPromotions()
})

const toggleStatus = async (row) => {
  const newState = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  
  if (newState === 'INACTIVE') {
    const ok = await confirm({
      title: 'ปิดการใช้งานโปรโมชั่น?',
      message: `คุณต้องการปิดการใช้งาน "${row.name}" ใช่หรือไม่? ลูกค้าจะไม่สามารถใช้สิทธิ์นี้ได้ชั่วคราว`,
      type: 'warning'
    })
    if (!ok) return
  }

  row.status = newState
  showToast(`${newState === 'ACTIVE' ? 'เปิด' : 'ปิด'}การใช้งาน ${row.name} สำเร็จ`)
}

const filteredPromotions = computed(() => {
  if (!searchQuery.value) return promotionsData.value;
  return promotionsData.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (p.promo_code && p.promo_code.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
})

const formatDate = (isoStr, isEnd = false) => {
  if (!isoStr) return isEnd ? '31/12/26' : '01/03/26'
  const d = new Date(isoStr)
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const formatTime = (isoStr, isEnd = false) => {
  if (!isoStr) return isEnd ? '23:59' : '00:01'
  const d = new Date(isoStr)
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script>

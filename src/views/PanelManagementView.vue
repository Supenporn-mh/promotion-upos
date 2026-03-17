<template>
  <div class="max-w-[1440px] mx-auto pb-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">รายการ Panel</h2>
        <p class="text-[13px] font-medium text-gray-500 mt-1.5 flex items-center gap-2">
          <ph-grid-four weight="fill" class="text-gray-400" /> จัดการโปรโมชันและหน้าจอที่แสดงบน UPOS
        </p>
      </div>
      <div class="flex gap-3">
        <button @click="openAddModal" class="bg-primary-main text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest shadow-lg shadow-primary-main/20 hover:bg-primary-dark transition-all flex items-center gap-2">
          <ph-plus weight="bold" /> เพิ่ม Panel
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between gap-6">
       <div class="w-full md:w-64">
          <BaseSelect 
            id="filter_branch" 
            label="เลือกสาขา" 
            :options="[{label:'Headquarter', value:'HQ'}, {label:'Canteen', value:'CANTEEN'}, {label:'NIST', value:'NIST'}]"
            v-model="filters.branch"
          />
       </div>
       <div class="flex-1 max-w-sm ml-auto">
          <div class="relative">
            <ph-magnifying-glass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="14" />
            <input type="text" placeholder="Search..." v-model="searchQuery" class="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-primary-main transition-all font-medium" />
          </div>
       </div>
    </div>

    <!-- Table -->
    <BaseTable :columns="columns" :data="filteredPanels">
       <template #cell-seq="{ index }">
          <span class="font-semibold text-gray-500">{{ index + 1 }}</span>
       </template>
       <template #cell-status="{ row }">
          <div class="flex items-center justify-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="row.status" class="sr-only peer" @change="handleStatusToggle(row)">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-main shadow-inner"></div>
            </label>
          </div>
       </template>
       <template #cell-actions="{ row }">
          <button @click="openEditModal(row)" class="w-8 h-8 flex items-center justify-center text-primary-main hover:bg-primary-main/10 rounded-lg transition-colors active:scale-95">
            <ph-gear-six weight="bold" />
          </button>
       </template>
    </BaseTable>

    <!-- Pagination Mockup -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 text-[13px] font-medium text-gray-500 gap-4 bg-transparent px-2">
      <div class="flex items-center gap-4 text-xs font-semibold">
        <div>ทั้งหมด <span class="text-gray-900 mx-1">{{ panels.length }}</span> รายการ</div>
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

    <!-- Modal: เพิ่ม/แก้ไขหน้าจอ -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" @click.self="showModal = false">
       <div class="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden relative anime-slide-up">
          <button @click="showModal = false" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all z-10">
             <ph-x weight="bold" />
          </button>
          
          <div class="p-10 max-h-[90vh] overflow-y-auto hide-scrollbar">
             <h3 class="text-xl font-bold text-gray-900 mb-8 text-center italic">{{ isEdit ? 'แก้ไขหน้าจอ' : 'เพิ่มหน้าจอ' }}</h3>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- ข้อมูลส่วนตัว -->
                <div class="space-y-6">
                   <BaseInput id="m_name" label="ชื่อหน้าจอ*" placeholder="ระบุชื่อหน้าจอ" v-model="form.name" />
                   <BaseSelect id="m_branch" label="สาขา*" :options="[{label:'Headquarter', value:'Headquarter'}, {label:'Canteen', value:'Canteen'}, {label:'NIST', value:'NIST'}]" v-model="form.branch" />
                   
                   <!-- Image Upload -->
                   <div class="flex flex-col gap-2">
                     <label class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1 block">รูปภาพ Panel</label>
                     <div 
                        class="relative w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary-main transition-all cursor-pointer overflow-hidden group"
                        @click="$refs.fileInput.click()"
                     >
                       <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                       <div v-if="!imagePreview" class="flex flex-col items-center">
                         <ph-cloud-arrow-up :size="24" weight="bold" class="text-gray-300 mb-2 group-hover:text-primary-main transition-colors" />
                         <p class="text-[10px] font-bold text-gray-400 group-hover:text-primary-main transition-colors text-center px-4">คลิกเพื่ออัปโหลดรุปภาพ</p>
                       </div>
                       <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                     </div>
                   </div>

                   <div class="flex items-center gap-3 mt-4">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.status" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-main transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                      <span class="text-sm font-semibold text-gray-600">แสดงผล</span>
                   </div>
                </div>

                <!-- สินค้า -->
                <div class="space-y-6">
                   <div class="flex flex-col gap-2">
                      <label class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1 block">เลือกสินค้า</label>
                      <div class="flex gap-2">
                        <div class="relative flex-1">
                          <ph-magnifying-glass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" :size="14" />
                          <input 
                            type="text" 
                            placeholder="รหัส หรือ ชื่อสินค้า..." 
                            v-model="productSearch"
                            @focus="showProductResults = true"
                            class="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-primary-main transition-all"
                          />
                          <!-- Dropdown Results -->
                          <div v-if="showProductResults && filteredProducts.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-xl z-20 py-1 max-h-40 overflow-y-auto">
                              <div 
                                v-for="p in filteredProducts" 
                                :key="p.id" 
                                @click="selectProduct(p)"
                                class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-xs group"
                              >
                                <span class="font-semibold text-gray-700 group-hover:text-primary-main">{{ p.name }}</span>
                                <span class="text-[10px] text-gray-400 font-bold tracking-tight">{{ p.id }}</span>
                              </div>
                          </div>
                        </div>
                        <button @click="addProductToTable" class="w-11 h-11 bg-primary-main/10 text-primary-main rounded-xl flex items-center justify-center hover:bg-primary-main/20 transition-all active:scale-95 disabled:opacity-50" :disabled="!selectedProductRef">
                           <ph-plus :size="18" weight="bold" />
                        </button>
                      </div>
                   </div>

                   <div class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[140px]">
                      <table class="w-full text-xs">
                         <thead>
                            <tr class="text-gray-400 border-b border-gray-100 bg-white/50">
                               <th class="px-4 py-3 font-semibold text-left">รหัสสินค้า</th>
                               <th class="px-4 py-3 font-semibold text-left">ชื่อสินค้า</th>
                               <th class="px-4 py-3 font-semibold text-center w-12">ลบ</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr v-if="form.items.length === 0">
                               <td colspan="3" class="px-4 py-12 text-center text-gray-400 font-medium italic">ไม่มีรายการสินค้าในหน้าจอนี้</td>
                            </tr>
                            <tr v-for="(item, idx) in form.items" :key="item.id" class="border-b border-gray-100 last:border-0 hover:bg-white/40 transition-colors">
                               <td class="px-4 py-3 font-bold text-gray-400">{{ item.id }}</td>
                               <td class="px-4 py-3 font-semibold text-gray-700">{{ item.name }}</td>
                               <td class="px-4 py-3 text-center">
                                  <button @click="removeProduct(idx)" class="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                     <ph-trash weight="bold" />
                                  </button>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             <div class="flex justify-center mt-12 gap-4">
                <button @click="showModal = false" class="bg-gray-100 text-gray-500 px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase text-[11px] tracking-widest">ยกเลิก</button>
                <button @click="savePanel" class="bg-primary-main text-white px-12 py-3.5 rounded-2xl font-bold shadow-xl shadow-primary-main/30 hover:bg-primary-dark transition-all uppercase text-[11px] tracking-widest">
                  {{ isEdit ? 'บันทึกการแก้ไข' : 'สร้างข้อมูล' }}
                </button>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, inject } from 'vue'

const { showToast, confirm } = inject('globalUtils')

const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const limit = ref(10)
const filters = reactive({ branch: 'Headquarter' })

const columns = [
  { key: 'seq', label: 'ลำดับ', align: 'center' },
  { key: 'name', label: 'Panel', align: 'left' },
  { key: 'branch', label: 'สาขา', align: 'center' },
  { key: 'status', label: 'สถานะ', align: 'center' },
  { key: 'actions', label: 'จัดการ', align: 'center' },
]

const panels = ref([
  { id: 1, name: '5 บาท', branch: 'Canteen', status: true, items: [] },
  { id: 2, name: 'BB-TESST', branch: 'Headquarter', status: true, items: [] },
  { id: 3, name: 'Canteen', branch: 'Canteen', status: true, items: [] },
  { id: 4, name: 'Canteen', branch: 'Headquarter', status: true, items: [] },
  { id: 5, name: 'Canteen', branch: 'NIST', status: true, items: [] },
  { id: 6, name: 'Coffee Shop', branch: 'NIST', status: true, items: [] },
  { id: 7, name: 'Cooperative Store', branch: 'NIST', status: true, items: [] },
  { id: 8, name: 'eeee', branch: 'Canteen', status: true, items: [] },
  { id: 9, name: '(Room Service)-A LA CARTE ASIAN BREAKFAST', branch: 'Headquarter', status: true, items: [] },
  { id: 10, name: '(Room Service)-A LA CARTE WESTERN BREAKFAST', branch: 'Headquarter', status: true, items: [] },
])

const filteredPanels = computed(() => {
  return panels.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesBranch = !filters.branch || p.branch === filters.branch
    return matchesSearch && matchesBranch
  })
})

const form = reactive({
  name: '',
  branch: 'Headquarter',
  status: true,
  items: [],
  imageUrl: ''
})

const imagePreview = ref(null)

const openAddModal = () => {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, { name: '', branch: 'Headquarter', status: true, items: [], imageUrl: '' })
  imagePreview.value = null
  showModal.value = true
}

const openEditModal = (panel) => {
  isEdit.value = true
  editingId.value = panel.id
  Object.assign(form, JSON.parse(JSON.stringify(panel)))
  imagePreview.value = panel.imageUrl || null
  showModal.value = true
}

const savePanel = () => {
  if (!form.name || !form.branch) {
    showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error')
    return
  }

  if (isEdit.value) {
    const idx = panels.value.findIndex(p => p.id === editingId.value)
    if (idx > -1) {
      panels.value[idx] = { ...panels.value[idx], ...form, id: editingId.value }
      showToast('แก้ไขข้อมูลสำเร็จ')
    }
  } else {
    const newId = panels.value.length ? Math.max(...panels.value.map(p => p.id)) + 1 : 1
    panels.value.unshift({ ...form, id: newId })
    showToast('สร้างข้อมูลสำเร็จ')
  }
  showModal.value = false
}

const handleStatusToggle = async (row) => {
  const currentState = row.status
  // If we are trying to disable (it was true, now false if we didn't use v-model early, 
  // but v-model handles it. So we check if NEW state is false)
  if (!currentState) {
    const ok = await confirm({
      title: 'ปิดการใช้งาน?',
      message: `คุณแน่ใจหรือไม่ที่จะปิดการใช้งาน Panel "${row.name}"?`,
      type: 'warning'
    })
    if (!ok) {
        row.status = true // revert
        return
    }
    showToast(`ปิดการใช้งาน ${row.name} แล้ว`)
  } else {
    showToast(`เปิดการใช้งาน ${row.name} แล้ว`)
  }
}

// Product Search & Adding
const allProducts = [
  { id: 'P01', name: 'มันฝรั่งทอด (L)' }, { id: 'P02', name: 'ชาบู Set A' }, { id: 'P03', name: 'โค้ก แก้วใหญ่' },
  { id: 'P04', name: 'ข้าวกะเพราเนื้อ' }, { id: 'P05', name: 'สลัดอกไก่' }, { id: 'P06', name: 'เป๊ปซี่ (กระป๋อง)' },
  { id: 'P07', name: 'ส้มตำไทย' }, { id: 'P08', name: 'ไก่ย่าง' }, { id: 'P09', name: 'ลาบหมู' }
]

const productSearch = ref('')
const showProductResults = ref(false)
const selectedProductRef = ref(null)

const filteredProducts = computed(() => {
  if (!productSearch.value) return []
  const search = productSearch.value.toLowerCase()
  return allProducts.filter(p => p.id.toLowerCase().includes(search) || p.name.toLowerCase().includes(search))
})

const selectProduct = (prod) => {
  productSearch.value = prod.name
  selectedProductRef.value = prod
  showProductResults.value = false
}

const addProductToTable = () => {
  if (!selectedProductRef.value) return
  // Check if duplicate
  if (form.items.some(i => i.id === selectedProductRef.value.id)) {
    alert('สินค้านี้ถูกเพิ่มไปแล้ว')
    return
  }
  form.items.push({...selectedProductRef.value})
  productSearch.value = ''
  selectedProductRef.value = null
}

const removeProduct = (idx) => {
  form.items.splice(idx, 1)
}

// Image File handling
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      imagePreview.value = event.target.result
      form.imageUrl = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Click outside handling
const clickHandler = (e) => {
  if (!e.target.closest('.relative') && showProductResults.value) {
    showProductResults.value = false
  }
}
onMounted(() => document.addEventListener('click', clickHandler))
onUnmounted(() => document.removeEventListener('click', clickHandler))
</script>

<style scoped>
.anime-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.hide-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: #f3f4f6;
    border-radius: 20px;
}
</style>

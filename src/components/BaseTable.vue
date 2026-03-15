<template>
  <div class="w-full">
    <div class="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <table class="w-full text-sm text-left">
        <thead class="text-[11px] text-gray-400 bg-white border-b border-gray-100 uppercase font-bold tracking-widest">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-5 whitespace-nowrap"
              :class="col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="text-gray-700 font-medium">
          <tr v-if="loading" class="border-b last:border-b-0">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-400">
              <ph-spinner :size="24" class="animate-spin mx-auto mb-2 text-primary-main" />
              กำลังโหลดข้อมูล...
            </td>
          </tr>
          <tr v-else-if="!data || data.length === 0" class="border-b last:border-b-0">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">
              ไม่พบข้อมูลโปรโมชั่น
            </td>
          </tr>
          <tr 
            v-else 
            v-for="(row, rIndex) in data" 
            :key="row.id || rIndex" 
            class="border-b border-gray-50 hover:bg-blue-50/40 transition-colors last:border-b-0"
          >
            <td 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-4"
              :class="col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'"
            >
              <slot :name="`cell-${col.key}`" :row="row" :index="rIndex">
                <span>{{ row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-' }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // Expects: { key: 'name', label: 'ชื่อ', align: 'left'|'center'|'right' }
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

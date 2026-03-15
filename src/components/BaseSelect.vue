<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="id" class="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">
      {{ label }} <span v-if="required" class="text-danger-main">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        class="appearance-none w-full px-4 py-3 border border-transparent rounded-xl shadow-inner outline-none transition-all duration-200 focus:bg-white focus:border-primary-main pr-10 text-sm font-medium"
        :class="[
          error ? 'bg-red-50 focus:bg-white border-danger-main' : 'bg-gray-50 text-gray-900',
          disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500' : ''
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        <ph-caret-down :size="16" weight="bold" />
      </div>
    </div>
    <span v-if="error" class="text-xs text-danger-main mt-1 ml-1 font-medium">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'กรุณาเลือก'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

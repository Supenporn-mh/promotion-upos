<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="id" class="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">
      {{ label }} <span v-if="required" class="text-danger-main">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 rounded-xl shadow-inner transition-all duration-200 outline-none text-sm font-medium border border-transparent',
          error ? 'bg-red-50 focus:bg-white focus:border-danger-main border-danger-main' : 'bg-gray-50 focus:bg-white focus:border-primary-main',
          disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500' : 'text-gray-900',
          icon ? 'pl-11' : ''
        ]"
      />
      <!-- Slot for icon prefix if needed -->
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <slot name="icon"></slot>
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
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
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
  },
  icon: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="bg-white rounded-[24px] shadow-xl shadow-gray-200/40 p-6 md:p-10 max-w-4xl mx-auto mb-10 border border-gray-100 font-sans">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
      
      <!-- Section 1: ชื่อและรหัสโปรโมชัน -->
      <div class="col-span-1">
        <BaseInput 
          id="promo_name" 
          label="ชื่อโปรโมชัน" 
          v-model="form.name"
          placeholder="เช่น โค้ดส่วนลดลูกค้าใหม่..."
          required
          :disabled="readonly"
        />
      </div>
      <div class="col-span-1">
        <BaseInput 
          id="promo_code" 
          label="รหัสโปรโมชัน (Promo Code)" 
          v-model="form.code"
          placeholder="เช่น NEWUSER2026"
          required
          :disabled="readonly"
        />
      </div>
      <div class="col-span-1 md:col-span-2">
        <label class="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1 block">รูปภาพโปรโมชัน</label>
        <div 
          class="relative w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary-main transition-all cursor-pointer overflow-hidden group"
          @click="$refs.fileInput.click()"
        >
          <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <div v-if="!imagePreview" class="flex flex-col items-center">
            <ph-cloud-arrow-up :size="32" weight="bold" class="text-gray-300 mb-2 group-hover:text-primary-main transition-colors" />
            <p class="text-[11px] font-bold text-gray-400 group-hover:text-primary-main transition-colors">คลิกเพื่ออัปโหลดรูปภาพ (.png, .jpg)</p>
          </div>
          <div v-else class="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ph-pencil-simple :size="16" weight="bold" />
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>

      <!-- Section 2: สิทธิ & ประเภทโปรโมชัน -->
      <div class="col-span-1 p-5 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5">
        <BaseSelect 
          id="promo_eligibility" 
          label="สิทธิการใช้งาน" 
          v-model="form.eligibility"
          :options="[{label:'ทั้งหมด (ทุกคน)', value:'ALL'}, {label:'ลูกค้าทั่วไป', value:'GENERAL'}, {label:'เฉพาะสมาชิก', value:'MEMBER'}]"
          required
        />
      </div>
      
      <div class="col-span-1 p-5 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5">
         <BaseSelect 
          id="promo_type" 
          label="ประเภทโปรโมชัน" 
          v-model="form.type"
          :options="[{label:'1. ส่วนลด (%, บาท)', value:'DISCOUNT'}, {label:'2. แลกซื้อสินค้าราคาพิเศษ', value:'REDEMPTION'}, {label:'3. รับของแถมฟรี', value:'FREEBIE'}]"
          required
        />
      </div>

      <!-- Section 3: สินค้าเงื่อนไข (สิ่งที่ต้องซื้อเพื่อรับสิทธิ) -->
      <div class="col-span-1 md:col-span-2 p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5 flex flex-col gap-5">
        <h3 class="font-semibold text-gray-800 text-[13px] tracking-wide flex items-center gap-2 uppercase mb-1">
          <ph-shopping-cart :size="18" weight="bold" class="text-primary-main"/> เงื่อนไขการซื้อ (ซื้ออะไรเพื่อรับสิทธิ)
        </h3>
        
        <!-- Row: Target configuration -->
        <div 
          class="grid gap-4"
          :class="form.targetType === 'TOTAL_SALES' ? 'grid-cols-1' : 'md:grid-cols-2 grid-cols-1'"
        >
          <BaseSelect 
            id="promo_target_type" 
            label="รูปแบบการซื้อ" 
            v-model="form.targetType"
            :options="[{label:'ซื้อครบตามยอด (บาท)', value:'TOTAL_SALES'}, {label:'ระบุรายสินค้า (SKU)', value:'ITEM'}, {label:'ระบุประเภทสินค้า', value:'CATEGORY'}]"
            required
          />
          <BaseSelect 
            v-if="form.targetType !== 'TOTAL_SALES'"
            id="promo_target_selection_rule" 
            label="เงื่อนไขการซื้อ" 
            v-model="form.targetSelectionRule"
            :options="[{label:'ซื้อทุกรายการ', value:'ALL'}, {label:'ซื้ออย่างใดอย่างหนึ่ง', value:'CHOOSE_ONE'}]"
            :disabled="form.targetType === 'CATEGORY'"
          />
        </div>

        <!-- TOTAL_SALES only: show amount field -->
        <div v-if="form.targetType === 'TOTAL_SALES'" class="w-full md:w-1/2">
          <BaseInput id="promo_min_sales" label="ยอดซื้อสุทธิขั้นต่ำ (บาท)" type="number" v-model="form.minAmount" />
        </div>

        <!-- ITEM / CATEGORY: Content -->
        <template v-if="form.targetType !== 'TOTAL_SALES'">
          
          <!-- Full-width multi-select box -->
          <div class="w-full flex flex-col relative">
            <label class="mb-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
              ค้นหาและระบุ{{ form.targetType === 'CATEGORY' ? 'ประเภทสินค้า' : 'รายการสินค้า' }}
            </label>
            <div 
              class="min-h-[48px] w-full bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex flex-wrap gap-2 transition-all cursor-pointer"
              :class="showDropdowns.target ? 'ring-2 ring-primary-main/10 border-primary-main' : 'hover:border-gray-300'"
              @click.stop="toggleDropdown('target')"
            >
              <div v-if="selectedProducts.length === 0" class="flex items-center text-gray-400 text-sm px-2">
                + เลือก{{ form.targetType === 'CATEGORY' ? 'ประเภทสินค้า' : 'สินค้า' }}...
              </div>
              <div v-for="item in selectedProducts" :key="item.id" class="bg-white text-primary-main text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-primary-main transition-all hover:bg-primary-main/5 hover:scale-105">
                {{ item.name }} 
                <ph-x-circle weight="fill" class="cursor-pointer text-primary-main opacity-80 hover:opacity-100" @click.stop="toggleTargetItem(item)" />
              </div>
              <div class="ml-auto pr-1 flex items-center">
                <ph-caret-down :size="16" weight="bold" class="text-gray-400" :class="showDropdowns.target ? 'rotate-180 transition-transform' : 'transition-transform'" />
              </div>
            </div>

            <!-- Custom Menu (Targets) -->
            <div v-if="showDropdowns.target" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden anime-dropdown" @click.stop>
              <div class="p-3 border-b border-gray-100 bg-gray-50/50">
                <div class="relative">
                  <ph-magnifying-glass class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="14" />
                  <input type="text" v-model="searchStrings.target" class="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-primary-main transition-all font-medium" placeholder="ค้นหา..." />
                </div>
              </div>
              <div class="max-h-60 overflow-y-auto pt-1 pb-1">
                <div class="px-4 py-2 bg-gray-50/30 text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex justify-between">เลือกทั้งหมด 
                  <input type="checkbox" :checked="isAllSelected('target')" @change="toggleAll('target')" class="rounded text-primary-main w-4 h-4 cursor-pointer" />
                </div>
                <div v-for="item in filteredItems('target')" :key="item.id" 
                  @click="toggleTargetItem(item)"
                  class="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors group">
                  <div class="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center transition-all group-hover:border-primary-main/50" :class="isItemSelected('target', item.id) ? 'bg-primary-main border-primary-main shadow-md shadow-primary-main/20' : ''">
                    <ph-check v-if="isItemSelected('target', item.id)" :size="12" weight="bold" class="text-white" />
                  </div>
                  <span class="text-sm font-medium" :class="isItemSelected('target', item.id) ? 'text-gray-900 font-semibold' : 'text-gray-600'">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity list per item -->
          <div v-if="selectedProducts.length > 0" class="w-full flex flex-col gap-2">
            <label class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">ระบุจำนวนชิ้นขั้นต่ำที่ต้องซื้อ</label>
            <div v-for="item in selectedProducts" :key="item.id">
              <div class="flex justify-between items-center bg-gray-50/80 rounded-2xl p-3 px-5 border border-transparent transition-all hover:bg-white hover:border-gray-100 hover:shadow-sm">
                <span class="text-gray-700 text-[13px] font-semibold">{{ item.name }}</span>
                <div class="flex items-center gap-3">
                  <input type="number" class="w-18 border border-gray-200 bg-white shadow-sm rounded-xl text-center py-2 text-sm font-bold outline-none focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 transition-all" v-model.number="item.qty">
                  <span class="text-gray-400 text-[12px] font-semibold">ชิ้น</span>
                </div>
              </div>
              <p v-if="item.qty <= 0" class="text-[10px] text-red-500 font-semibold mt-1 ml-2">ห้ามระบุเป็น 0 หรือว่าง</p>
            </div>
          </div>

          <!-- Min amount field at the bottom of card -->
          <div class="w-full border-t border-gray-100 pt-5 mt-2">
            <div class="flex justify-between items-center mb-2">
              <label class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">ยอดซื้อสุทธิขั้นต่ำของ{{ form.targetType === 'CATEGORY' ? 'ประเภทสินค้า' : 'สินค้า' }}ที่เลือก (บาท)</label>
              <label class="flex items-center gap-1.5 cursor-pointer group">
                <input type="checkbox" v-model="unlimited.targetAmount" class="hidden peer">
                <div class="w-4 h-4 rounded border-2 border-gray-200 peer-checked:bg-primary-main peer-checked:border-primary-main flex items-center justify-center transition-all group-hover:border-primary-main/50">
                  <ph-check v-if="unlimited.targetAmount" :size="10" weight="bold" class="text-white" />
                </div>
                <span class="text-[10px] font-bold transition-colors" :class="unlimited.targetAmount ? 'text-primary-main':'text-gray-400 group-hover:text-gray-600'">ไม่จำกัดยอดเงิน</span>
              </label>
            </div>
            <input 
              type="number" 
              v-model="form.targetAmount" 
              :disabled="unlimited.targetAmount"
              class="w-full bg-white border border-gray-200 shadow-sm focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 rounded-2xl px-5 py-3 text-sm font-bold outline-none disabled:opacity-30 disabled:bg-gray-100 transition-all text-gray-900"
              :placeholder="unlimited.targetAmount ? 'ไม่จำกัดยอดเงิน' : 'ระบุยอดซื้อขั้นต่ำ (บาท)'"
            />
          </div>

        </template>
      </div>


      <!-- Section 4: สิ่งที่ได้รับ -->
      <div class="col-span-1 md:col-span-2 p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5 mt-2" v-if="form.type !== 'DISCOUNT'">
        <h3 class="font-semibold text-gray-800 text-[13px] tracking-wide flex items-center gap-2 uppercase mb-6">
          <ph-gift :size="18" weight="bold" class="text-primary-main" /> 
          รายละเอียด{{ form.type === 'FREEBIE' ? 'ของแถมที่ได้รับ' : 'สินค้าแลกซื้อ (ราคาพิเศษ)' }}
        </h3>
        
        <div class="flex flex-col gap-6">
           <!-- Selection Rule: All or Choose One -->
           <div class="flex flex-col gap-2">
              <label class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">เงื่อนไขการรับ{{ form.type === 'FREEBIE' ? 'ของแถม' : 'สินค้าแลกซื้อ' }}</label>
              <div class="flex gap-4">
                 <button 
                   @click="form.rewardSelectionRule = 'ALL'"
                   class="px-4 py-2.5 rounded-xl text-[12px] font-semibold uppercase tracking-wider transition-all border flex items-center gap-2"
                   :class="form.rewardSelectionRule === 'ALL' ? 'bg-primary-main text-white border-primary-main shadow-lg shadow-primary-main/20' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'"
                 >
                   <ph-check-square v-if="form.rewardSelectionRule === 'ALL'" :size="16" weight="bold" />
                   แถมทุกรายการ
                 </button>
                 <button 
                   @click="form.rewardSelectionRule = 'CHOOSE_ONE'"
                   class="px-4 py-2.5 rounded-xl text-[12px] font-semibold uppercase tracking-wider transition-all border flex items-center gap-2"
                   :class="form.rewardSelectionRule === 'CHOOSE_ONE' ? 'bg-primary-main text-white border-primary-main shadow-lg shadow-primary-main/20' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'"
                 >
                   <ph-cursor-click v-if="form.rewardSelectionRule === 'CHOOSE_ONE'" :size="16" weight="bold" />
                   เลือกได้อย่างใดอย่างหนึ่ง
                 </button>
              </div>
           </div>

           <div class="flex gap-4 border-b border-gray-100 pb-4">
              <button 
                v-for="bt in rewardTypeOptions" :key="bt.v"
                @click="form.rewardType = bt.v"
                class="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all border"
                :class="form.rewardType === bt.v ? 'bg-primary-main text-white border-primary-main shadow-lg shadow-primary-main/20' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'"
              >
                {{ bt.l }}
              </button>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
              <!-- Advanced Reward Multi-selector -->
              <div class="col-span-1 md:col-span-7 flex flex-col relative">
                 <label class="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">เลือกรายการที่ได้รับ</label>
                 <div 
                    class="min-h-[48px] w-full bg-gray-50 border transition-all cursor-pointer rounded-xl p-2 flex flex-wrap gap-2 shadow-inner"
                    :class="showDropdowns.reward ? 'border-primary-main ring-2 ring-primary-main/10 bg-white' : 'border-transparent'"
                    @click.stop="toggleDropdown('reward')"
                 >
                    <div v-if="selectedRewards.length === 0" class="flex items-center text-gray-400 text-sm px-2">+ เลือกรายการ...</div>
                    <div v-for="item in selectedRewards" :key="item.id" class="bg-gray-200/60 text-gray-700 text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold border border-gray-300/50">
                       {{ item.name }}
                       <ph-x-circle weight="fill" class="cursor-pointer opacity-50 hover:opacity-100" @click.stop="toggleRewardItem(item)" />
                    </div>
                    <div class="ml-auto pr-2 flex items-center">
                      <ph-caret-down :size="16" weight="bold" class="text-gray-400" />
                    </div>
                 </div>

                 <!-- Dropdown Menu (Rewards) -->
                 <div v-if="showDropdowns.reward" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden anime-dropdown" @click.stop>
                    <div class="p-3 bg-gray-50/50 flex gap-2">
                       <input type="text" v-model="searchStrings.reward" class="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary-main" placeholder="ค้นหา..." />
                    </div>
                    <div class="max-h-52 overflow-y-auto pb-1">
                       <div v-for="item in filteredItems('reward')" :key="item.id" @click="toggleRewardItem(item)" class="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer group">
                          <span class="text-xs font-semibold" :class="isItemSelected('reward', item.id) ? 'text-primary-main font-semibold' : 'text-gray-500'">{{ item.name }}</span>
                          <div class="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center transition-all group-hover:border-primary-main/50" :class="isItemSelected('reward', item.id) ? 'bg-primary-main border-primary-main' : ''">
                            <ph-check v-if="isItemSelected('reward', item.id)" :size="12" weight="bold" class="text-white" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="col-span-1 md:col-span-2">
                 <BaseInput id="rew_qty" label="จำนวนที่ได้" type="number" v-model="form.rewardQty" />
              </div>

              <div class="col-span-1 md:col-span-3" v-if="form.type === 'REDEMPTION'">
                 <BaseInput id="rew_price" label="ราคาพิเศษ (บ.)" type="number" v-model="form.redemptionPrice" />
              </div>
           </div>
        </div>
      </div>

      <!-- Section: ส่วนลด -->
      <div 
        class="col-span-1 md:col-span-2 grid gap-6 p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5 mt-2" 
        :class="form.discountType === 'PERCENT' ? 'md:grid-cols-3' : 'md:grid-cols-2'"
        v-if="form.type === 'DISCOUNT'"
      >
         <h3 class="col-span-full font-semibold text-gray-800 text-[13px] tracking-wide flex items-center gap-2 uppercase mb-1">
          <ph-ticket :size="18" weight="bold" class="text-primary-main" /> รูปแบบและมูลค่าส่วนลด
        </h3>
        <div class="col-span-1">
          <BaseSelect id="promo_discount_type" label="คำนวณแบบ" v-model="form.discountType" :options="[{label:'เปอร์เซ็นต์ (%)', value:'PERCENT'}, {label:'ยอดเงิน (บาท)', value:'FIXED'}]" />
        </div>
        <div class="col-span-1">
          <BaseInput id="promo_discount_value" :label="form.discountType === 'PERCENT' ? 'มูลค่า (%)' : 'มูลค่า (บาท)'" type="number" v-model="form.discountValue" />
        </div>
        <div class="col-span-1" v-if="form.discountType === 'PERCENT'">
          <BaseInput id="promo_max_discount" label="มูลค่าสูงสุด (สูงสุด)" type="number" v-model="form.maxDiscount" placeholder="0 = ไม่จำกัด" />
        </div>
      </div>

      <!-- Section 5: ระยะเวลาโปรโมชัน -->
      <div class="col-span-1 md:col-span-2 p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm shadow-blue-500/5 mt-2 flex flex-col gap-4">
         <h3 class="font-semibold text-gray-800 text-[13px] tracking-wide flex items-center gap-2 uppercase mb-1">
           <ph-calendar-blank :size="18" weight="bold" class="text-primary-main" /> ระยะเวลาโปรโมชัน
         </h3>
         <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="col-span-1">
               <BaseInput id="promo_start_date" label="วันที่เริ่มต้น" type="date" v-model="form.startDate" :disabled="readonly" required />
            </div>
            <div class="col-span-1">
               <BaseInput id="promo_end_date" label="วันที่สิ้นสุด" type="date" v-model="form.endDate" :disabled="readonly" required />
            </div>
            <div class="col-span-1">
               <BaseInput id="promo_start_time" label="เวลาที่เริ่ม (น.)" type="time" v-model="form.startTime" :disabled="readonly" />
            </div>
            <div class="col-span-1">
               <BaseInput id="promo_end_time" label="เวลาที่สิ้นสุด (น.)" type="time" v-model="form.endTime" :disabled="readonly" />
            </div>
         </div>
      </div>

      <!-- Section: โควต้า -->
      <div class="col-span-1 md:col-span-2 p-6 rounded-[20px] bg-gray-50 border border-transparent shadow-inner mt-2">
         <h3 class="font-semibold text-gray-400 mb-4 text-[11px] uppercase tracking-widest">การควบคุมและโควต้าสิทธิ์</h3>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="q in [{k:'quota',l:'โควต้ารวม'},{k:'perOrder',l:'ต่อออเดอร์'},{k:'perCustomer',l:'ต่อคน'}]" :key="q.k" class="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
               <div class="flex justify-between items-center mb-2">
                  <span class="text-[10px] font-semibold text-gray-500">{{ q.l }}</span>
                  <label class="flex items-center gap-1" :class="q.k === 'perCustomer' && (form.eligibility === 'ALL' || form.eligibility === 'GENERAL') ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
                    <input type="checkbox" v-model="unlimited[q.k]" class="hidden peer" :disabled="q.k === 'perCustomer' && (form.eligibility === 'ALL' || form.eligibility === 'GENERAL')">
                    <div class="w-3.5 h-3.5 rounded border-2 border-gray-200 peer-checked:bg-primary-main peer-checked:border-primary-main flex items-center justify-center transition-all">
                       <ph-check v-if="unlimited[q.k]" :size="10" weight="bold" class="text-white" />
                    </div>
                    <span class="text-[9px] font-semibold" :class="unlimited[q.k] ? 'text-primary-main':'text-gray-300'">ไม่จำกัด</span>
                  </label>
               </div>
               <input 
                 type="number" 
                 v-model="form[q.k === 'quota' ? 'quota' : (q.k === 'perOrder' ? 'maxPerOrder' : 'maxPerCustomer')]" 
                 :disabled="unlimited[q.k]"
                 class="w-full bg-gray-50 rounded-lg py-1.5 px-3 text-sm font-semibold disabled:opacity-30 outline-none focus:ring-1 focus:ring-primary-main text-primary-dark"
                 :placeholder="unlimited[q.k] ? '∞' : '0'"
               >
            </div>
         </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4" v-if="!readonly">
      <button @click="router.back()" class="px-6 py-3 rounded-xl font-semibold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all uppercase tracking-widest text-[11px]">
        ยกเลิก
      </button>
      <button @click="submit" class="px-10 py-3 rounded-xl font-semibold bg-primary-main hover:bg-primary-dark text-white transition-all shadow-xl shadow-primary-main/40 uppercase tracking-widest text-[11px] flex items-center gap-2">
        <ph-check-circle :size="18" weight="bold" />
        {{ isEdit ? 'บันทึกการแก้ไข' : 'สร้างโปรโมชัน' }}
      </button>
    </div>
    <div class="flex justify-end pt-6 border-t border-gray-100 mt-4" v-else>
      <button @click="router.back()" class="px-10 py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all uppercase tracking-widest text-[11px]">
        กลับ
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  initialData: { type: Object, default: null },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['cancel', 'submit'])

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '', code: '', eligibility: 'ALL', type: 'DISCOUNT', targetType: 'TOTAL_SALES', minAmount: 500, targetAmount: 0, targetSelectionRule: 'ALL',
  discountType: 'PERCENT', discountValue: 0, maxDiscount: 0,
  rewardType: 'ITEM', rewardSelectionRule: 'ALL', rewardItemId: '', rewardQty: 1, redemptionPrice: 0,
  startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  startTime: '00:01', endTime: '23:59', quota: 0, maxPerOrder: 0, maxPerCustomer: 0,
  imageUrl: ''
})

const imagePreview = ref(null)

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      imagePreview.value = event.target.result
      form.imageUrl = event.target.result // Store base64 for demo
    }
    reader.readAsDataURL(file)
  }
}

const unlimited = reactive({ quota: false, perOrder: true, perCustomer: true, targetAmount: true })
const showDropdowns = reactive({ target: false, reward: false })
const searchStrings = reactive({ target: '', reward: '' })

const rewardTypeOptions = computed(() => {
  if (form.rewardSelectionRule === 'ALL') {
    return [{l:'รายสินค้า',v:'ITEM'}]
  }
  return [{l:'รายสินค้า',v:'ITEM'},{l:'ระบุประเภทสินค้า',v:'CATEGORY'}]
})

watch(() => form.rewardSelectionRule, (newVal) => {
  if (newVal === 'ALL' && form.rewardType !== 'ITEM') {
    form.rewardType = 'ITEM'
  }
})

watch(() => form.eligibility, (newVal) => {
  if (newVal === 'ALL' || newVal === 'GENERAL') {
    unlimited.perCustomer = true
    form.maxPerCustomer = 0
  }
}, { immediate: true })

watch(() => form.targetType, (newVal) => {
  selectedProducts.value = []
  if (newVal === 'CATEGORY') {
    form.targetSelectionRule = 'CHOOSE_ONE'
  }
})

const toggleDropdown = (key) => {
  const current = showDropdowns[key]
  // Close all
  Object.keys(showDropdowns).forEach(k => showDropdowns[k] = false)
  // Toggle the requested one
  showDropdowns[key] = !current
}

// Data Pools
const allItems = [
  { id: 'P01', name: 'มันฝรั่งทอด (L)' }, { id: 'P02', name: 'ชาบู Set A' }, { id: 'P03', name: 'โค้ก แก้วใหญ่' },
  { id: 'P04', name: 'ข้าวกะเพราเนื้อ' }, { id: 'P05', name: 'สลัดอกไก่' }, { id: 'P06', name: 'เป๊ปซี่ (กระป๋อง)' }
]
const allCats = [
  { id: 'C01', name: 'เครื่องดื่ม' }, { id: 'C02', name: 'อาหารจานเดียว' }, { id: 'C03', name: 'เซ็ตสุดคุ้ม' },
  { id: 'C04', name: 'ของหวาน' }, { id: 'C05', name: 'ทานเล่น' }
]

const selectedProducts = ref([])
const selectedRewards = ref([])

const filteredItems = (poolKey) => {
  const search = searchStrings[poolKey].toLowerCase()
  const type = poolKey === 'target' ? form.targetType : form.rewardType
  const pool = type === 'CATEGORY' ? allCats : allItems
  if (!search) return pool
  return pool.filter(i => i.name.toLowerCase().includes(search))
}

const isItemSelected = (poolKey, id) => {
  const list = poolKey === 'target' ? selectedProducts.value : selectedRewards.value
  return list.some(i => i.id === id)
}

const toggleTargetItem = (item) => {
  const idx = selectedProducts.value.findIndex(i => i.id === item.id)
  if (idx > -1) selectedProducts.value.splice(idx, 1)
  else selectedProducts.value.push({ ...item, qty: 1 })
}

const toggleRewardItem = (item) => {
  const idx = selectedRewards.value.findIndex(i => i.id === item.id)
  if (idx > -1) selectedRewards.value.splice(idx, 1)
  else selectedRewards.value.push({ ...item })
}

const isAllSelected = (poolKey) => {
  const items = filteredItems(poolKey)
  return items.length > 0 && items.every(i => isItemSelected(poolKey, i.id))
}

const toggleAll = (poolKey) => {
  const currentStatus = isAllSelected(poolKey)
  const items = filteredItems(poolKey)
  if (currentStatus) {
    const list = poolKey === 'target' ? selectedProducts : selectedRewards
    const ids = items.map(i => i.id)
    list.value = list.value.filter(i => !ids.includes(i.id))
  } else {
    items.forEach(i => {
      if (!isItemSelected(poolKey, i.id)) {
        if (poolKey === 'target') selectedProducts.value.push({ ...i, qty: 1 })
        else selectedRewards.value.push({ ...i })
      }
    })
  }
}

// Close dropdowns on outside click
const clickHandler = (e) => {
  if (!e.target.closest('.relative')) {
    Object.keys(showDropdowns).forEach(k => showDropdowns[k] = false)
  }
}
onMounted(async () => {
  document.addEventListener('click', clickHandler)
  
  if (isEdit.value) {
    try {
      // Fetch data based on ID
      const response = await axios.get(`http://localhost:3001/api/v1/promotions/${route.params.id}`)
      Object.assign(form, response.data)
      if (response.data.targets) selectedProducts.value = response.data.targets
      if (response.data.rewards) selectedRewards.value = response.data.rewards
      
      // Parse dates for edit mode
      if (response.data.start_datetime) {
        const start = new Date(response.data.start_datetime)
        if (!isNaN(start)) {
          form.startDate = start.toISOString().split('T')[0]
          form.startTime = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }
      }
      if (response.data.end_datetime) {
        const end = new Date(response.data.end_datetime)
        if (!isNaN(end)) {
          form.endDate = end.toISOString().split('T')[0]
          form.endTime = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }
      }
    } catch (e) {
      console.error("Failed to load promotion data", e)
    }
  } else if (props.initialData) {
    Object.assign(form, props.initialData)
  }
})
onUnmounted(() => document.removeEventListener('click', clickHandler))

watch(() => form.rewardType, () => selectedRewards.value = [])

const submit = () => {
    if (selectedProducts.value.some(p => p.qty <= 0)) {
        alert('กรุณากรอกจำนวนสินค้าขั้นต่ำให้ถูกต้อง')
        return
    }
    console.log("Submitting...", { ...form, targets: selectedProducts.value, rewards: selectedRewards.value })
    router.push('/promotions')
}
</script>

<style scoped>
.anime-dropdown { animation: slideDown 0.2s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
</style>

# UI Specification: Promotion-UPOS-new

## 1. Design System & Theming
- **Framework**: Tailwind CSS
- **Tokens**: อิงตาม `docs/design-tokens.json`
- **Icon Set**: Phosphor Icons (Fill)
- **Typography**: รองรับภาษาไทย (Noto Sans Thai / Sarabun) ผสมกับ Inter

## 2. Layout Structure
ออกแบบด้วยแนวคิด Mobile-First รูปร่างหลักของแอปจะประกอบด้วย:
1. **Container**: ล้อมรอบเนื้อหาทั้งหมด กำหนด padding ซ้ายขวา
2. **Page Header**: ส่วนหัวของหน้าจอ แสดงชื่อหน้า (เช่น "รายการโปรโมชั่น", "เพิ่มโปรโมชั่น")
3. **Card/Surface**: ตัวดึงข้อมูลหรือแบบฟอร์มจะวางอยู่บนพื้นหลังสีขาวมีเงาเล็กน้อย (Card) เพื่อแยกออกจากพื้นหลังหลัก

## 3. Core Components

### 3.1 `Button`
- **Variant Primary**: สีพื้นน้ำเงิน (`bg-primary-main`), ตัวอักษรสีขาว
- **Variant Danger**: สีพื้นแดง (`bg-danger-main`), ตัวอักษรสีขาว
- **Variant Outline**: กรอบสีเทา, พื้นใส
- **States**: `Hover` (สีทึบขึ้น), `Disabled` (ลดความสว่าง, ปิดคลิก)

### 3.2 `BaseTable` (รายการโปรโมชั่น)
- **Props**: `columns` (Array), `data` (Array), `loading` (Boolean)
- **Mobile View**: เปลี่ยนการแสดงตารางเป็นแบบ Card ต่อชิ้น หากมีพื้นที่ไม่พอ
- **Desktop/Tablet View**: ตารางปกติ, Header แถวบนสุดเป็น Bold
- **Slots**: รองรับการตกแต่งข้อมูลพิเศษใน column เช่น การใส่ Icon ฝังในคอลัมน์ "จัดการ"

### 3.3 `Form Controls`
- **`BaseInput`** (ช่องกรอกข้อความ / ตัวเลข)
  - รองรับ placeholder, clearable, validation state (แดงเมื่อผิด)
- **`BaseSelect`** (Dropdown)
  - ใช้สำหรับเลือก "สิทธิการใช้งาน", "ประเภทโปรโมชั่น", "รูปแบบ"
  - ใช้พื้นหลังเทาอ่อน (ตามรูป)
- **`MultiSelect`** (เลือกสินค้า)
  - แสดงผลลัพธ์ที่เลือกเป็น Badge / Tag พร้อมปุ่ม "(x)" กดลบได้
- **`DatePicker`**
  - แสดงวันที่เริ่มและวันที่สิ้นสุด

## 4. Page Breakdown

### 4.1 Page: Promotion List (`views/PromotionList.vue`)
- **Header**: รวบรวมคำ "รายการโปรโมชั่น" และปุ่ม `+ เพิ่มโปรโมชั่น` (ปุ่มขวา)
- **Filter Bar**: 
  - ซ้าย: Select "Show [10] entries"
  - ขวา: Input Search
- **Data Section**: เรียกใช้ `BaseTable` นำข้อมูลโปรโมชั่นมาแสดง
- **Footer**: Pagination (Showing 1 to 10... , First, Previous, 1, 2, Next, Last)

### 4.2 Page: Add Promotion (`views/PromotionForm.vue`)
*ทำงานในลักษณะหน้าใหม่ หรือ Modal / Drawer ขวา ตามความเหมาะสม (แนะนำเป็น Drawer ขวา หรือหน้าใหม่)*
- **Header**: "เพิ่มโปรโมชั่น", Subtitle: "กำหนดรายละเอียดโปรโมชั่น"
- **Form Layout**: 
  - กริดแบบ 1 คอลัมน์ (Mobile) / 2 คอลัมน์ (Desktop)
  - Section 1: ชื่อโปรโมชั่น
  - Section 2: สิทธิการใช้งาน (Dropdown), ประเภทโปรโมชั่น (Dropdown)
  - Section 3: ประเภทสินค้า (Dropdown), สินค้า (MultiSelect)
  - Section 4: รูปแบบส่วนลด (Dropdown), มูลค่าลด (Input), จำกัดสูงสุด (Input)
  - Section 5: ระยะเวลา (Date/Time picker)
  - Section 6: จำนวนสิทธิ์
- **Footer**: ขวาล่าง ปุ่ม [ตกลง] (Primary) และ [ยกเลิก] (Danger)

## 5. Interactions & States
- **Loading State**: ระหว่างดึงผ่าน API บน Table แสดง Skeleton loader
- **Empty State**: ตารางว่างเปล่า ให้โชว์คำว่า "ไม่มีข้อมูลโปรโมชั่น" ตรงกลาง
- **Form Validation**: หากกรอกข้อมูลไม่ครบ กด "ตกลง" ไม่ได้ หรือฟ้อง Error ใต้ช่อง input

# Product Requirements Document (PRD): Promotion-UPOS-new

## 1. System Overview
**System Objective:** สร้างระบบจัดการโปรโมชั่น (Promotion Management) สำหรับระบบ POS ทำงานเป็นลักษณะ Web Plugin (เปิด New Tab จากหน้าเว็บ UPOS) เพื่อให้ Admin สามารถสร้าง เลิกใช้งาน และดูรายการโปรโมชั่น/คูปอง ได้อย่างสะดวก

## 2. User Roles
* **Admin**: ผู้ดูแลระบบส่วนกลาง มีสิทธิ์ในการสร้าง แก้ไข ลบ และดูรายการโปรโมชั่นทั้งหมด

## 3. User Stories & Acceptance Criteria

### Epic 1: Promotion Management (UI List)
**User Story 1.1: As an Admin, I want to view a paginated list of all promotions so that I can monitor active, upcoming, and expired promotions.**
* **Acceptance Criteria:**
  * หน้าจอ "รายการโปรโมชั่น" ต้องแสดงตารางข้อมูลตาม mockup โดยมีคอลัมน์: ลำดับ, ชื่อโปรโมชั่น, สิทธิ, ประเภทโปรโมชั่น, สินค้าแลกซื้อ, จำนวนสินค้าแลกซื้อ, วันที่เริ่ม, วันที่หมดอายุ, เวลาเริ่ม, เวลาสิ้นสุด, ส่วนลด %, คงเหลือ, จัดการ
  * รองรับระบบ Pagination (เลือก Show 10, 20, 50 entries ได้)
  * มีช่องค้นหา (Search) มุมขวาบน สำหรับค้นหาจากชื่อโปรโมชั่น
  * ข้อมูลที่นำมาแสดงดึงผ่าน API (พิจารณาเชื่อมต่อกับ Backend ตาม Contract ที่จะกำหนด)

### Epic 2: Promotion Creation
**User Story 2.1: As an Admin, I want to create a new promotion so that POS cashiers can utilize deals for customers.**
* **Acceptance Criteria:**
  * มีปุ่ม "+ เพิ่มโปรโมชั่น" มุมขวาบน เพื่อเข้าสู่โหมดสร้างโปรโมชั่น
  * รองรับการเลือก **"ประเภทโปรโมชั่น"**:
    * ส่วนลด (%, บาท)
    * แลกซื้อ
    * ของแถม
  * รองรับการกำหนด **"ประเภทสินค้า"** หรือรูปแบบการร่วมรายการ:
    * รายสินค้า (ชิ้น)
    * หมวดหมู่ (ชิ้น)
    * ยอดซื้อ (บาท)
  * รองรับการกำหนด **"สิทธิการใช้งาน"**:
    * สมาชิก
    * ลูกค้าทั่วไป
  * รองรับการเลือกรายการสินค้า (Dropdown Multi-select) และระบุจำนวนสำหรับสินค้านั้นๆ (เช่น สลัดไก่ 1 ชิ้น, ชาบู 1 ชิ้น)
  * รองรับการกำหนด **"รูปแบบส่วนลด"**:
    * ลด (%)
    * ลด (บาท)
  * สามารถระบุ "มูลค่าส่วนลด" (ตัวเลข) และ "จำกัดส่วนลดสูงสุด (บาท)" (กรณีระบุ 0 = ไม่จำกัด)
  * รองรับการตั้งค่าระยะเวลา **"วันที่เริ่ม-สิ้นสุดโปรโมชั่น"** และ **"เวลาที่เริ่ม-สิ้นสุดโปรโมชั่น"**
  * รองรับการกำหนด **"จำนวนโปรโมชั่นคงเหลือ"** (Limit/Quota)

### Epic 3: Promotion Actions
**User Story 3.1: As an Admin, I want to manage (edit/delete/disable) existing promotions so that I can correct mistakes or hold campaigns.**
* **Acceptance Criteria:**
  * คอลัมน์ "จัดการ" (ไอคอนฟันเฟือง) เมื่อคลิกจะต้องเห็นตัวเลือกในการจัดการ เช่น ดูรายละเอียด แก้ไข หรือเปลี่ยนสถานะ
  * ทุกๆ Action ที่มีการลบ หรือเปลี่ยนสถานะที่กระทบผู้ใช้งาน ต้องมี Confirmation Dialog

## 4. Dependencies & Constraints
* **Product API**: การเลือกสินค้าแลกซื้อ/ของแถม จะต้องดึงข้อมูลผ่าน API สินค้าของระบบ POS (รอ Architect กำหนด API Contract)
* **Tech Stack**: บังคับใช้ Vue 3 (Option API), Vite, Tailwind CSS, Pinia, Axios, Phosphor Icons

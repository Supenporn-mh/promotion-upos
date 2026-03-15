# Project Context: Promotion-UPOS-new

## 🎯 Global Goal
ระบบจัดการโปรโมชั่น (Promotion Management System) สำหรับ POS โดยทำงานในรูปแบบ Plugin ที่สามารถเรียกใช้งานผ่านหน้าเว็บ UPOS และเปิดในแท็บใหม่ (Open new tab) เพื่อให้ Admin สามารถสร้างและจัดการโปรโมชั่น/คูปอง ได้อย่างสะดวกและรวดเร็ว

---

## 🛠️ Technology Stack
- **Framework**: Vue 3 (Option API)
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Styling**: Tailwind CSS
- **Components**: unplugin-vue-components (for auto-importing)
- **State Management**: Pinia
- **API Client**: Axios
- **Icons**: Phosphor Icons (Fill)

---

## 👥 Agent Responsibilities & Handover Flow
1. **Chief Orchestrator** (Current): Initialize project & global state. ➡️ **Trigger [Product Analyst]**
2. **Product Analyst**: Define PRD in `docs/prd.md`.
3. **UX/UI Designer**: Create `docs/ui-spec.md` & `docs/design-tokens.json`.
4. **Software Architect**: Design `docs/schema.dbml` & `docs/api-contract.json`.
5. **Backend Engineer**: Implement Server logic.
6. **Frontend Engineer**: Implement Client UI.
7. **Localization Specialist**: Handle i18n (`locales/*.json`).
8. **Security Auditor**: Audit security (`docs/security-audit.md`).
9. **Release Manager**: Generate `RELEASE_NOTES.md` & `USER_MANUAL.md`.

---

## 📈 Current Project State
- Requirement received and validated.
- Initial UI reference provided.
- **Next Step**: Product Analyst to define detailed PRD.

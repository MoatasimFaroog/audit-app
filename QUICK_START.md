# ⚡ البداية السريعة - Quick Start

## التشغيل بأمر واحد

```bash
./start.sh
```

---

## 🎯 خطوات التشغيل الأساسية (3 خطوات فقط)

### 1️⃣ تثبيت المتطلبات

```bash
pip install -r requirements.txt
```

### 2️⃣ تشغيل السيرفر

```bash
# Backend API
cd server && python3 api.py &

# Frontend UI (في نافذة جديدة)
cd frontend && npm install && npm run dev
```

### 3️⃣ افتح المتصفح

```
Frontend: http://localhost:3000
API Docs: http://localhost:8000/api/docs
```

---

## 🔥 الأمر الأسرع (Backend فقط)

```bash
cd server && python3 api.py
```

ثم افتح: `http://localhost:8000/api/docs`

---

## 🧪 اختبار سريع

```bash
python3 example_usage.py
```

---

## 📝 أوامر سريعة

### تعيين دور لمحفظة

```bash
curl -X POST http://localhost:8000/api/roles/assign \
  -H "Content-Type: application/json" \
  -d '{"wallet_address":"0xYourAddress","role_name":"Accountant"}'
```

### عرض معلومات Blockchain

```bash
curl http://localhost:8000/api/blockchain/info
```

### إنشاء معاملة

```bash
curl -X POST http://localhost:8000/api/transactions/create \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_type":"journal_entry",
    "module":"accounting",
    "contract":"accounting_entry_contract",
    "data":{"entry_date":"2025-12-25","description":"Test"},
    "wallet_address":"0xYourAddress",
    "signature":"0xYourSignature"
  }'
```

---

## 🌐 الروابط المهمة

| الخدمة | الرابط | الوصف |
|--------|--------|-------|
| Frontend | http://localhost:3000 | واجهة المستخدم |
| Backend API | http://localhost:8000 | API الرئيسي |
| API Docs | http://localhost:8000/api/docs | توثيق تفاعلي |
| ReDoc | http://localhost:8000/api/redoc | توثيق ReDoc |

---

## 🛠️ متطلبات النظام

- ✅ Python 3.11+
- ✅ pip
- ✅ Node.js 18+ (للواجهة)
- ✅ MetaMask (للمصادقة)

---

## ⚠️ ملاحظات سريعة

1. **السيرفر يعمل؟**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **إيقاف الخدمات:**
   ```bash
   Ctrl+C
   ```

3. **حل مشكلة المنفذ مشغول:**
   ```bash
   lsof -ti:8000 | xargs kill -9
   lsof -ti:3000 | xargs kill -9
   ```

---

## 📚 المزيد من التفاصيل

راجع: `START_GUIDE.md` للدليل الشامل

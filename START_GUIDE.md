# 🚀 دليل تشغيل نظام Web3 Accounting & Audit System

## المتطلبات الأساسية

### 1. Python
- Python 3.11 أو أحدث
- pip (مدير حزم Python)

### 2. Node.js (اختياري للواجهة)
- Node.js 18+
- npm (يأتي مع Node.js)

### 3. MetaMask
- تثبيت امتداد MetaMask في المتصفح
- إنشاء محفظة أو استيراد محفظة موجودة

---

## 📥 التحميل والتثبيت

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd web3-accounting-audit-system
```

### 2. تثبيت متطلبات Python

```bash
# إنشاء بيئة افتراضية (موصى به)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# أو
venv\Scripts\activate     # Windows

# تثبيت المتطلبات
pip install -r requirements.txt
```

### 3. تثبيت متطلبات Frontend (اختياري)

```bash
cd frontend
npm install
cd ..
```

---

## ▶️ طرق التشغيل

### الطريقة الأولى: التشغيل التلقائي (موصى به)

يوجد سكريبت تشغيل تلقائي يشغل السيرفر والواجهة معاً:

```bash
./start.sh
```

**ماذا يفعل هذا السكريبت؟**
- ✅ يتحقق من وجود Python و Node.js
- ✅ ينشئ البيئة الافتراضية تلقائياً
- ✅ يثبت جميع المتطلبات
- ✅ يشغل Backend API على المنفذ 8000
- ✅ يشغل Frontend UI على المنفذ 3000
- ✅ يوقف جميع الخدمات عند الضغط على Ctrl+C

### الطريقة الثانية: التشغيل اليدوي

#### أ) تشغيل Backend API فقط

```bash
cd server
python3 api.py
```

السيرفر سيعمل على: `http://localhost:8000`

#### ب) تشغيل Frontend UI

في نافذة طرفية جديدة:

```bash
cd frontend
npm run dev
```

الواجهة ستعمل على: `http://localhost:3000`

### الطريقة الثالثة: تشغيل Core فقط (للاختبار)

```bash
python3 example_usage.py
```

---

## 🌐 الوصول إلى النظام

بعد التشغيل، يمكنك الوصول إلى:

### 1. واجهة المستخدم (Frontend)
```
http://localhost:3000
```

### 2. Backend API
```
http://localhost:8000
```

### 3. توثيق API التفاعلي (Swagger)
```
http://localhost:8000/api/docs
```

### 4. توثيق API (ReDoc)
```
http://localhost:8000/api/redoc
```

---

## 🔑 الاتصال بالنظام

### 1. تأكد من تثبيت MetaMask

قم بتثبيت امتداد MetaMask من:
- Chrome: https://chrome.google.com/webstore
- Firefox: https://addons.mozilla.org

### 2. إنشاء أو استيراد محفظة

إذا لم يكن لديك محفظة:
- افتح MetaMask
- اتبع التعليمات لإنشاء محفظة جديدة
- احفظ عبارة الاسترداد (Seed Phrase) في مكان آمن

### 3. الاتصال بالنظام

1. افتح `http://localhost:3000`
2. انقر على زر "Connect Wallet"
3. سيطلب منك MetaMask الموافقة على الاتصال
4. وقع الرسالة في MetaMask للمصادقة
5. ستظهر عنوان محفظتك ودورك في النظام

---

## 🎭 تعيين الأدوار (Roles)

بعد الاتصال، قد لا يكون لديك دور محدد. يمكن تعيين الأدوار بطريقتين:

### الطريقة الأولى: عبر API

```bash
curl -X POST "http://localhost:8000/api/roles/assign" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0xYourWalletAddress",
    "role_name": "Accountant"
  }'
```

### الطريقة الثانية: عبر Python

```python
from core.main import Web3AccountingSystem

system = Web3AccountingSystem()
role_manager = system.get_role_manager()

role_manager.assign_role(
    wallet_address="0xYourWalletAddress",
    role_name="Accountant"
)
```

### الأدوار المتاحة:
- `CEO` - الرئيس التنفيذي
- `CFO` - المدير المالي
- `Chief Accountant` - كبير المحاسبين
- `Accountant` - محاسب
- `Data Entry` - إدخال بيانات
- `HR Manager` - مدير الموارد البشرية
- `HR Officer` - موظف موارد بشرية
- `Sales Manager` - مدير المبيعات
- `Sales Representative` - مندوب مبيعات
- `Procurement Manager` - مدير المشتريات
- `Procurement Officer` - موظف مشتريات

---

## 🧪 اختبار النظام

### 1. اختبار Blockchain Core

```bash
python3 example_usage.py
```

سيقوم هذا بـ:
- إنشاء blockchain
- إضافة معاملات محاسبية
- إنشاء blocks
- التحقق من صحة السلسلة
- عرض audit trail

### 2. اختبار API

افتح `http://localhost:8000/api/docs` للاختبار التفاعلي

### 3. اختبار Frontend

1. افتح `http://localhost:3000`
2. اتصل بالمحفظة
3. تحقق من عرض معلومات Blockchain
4. جرب الإجراءات السريعة

---

## 🛑 إيقاف النظام

### إذا استخدمت start.sh:
اضغط `Ctrl+C` في النافذة الطرفية

### إذا شغلت الخدمات يدوياً:
اضغط `Ctrl+C` في كل نافذة طرفية

---

## ❓ حل المشاكل الشائعة

### 1. خطأ "Port already in use"

```bash
# إيقاف العملية على المنفذ 8000
lsof -ti:8000 | xargs kill -9

# إيقاف العملية على المنفذ 3000
lsof -ti:3000 | xargs kill -9
```

### 2. MetaMask لا يظهر

- تأكد من تثبيت امتداد MetaMask
- قم بتحديث الصفحة
- تأكد من أنك تستخدم HTTPS أو localhost

### 3. خطأ في التثبيت

```bash
# تحديث pip
pip install --upgrade pip

# إعادة تثبيت المتطلبات
pip install -r requirements.txt --force-reinstall
```

### 4. Frontend لا يعمل

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 استخدام النظام

### إنشاء معاملة محاسبية

```bash
curl -X POST "http://localhost:8000/api/transactions/create" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_type": "journal_entry",
    "module": "accounting",
    "contract": "accounting_entry_contract",
    "data": {
      "entry_date": "2025-12-25",
      "description": "Office supplies purchase",
      "debits": [{"account_code": "5100", "amount": 500.00}],
      "credits": [{"account_code": "1000", "amount": 500.00}]
    },
    "wallet_address": "0xYourAddress",
    "signature": "0xYourSignature"
  }'
```

### عرض معلومات Blockchain

```bash
curl http://localhost:8000/api/blockchain/info
```

### عرض Audit Trail

```bash
curl http://localhost:8000/api/audit/trail/0xYourAddress
```

---

## 🔒 أمان النظام

### ✅ النظام يستخدم:
- مصادقة Web3 فقط (لا توجد كلمات مرور)
- توقيعات رقمية (ECDSA)
- Blockchain غير قابل للتعديل
- Audit trail كامل
- حماية من هجمات Replay

### ⚠️ ملاحظات أمنية:
- لا تشارك Seed Phrase أبداً
- لا تشارك Private Key أبداً
- استخدم HTTPS في الإنتاج
- قم بتحديد CORS origins في الإنتاج

---

## 📞 الدعم والمساعدة

للحصول على المساعدة:
- راجع التوثيق في مجلد `/docs`
- اقرأ `README.md`
- اقرأ `ARCHITECTURE.md`
- تحقق من `SYSTEM_OVERVIEW.md`

---

## ⭐ الميزات الرئيسية

- ✅ 100% Blockchain-based
- ✅ No traditional database
- ✅ Wallet-only authentication
- ✅ Immutable records
- ✅ Complete audit trail
- ✅ Multi-signature approvals
- ✅ Smart contract logic
- ✅ Standards compliance (IFRS, GAAP, SOCPA)
- ✅ Anomaly detection
- ✅ Multi-language support (Arabic/English)

---

**Built with ❤️ for the future of decentralized accounting**

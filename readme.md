# 🚀 Fintech API

API ini digunakan untuk mengelola **nasabah (customers)**, **pembayaran (payments)**, dan **transaksi (transactions)** dalam sistem fintech sederhana.  
Dibangun menggunakan **NestJS, TypeScript, Prisma, PostgreSQL (Supabase)**, dan di-deploy di **Railway**.

API ini juga terintegrasi dengan **mock payment gateway** dan memiliki dokumentasi lengkap melalui **Swagger**.

---

## 🌐 Deployment

**Base URL:**
```

https://fintech-api-production.up.railway.app

```

**Swagger Documentation:**
```

https://fintech-api-production.up.railway.app/api/docs

````

---

## 📖 Swagger Preview

> Screenshot Swagger Docs tersedia di folder `docs/swagger-preview.png`.

---

## 📂 Endpoint List

### **Customers**
| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| POST   | `/customers`        | Create customer       |
| GET    | `/customers`        | Get all customers     |
| PATCH  | `/customers/{id}`   | Update customer by ID |
| DELETE | `/customers/{id}`   | Delete customer by ID |

---

### **Transactions**
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/transactions`       | Create transaction        |
| GET    | `/transactions`       | Get all transactions      |
| GET    | `/transactions/{id}`  | Get transaction by ID     |
| PATCH  | `/transactions/{id}`  | Update transaction by ID  |
| DELETE | `/transactions/{id}`  | Delete transaction by ID  |

---

### **Payments**
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | `/payments`       | Create payment        |
| GET    | `/payments`       | Get all payments      |
| GET    | `/payments/{id}`  | Get payment by ID     |
| PATCH  | `/payments/{id}`  | Update payment by ID  |
| DELETE | `/payments/{id}`  | Delete payment by ID  |

---

## 🧪 Contoh Request & Response

### **1. Create Customer**

**Request:**
```http
POST /customers
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
````

**Response:**

```json
{
  "id": "e84e8fae-1234-4f50-9e02-5dfd2c35d950",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2025-09-21T10:00:00.000Z"
}
```

---

### **2. Create Transaction**

**Request:**

```http
POST /transactions
Content-Type: application/json

{
  "customerId": "e84e8fae-1234-4f50-9e02-5dfd2c35d950",
  "amount": 500000,
  "currency": "IDR",
  "status": "pending"
}
```

**Response:**

```json
{
  "id": "b9f3c7d1-5b91-4c17-8a7f-df3d21d7c789",
  "customerId": "e84e8fae-1234-4f50-9e02-5dfd2c35d950",
  "amount": 500000,
  "currency": "IDR",
  "status": "pending",
  "createdAt": "2025-09-21T10:10:00.000Z"
}
```

---

### **3. Create Payment**

**Request:**

```http
POST /payments
Content-Type: application/json

{
  "transactionId": "b9f3c7d1-5b91-4c17-8a7f-df3d21d7c789",
  "amount": 500000,
  "method": "credit_card"
}
```

**Response:**

```json
{
  "id": "c13c7ff8-2d29-4d11-9b03-5e788df2cc8a",
  "transactionId": "b9f3c7d1-5b91-4c17-8a7f-df3d21d7c789",
  "amount": 500000,
  "method": "credit_card",
  "status": "success",
  "createdAt": "2025-09-21T10:15:00.000Z"
}
```

---

## 🛠 Setup Local Development

```bash
git clone <repo-url>
cd fintech-api
pnpm install
pnpm run start:dev
```

Pastikan file `.env` sudah terisi seperti ini:

```
DATABASE_URL="postgresql://<username>:<password>@<host>:5432/postgres"
```

### **Migrasi Database Prisma**

```bash
npx prisma migrate dev --name init
```

---

## 🧪 Testing

Gunakan **Postman collection** yang sudah disiapkan di folder:

```
docs/postman_collection.json
```

Atau jalankan unit test bawaan dengan Jest:

```bash
# Jalankan semua test
pnpm run test

# Jalankan test dengan coverage report
pnpm run test:cov
```

---

## 🖼 Architecture

**Alur utama aplikasi:**
Controller → Service → Prisma → PostgreSQL

**Teknologi yang digunakan:**

* NestJS Modular Pattern
* Prisma ORM
* PostgreSQL (Supabase)
* Swagger Docs

```text
[Client]
   |
[Controller]
   |
[Service]
   |
[Prisma ORM]
   |
[PostgreSQL DB]
```

---

## 🔄 CI/CD Flow

Railway digunakan sebagai platform deployment dengan CI/CD bawaan.
Setiap kali melakukan **push ke branch `main`**, proses berikut terjadi otomatis:

1. **Build Project** di Railway.
2. Menjalankan **unit test** dengan Jest.
3. Jika semua test lulus → **Deploy ke production**.

**Branch Protection:**
Branch `main` hanya bisa di-merge jika test lulus.

---

## **Jawaban Pertanyaan Assessment**

### **1. Arsitektur / Pattern**

* Menggunakan **NestJS Modular Pattern** sehingga **scalable** dan mudah dimaintain.
* Controller, Service, dan Repository dipisah agar siap di-scale menjadi microservices.
* Tidak ada state di server, cocok untuk horizontal scaling.

---

### **2. Tech Stack**

| Bagian     | Teknologi             | Alasan                                         |
| ---------- | --------------------- | ---------------------------------------------- |
| Backend    | NestJS (TypeScript)   | Terstruktur, mendukung DI, cocok untuk fintech |
| Database   | PostgreSQL (Supabase) | Relasional, transaksi keuangan butuh ACID      |
| ORM        | Prisma ORM            | Query lebih aman & migrasi mudah               |
| Docs       | Swagger               | Auto-generate dokumentasi                      |
| Testing    | Jest                  | Bawaan NestJS, powerful & simple               |
| Deployment | Railway               | Gratis, CI/CD bawaan, support PostgreSQL       |

---

### **3. Database & External Integration**

* **Database:** PostgreSQL dipilih karena:

  * Transaksi keuangan memerlukan **integritas data tinggi** (ACID compliance).
  * Relasi yang kompleks lebih mudah dikelola.
* **Integrasi eksternal:**

  1. **Mock Payment Gateway** → untuk simulasi pembayaran tanpa biaya.
  2. **External Logging Service** → misalnya menggunakan webhook mock untuk monitoring.

---

### **4. Testing & Dokumentasi**

* Unit test menggunakan Jest sudah disiapkan untuk minimal 2 endpoint.
* Swagger otomatis tersedia di:

  ```
  /api/docs
  ```
* Postman Collection disediakan untuk uji manual.

---

### **5. Deployment & CI/CD**

* Railway dipilih karena mendukung PostgreSQL dan memiliki free tier.
* CI/CD otomatis aktif:

  1. Push ke GitHub branch `main`
  2. Railway build otomatis
  3. Jalankan test otomatis
  4. Deploy otomatis ke production

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Alwi abdullah royyan**
Full-Stack Developer & IT Specialist


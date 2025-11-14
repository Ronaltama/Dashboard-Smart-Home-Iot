# Firebase Authentication Setup

## 🔥 Cara Setup Firebase Authentication

### 1️⃣ Enable Email/Password Authentication

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project **smarthomeuas**
3. Klik **Authentication** di menu sebelah kiri
4. Klik tab **Sign-in method**
5. Klik **Email/Password**
6. Enable toggle untuk **Email/Password**
7. Klik **Save**

### 2️⃣ Buat User Admin

1. Masih di halaman **Authentication**
2. Klik tab **Users**
3. Klik tombol **Add user**
4. Isi form:
   - **Email**: `admin@security.com`
   - **Password**: `admin123` (atau password yang kamu inginkan)
5. Klik **Add user**

### 3️⃣ Test Login

Sekarang kamu bisa login dengan credentials:

- **Email**: `admin@security.com`
- **Password**: `admin123`

## ✅ Fitur Yang Sudah Diintegrasikan

### Login.vue

- ✅ `signInWithEmailAndPassword()` - Login dengan Firebase Auth
- ✅ Error handling untuk berbagai kasus:
  - `auth/user-not-found` - Email tidak terdaftar
  - `auth/wrong-password` - Password salah
  - `auth/invalid-email` - Format email invalid
  - `auth/too-many-requests` - Terlalu banyak percobaan
  - `auth/invalid-credential` - Email atau password salah
- ✅ Simpan token dan user info ke localStorage
- ✅ Auto redirect ke `/dashboard` setelah login berhasil

### Layout.vue

- ✅ `signOut()` - Logout dari Firebase Auth
- ✅ Clear localStorage setelah logout
- ✅ Tampilkan email user dari Firebase Auth
- ✅ Auto redirect ke `/login` setelah logout

### router.js

- ✅ `onAuthStateChanged()` - Cek status authentication
- ✅ Navigation guard untuk protect authenticated routes
- ✅ Auto redirect ke `/dashboard` jika sudah login
- ✅ Auto redirect ke `/login` jika belum login

## 🔒 Security Rules (Optional)

Jika kamu mau batasi siapa yang bisa register, tambahkan rule ini di **Firestore Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hanya authenticated users yang bisa read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📝 Notes

1. **Token Management**: Token Firebase otomatis refresh setiap 1 jam
2. **Password Reset**: Bisa tambahkan fitur reset password dengan `sendPasswordResetEmail()`
3. **Email Verification**: Bisa tambahkan verifikasi email dengan `sendEmailVerification()`
4. **Custom Claims**: Bisa tambahkan role (admin/user) dengan Firebase Admin SDK

## 🧪 Testing

Coba test flow berikut:

1. ✅ Login dengan email/password yang benar → Berhasil masuk dashboard
2. ✅ Login dengan email yang salah → Error "Email tidak terdaftar"
3. ✅ Login dengan password yang salah → Error "Password salah"
4. ✅ Logout dari dashboard → Kembali ke login page
5. ✅ Coba akses `/dashboard` tanpa login → Auto redirect ke `/login`
6. ✅ Login berhasil lalu refresh page → Tetap login (karena token tersimpan)

# Test Case: Penskalaan Individual dan Batas Maksimum 2x

## ✅ Bukti Implementasi Fitur yang Sudah Ada

### 1. **Penskalaan Individual per Gambar**

```javascript
// State management individual per gambar (baris 79-81)
const [imageScales, setImageScales] = useState<{ [key: number]: number }>({});

// Update hanya gambar yang diklik (baris 162)
return {
  ...prev,
  [imageId]: newScale, // Update individual, tidak mempengaruhi gambar lain
};
```

### 2. **Increment 1.2x Setiap Klik**

```javascript
// Formula scaling (baris 149-153)
if (currentScale >= 2) {
  newScale = 1; // Reset saat mencapai maksimum
} else {
  newScale = Math.min(currentScale * 1.2, 2); // Increment 1.2x
}
```

### 3. **Batas Maksimum 2x**

```javascript
// Pembatasan maksimum (baris 152)
newScale = Math.min(currentScale * 1.2, 2); // Tidak bisa lebih dari 2x

// Auto-reset saat mencapai maksimum (baris 149-151)
if (currentScale >= 2) {
  newScale = 1;
}
```

## 📊 Skenario Test Scaling

### Test Gambar ID: 1

- **Klik 1**: 1.0x → 1.2x (+ switch to ALT)
- **Klik 2**: 1.2x → 1.44x (+ switch to MAIN)
- **Klik 3**: 1.44x → 1.728x (+ switch to ALT)
- **Klik 4**: 1.728x → 2.0x (+ switch to MAIN) ← **MAKSIMUM**
- **Klik 5**: 2.0x → 1.0x (+ switch to ALT) ← **AUTO RESET**

### Test Independence (Gambar lain tidak terpengaruh)

- Klik Gambar 1 → Hanya scale Gambar 1 berubah
- Klik Gambar 5 → Hanya scale Gambar 5 berubah
- Scale Gambar 2,3,4,6,7,8,9 tetap 1.0x

## 🔍 Debug Output

Buka Developer Console untuk melihat log:

```
=== KLIK GAMBAR 1 ===
Toggle: MAIN -> ALT
SCALE UP: 1.00x -> 1.20x
Status: Scale=1.20x | Individual State Updated

=== KLIK GAMBAR 1 ===
Toggle: ALT -> MAIN
SCALE UP: 1.20x -> 1.44x
Status: Scale=1.44x | Individual State Updated
```

## ✅ Kesimpulan

**SEMUA FITUR SUDAH DIIMPLEMENTASIKAN:**

1. ✅ Penskalaan individual per gambar
2. ✅ Increment 1.2x setiap klik
3. ✅ Batas maksimum 2x
4. ✅ Auto-reset saat mencapai maksimum
5. ✅ Grid 3x3 dengan 18 gambar total
6. ✅ Toggle gambar alternatif

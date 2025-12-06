# 插圖使用指南

## ✅ 已完成的工作

### 1. 創建插圖目錄
- 路徑: `public/illustrations/`
- 包含下載指南 README

### 2. 在頁面中添加插圖位置

#### 位置 1: Carousel 第一張 Slide
- **檔案**: `roommates.svg`
- **位置**: Carousel 第一張投影片的頂部
- **尺寸**: 256px 寬（w-64）
- **用途**: 主視覺，傳達「找室友」的概念
- **降級處理**: 如果圖片載入失敗，自動隱藏

#### 位置 2: 「我們如何幫你找到合適室友？」區塊
- **檔案**: `people_search.svg`
- **位置**: 標題右側
- **尺寸**: 80px 寬（w-20）
- **用途**: 配對機制的視覺化
- **降級處理**: 如果圖片載入失敗，自動隱藏

#### 位置 3: 「配對案例參考」區塊
- **檔案**: `friends.svg`
- **位置**: 標題右側
- **尺寸**: 64px 寬（w-16）
- **用途**: 成功配對的溫馨感
- **降級處理**: 如果圖片載入失敗，自動隱藏

#### 位置 4: 「還沒有您的配對資料」彈窗
- **檔案**: `empty.svg`
- **位置**: 彈窗頂部中央
- **尺寸**: 192px 寬（w-48）
- **用途**: 友善地提示用戶尚未註冊
- **降級處理**: 如果圖片載入失敗，顯示原本的 🏡 emoji

## 📥 下載插圖

### 方法：使用 unDraw

1. **訪問網站**: https://undraw.co/illustrations

2. **設定主色**:
   - 點擊右上角調色盤圖示
   - 輸入 `#E08E6D`（暖橘色）

3. **搜尋並下載**:

   | 檔案名稱 | 搜尋關鍵字 | 推薦插圖名稱 |
   |---------|----------|------------|
   | `roommates.svg` | "roommates" / "moving" | Roommates, Moving, House searching |
   | `people_search.svg` | "people search" / "community" | People search, Community, Together |
   | `friends.svg` | "friends" / "happy" | Friends, Happy announcement, Agreement |
   | `empty.svg` | "empty" / "searching" | Empty, Void, No data |

4. **下載格式**: SVG

5. **儲存位置**: 將下載的 SVG 檔案放入 `public/illustrations/` 目錄

## 🎨 替代資源

如果 unDraw 找不到合適的插圖：

- **Humaaans**: https://www.humaaans.com/ - 可自定義人物
- **Open Doodles**: https://www.opendoodles.com/ - 手繪風格
- **DrawKit**: https://www.drawkit.io/ - 免費 SVG 插圖
- **Storyset**: https://storyset.com/ - 可自定義顏色的插圖

## 🔧 技術細節

### 圖片載入失敗處理

所有插圖都有 `onError` 處理：
- 小插圖（標題旁）：載入失敗時自動隱藏
- 大插圖（彈窗）：載入失敗時顯示 emoji 降級方案

### 響應式設計

- 所有插圖使用 `w-{size}` 和 `h-auto` 保持比例
- 透明度設定讓插圖不會過於搶眼（opacity-70 到 opacity-90）

### 顏色建議

下載時建議使用的顏色設定：
- **主色**: `#E08E6D`（暖橘色）
- **輔助色**: 保持預設或使用 `#6EE0A8`（淺綠色）

## ✨ 視覺效果預期

加入插圖後，整個網站將：
1. **更有生活感** - 不再只是文字和數據
2. **更溫暖親切** - 線條插圖傳達人文關懷
3. **視覺平衡** - 打破文字密集感
4. **品牌一致** - 暖橘色系貫穿全站

## 🚀 下一步

1. 下載 4 個插圖（約 10 分鐘）
2. 放入 `public/illustrations/` 目錄
3. 重新整理頁面查看效果
4. 根據實際效果調整尺寸或位置

---

**注意**: 如果暫時沒有插圖檔案，頁面不會顯示錯誤，會自動降級為純文字版本。

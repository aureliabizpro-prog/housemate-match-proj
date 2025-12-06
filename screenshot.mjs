import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const screenshots = [
    // 手機版
    {
      name: 'mobile-iphone14pro',
      viewport: { width: 393, height: 852 },
      description: 'iPhone 14 Pro'
    },
    {
      name: 'mobile-iphoneSE',
      viewport: { width: 375, height: 667 },
      description: 'iPhone SE (小螢幕)'
    },
    {
      name: 'mobile-iphone14promax',
      viewport: { width: 430, height: 932 },
      description: 'iPhone 14 Pro Max (大螢幕)'
    },
    // 桌面版
    {
      name: 'desktop-1920',
      viewport: { width: 1920, height: 1080 },
      description: 'Desktop 1920x1080'
    },
    {
      name: 'desktop-1366',
      viewport: { width: 1366, height: 768 },
      description: 'Laptop 1366x768'
    }
  ];

  for (const config of screenshots) {
    console.log(`📸 正在截取: ${config.description}...`);

    const page = await context.newPage();
    await page.setViewportSize(config.viewport);

    // 訪問首頁
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // 等待動畫完成

    // 截取首頁
    await page.screenshot({
      path: `screenshots/${config.name}-home.png`,
      fullPage: true
    });

    // 測試 Email 搜尋框 focus 狀態
    await page.click('input[type="email"]');
    await page.screenshot({
      path: `screenshots/${config.name}-email-focus.png`,
      fullPage: true
    });

    // 測試輸入錯誤 email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("搜尋")');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `screenshots/${config.name}-search-result.png`,
      fullPage: true
    });

    await page.close();
    console.log(`✅ ${config.description} 完成`);
  }

  await browser.close();
  console.log('\n🎉 所有截圖已保存至 screenshots/ 目錄');
}

takeScreenshots().catch(console.error);

import { chromium } from "playwright-core";
import fs from "node:fs";

fs.mkdirSync("qa", { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "ru-RU",
  colorScheme: "light",
});
const page = await context.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
await page.locator("section").filter({ hasText: "Всё, что нужно для старта" }).first().screenshot({
  path: "qa/modules-desktop.png",
});
const card = page.locator('a[href="/vacancies"]').filter({ hasText: "Вакансии и резюме" }).first();
await card.screenshot({ path: "qa/module-card.png" });

await page.goto("http://127.0.0.1:3001/vacancies/frontend-react-kaspiytech", {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(900);
await page.screenshot({ path: "qa/vacancy-desktop.png" });

// Header heart should open the favorites tab, profile icon stays on overview
await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
await page.getByRole("link", { name: "Избранное" }).click();
await page.waitForTimeout(900);
console.log("FAVORITES URL", page.url());
await page.screenshot({ path: "qa/favorites-desktop.png" });
await page.getByRole("link", { name: "Профиль" }).click();
await page.waitForTimeout(700);
console.log("PROFILE URL", page.url());

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(1000);
await mobile.screenshot({ path: "qa/home-mobile.png" });
const tabs = await mobile.evaluate(() => {
  const search = document.querySelector('form');
  const buttons = [...document.querySelectorAll('form button[type="button"]')].slice(0, 3);
  return {
    formWidth: Math.round(search?.getBoundingClientRect().width ?? 0),
    tabs: buttons.map((b) => {
      const r = b.getBoundingClientRect();
      return { text: b.textContent, left: Math.round(r.left), right: Math.round(r.right) };
    }),
  };
});
console.log("TABS", JSON.stringify(tabs));

await mobile.goto("http://127.0.0.1:3001/vacancies", { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: "qa/vacancies-mobile.png" });
await mobile.goto("http://127.0.0.1:3001/vacancies/frontend-react-kaspiytech", {
  waitUntil: "domcontentloaded",
});
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: "qa/vacancy-mobile.png" });
await mobile.goto("http://127.0.0.1:3001/profile?tab=favorites", { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: "qa/favorites-mobile.png" });

const small = await context.newPage();
await small.setViewportSize({ width: 320, height: 700 });
await small.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
await small.waitForTimeout(900);
await small.screenshot({ path: "qa/home-320.png" });
const smallInfo = await small.evaluate(() => ({
  width: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
}));
console.log("SMALL", smallInfo);

console.log("ERRORS", errors.length, errors.slice(0, 10));
await browser.close();

import { test as base } from "@playwright/test";
import { Application } from "app";


export const test = base.extend<{ app: Application }>({
    app: async ({ page }, use) => {
        const app = new Application(page);
        page.goto("https://store.cpanel.net/store/cpanel-licenses");
        page.waitForLoadState();
        
        await use(app);
    }
});
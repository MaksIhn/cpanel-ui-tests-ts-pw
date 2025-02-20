import { Page } from "@playwright/test";

export class BasePage {
  
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async open(url?: string) {
    url = url || "/";

    await this.page.goto(url);
  }
}

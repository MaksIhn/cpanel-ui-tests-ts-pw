import { CheckoutPage } from "@pages/CheckoutPage";
import { ConfigurePage } from "@pages/ConfigurePage";
import { cPanelLicensesPage } from "@pages/ProductPage";
import { ReviewPage } from "@pages/ReviewPage";
import { Page } from "@playwright/test";


export class Application extends class {
    constructor(protected page: Page) {}
} {
    checkoutPage = new CheckoutPage(this.page);
    configurePage = new ConfigurePage(this.page);
    cPanelLicenses = new cPanelLicensesPage(this.page);
    reviewPage = new ReviewPage(this.page);
}
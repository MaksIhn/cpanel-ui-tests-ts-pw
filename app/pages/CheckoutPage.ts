import { expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "app/helpers/decorators/Step";

export class CheckoutPage extends BasePage {
  
  private getCategoryByHeadingLocator = (heading: string): Locator =>
    this.page.locator(".sub-heading").getByText(heading);
  private orderCompleteButtonLocator = this.page.locator("#btnCompleteOrder");

  
  @step()
  async checkAreAllElementsPresent(){
    const categories = [
      "Personal Information",
      "Billing Address",
      "Account Security",
      "Terms & Conditions",
    ];

    for (const cat of categories) {
      await expect(this.getCategoryByHeadingLocator(cat)).toBeVisible();
    }

    await expect(this.orderCompleteButtonLocator).toBeDisabled();
  }
}

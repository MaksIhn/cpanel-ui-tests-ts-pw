import { expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Product } from "./ProductPage";
import { Addon } from "./ConfigurePage";
import { calcDueToday, calcTotalAmount, calcTotalDueToday, getPriceByLocator, priceToString } from "app/components/Price";
import { step } from "app/helpers/decorators/Step";

export class ReviewPage extends BasePage {
  
  private checkoutButton: Locator = this.page.locator("#checkout");
  private getCartItem = (productAddon: Product | Addon): Locator =>
    this.page
  .getByText(productAddon.title)
  .locator('//ancestor::*[@class = "item"]'); 
  private subtotalOrderSumText: Locator = this.page.locator("#subtotal");
  private totalDueTodayOrderSumText: Locator = this.page.locator("#totalDueToday");


  @step()
  async checkCartItems(product: Product, addons: Addon[], ipAddress: string) {
    
    await expect(this.getCartItem(product).getByText(ipAddress),
      `IP adress is displayed for product '${product.title}'`
    ).toBeVisible();

    for (const addon of addons) {
    
      expect(priceToString(await getPriceByLocator(this.getCartItem(addon).locator(".item-price span").first())),
        `Due Today Price in cart item for '${addon.title}' addon is correct`
      ).toEqual(priceToString(calcDueToday(addon)));

      expect(await getPriceByLocator(this.getCartItem(addon).locator(".item-price span ~span").first()),
        `Price in cart item for '${addon.title}' addon is correct`
      ).toEqual(addon.price);
    }

      expect(priceToString(await getPriceByLocator(this.getCartItem(product).locator(".item-price span").first())),
        `Due Today Price in cart item for '${product.title}' product is correct`
      ).toEqual(priceToString(calcDueToday(product)));

      expect(priceToString(await getPriceByLocator(this.getCartItem(product).locator(".item-price span ~span"))),
        `Price in cart item for '${product.title}' product is correct`
      ).toEqual(priceToString(calcTotalAmount(product, addons)));
  }

  @step()
  async checkOrderSummary(product: Product, addons: Addon[]) {
    
    const totalDueToday = calcTotalDueToday(product, addons);

    expect(priceToString(await getPriceByLocator(this.subtotalOrderSumText)),
      `Subtotal price is correct in Order Summary form`
    ).toEqual(priceToString(totalDueToday));

    expect(priceToString(await getPriceByLocator(this.totalDueTodayOrderSumText)),
      `Total Due Today price is correct in Order Summary form`
    ).toEqual(priceToString(totalDueToday));
  }
  
  @step()
  async clickCheckoutButton() {
    await this.checkoutButton.click();
    await this.page.waitForEvent("domcontentloaded");
    await expect(this.page.locator("h1", { hasText: "Checkout" }), 
      "The Checkout page is visible after clicking on the Checkout button"
    ).toBeVisible();
  }

}

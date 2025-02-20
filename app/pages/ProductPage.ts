import { expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Price, getPriceByLocator } from "../components/Price";
import { step } from "app/helpers/decorators/Step";


export type Product = {
  title: string;
  description: string;
  price: Price;
  _orderNowButton: Locator;
}

export class cPanelLicensesPage extends BasePage {
  
  private productsContainer = this.page.locator(".products .product");
  
  @step()
  private async _getProducts(): Promise<Product[]> {
    
    await expect.poll(() => this.productsContainer.first().isVisible(), {message: "At least one product is visible", timeout: 5000},
    ).toBeTruthy();

    return Promise.all(
      (await this.productsContainer.all()).map(async (product) => ({
        title: (await product.locator("header").textContent() ?? '').replaceAll('\n', '').trim(),
        description: (await product.locator(".product-desc").textContent() ?? '').replaceAll('\n', '').trim(),
        price: await getPriceByLocator(product.locator(".price")) ?? {},
        _orderNowButton: product.locator(".btn-order-now"),
      }))
    );
  }
  
  @step()
  async getProduct(productTitle?: string): Promise<Product> {
    
    const productsList = (await this._getProducts()).filter((e) => e.title !== "WP Squared");
    const productsListSize = productsList.length;
    if (productTitle) {
      const foundProduct = productsList.find((product) => product.title === productTitle);
      if (foundProduct) {
        return foundProduct;
      }
      throw new Error(`No product found with the name: ${productTitle}`);
    }
    
    const product = productsList.at(Math.floor(Math.random() * productsListSize));
    if (product) {
      return product;
    }
    throw new Error(`No product found on the page`);
  }

  @step()
  async orderProduct(product: Product) {
    
    product._orderNowButton.click();
    await this.page.waitForEvent("domcontentloaded")
    await expect(
      this.page.locator("h1", { hasText: "Configure" })
      , "The Configure page is visible after clicking on the the Order Product button"
    ).toBeVisible();
  }
}
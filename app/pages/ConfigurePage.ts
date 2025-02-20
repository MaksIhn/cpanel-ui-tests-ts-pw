import { expect, Locator } from "@playwright/test";
import { Price, calcTotalAmount, calcTotalDueToday, getPriceByLocator, priceToString } from "app/components/Price";
import { BasePage } from "./BasePage";
import { Product } from "./ProductPage";
import { step } from "app/helpers/decorators/Step";


export type Addon = {
  title: string;
  price: Price;
  _card: Locator;
  _checkBox: Locator;
  _addToCartButton: Locator;
}

export class ConfigurePage extends BasePage {
  
  private ipAddressField: Locator = this.page.locator("input[id^=customfield]");
  private ipValidationLoader: Locator = this.page.locator("[id^=customfield][id$=Loader]");
  private addonsContainer: Locator = this.page.locator(".panel-addon");
  private getSummaryPriceText = (entity: Addon | Product): Locator => {
    return this.page
    .locator("#producttotal")
    .getByText(entity.title)
    .locator("+.float-right").first();
  };
  private summaryMonthlyText: Locator = this.page
  .locator(".summary-totals")
  .getByText("Monthly")
  .locator("+.float-right");
  private totalDueTodaySumText: Locator = this.page.locator(".amt");
  private continueButton: Locator = this.page.locator("#btnCompleteProductConfig");
  

  private async _getAddons(): Promise<Addon[]> {

    await expect(
      this.addonsContainer.first(), 
      "At least one addon should be visible"
    ).toBeVisible()

    return Promise.all(
      (await this.addonsContainer.all()).map(async (addon) => ({
        title: (await addon.locator("//ancestor::label").textContent() ?? '').replaceAll('\n', '').trim(),
        price: await getPriceByLocator(addon.locator(".panel-price")) ?? {},
        _card: addon,
        _checkBox: addon.locator("input[type='checkbox']"),
        _addToCartButton: addon.locator(".panel-add"),
      }))
    )
  }

  private _getAddon(addonsList: Addon[]) {

    const addon = addonsList.at(Math.floor(Math.random() * addonsList.length));
    
    if (addon) {
      return addon;
    }
    else throw new Error(`No addons found on the page`);
  }

  @step()
  async getAddon() {

    return this._getAddon(await this._getAddons());
  }

  @step()
  async getAddonExclude(excludedAddons: Addon[]) {
    
    const addonsList = await this._getAddons();
    const excludedTitles = excludedAddons.map(el=>el.title);
    const filteredList = addonsList.filter((addon) => !(excludedTitles.includes(addon.title)));
    
    return this._getAddon(filteredList);
  }

  @step()
  async getAddonByTitle(addonTitle: string) : Promise<Addon> {

    const foundAddon = (await this._getAddons()).find((addon) => addon.title === addonTitle);
    
    if (foundAddon) {
      return foundAddon;
    }
    throw new Error(`No addon found with the name: ${addonTitle}`);
  }

  @step()
  async chooseAddons(addonsList: Addon[]) {
    
    for (const addon of addonsList) {
      
      await addon._addToCartButton.click();

      await expect(addon._checkBox, 
        "The addon checkbox is checked after clicking on the Add to Cart button: "+addon.title)
      .toBeChecked();
      
      await expect(addon._addToCartButton, 
        "The addon button name is changed to 'Added to Cart (Remove)'")
      .toHaveText("Added to Cart (Remove)")
    }
  }

  @step()
  async checkPricesOnSummaryForm(product: Product, addons: Addon[]) {
    
    for (const item of [product, ...addons]) {
      expect(await getPriceByLocator(this.getSummaryPriceText(item)), 
      `The ${item.title} price from the Summary form equals to price from it card`
      ).toEqual(item.price)
    }

    expect(priceToString(await getPriceByLocator(this.summaryMonthlyText)), 
      "The total monthly price from the Summary form equals to sum of the product and addons prices"
    ).toEqual(priceToString(calcTotalAmount(product, addons)));
    
    expect(priceToString(await getPriceByLocator(this.totalDueTodaySumText)), 
      `The total due today price from the Summary form equals to price for the rest of the month for product and addons`
    ).toEqual(priceToString(calcTotalDueToday(product, addons)));
  }
  
  @step()
  async fillIpAddress(ipAddress: string) {

    await this.ipAddressField.fill(ipAddress);
    await this.ipAddressField.press("Enter");

    await expect(this.ipValidationLoader, 
      "The IP validation loader is visible after entering the IP address")
    .toBeVisible();
    
    await this.ipValidationLoader.waitFor({state: "hidden"});
    await expect(this.ipValidationLoader, 
      "The IP validation loader is hidden by 5 sec after entering the IP address")
    .toBeHidden();
  }

  @step()
  async clickContinueButton() {

    await this.continueButton.click();
    await this.page.waitForEvent("domcontentloaded")
    await expect(this.page.locator("h1", { hasText: "Review & Checkout" }), 
      "The Review & Checkout page is visible after clicking on the Continue button"
    ).toBeVisible();
  }

}

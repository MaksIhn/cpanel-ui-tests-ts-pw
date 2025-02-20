import { screenshotOnFailure } from "app/helpers/ScreenshotOnFailure";
import { test } from "../fixtures";
import {generateIp} from "app/components/IpAddress";


const productData = {
  productTitle: "cPanel Solo® Cloud (1 Account)",
  price: 0,
};

const addonData = {
  productTitle: "Monthly CloudLinux for cPanel License",
  price: 0,
};

test.afterEach(screenshotOnFailure);

test("Order exact product with 1 exact addon", async ({ app }) => {
  
  const product = await app.cPanelLicenses.getProduct(productData.productTitle);
  
  await app.cPanelLicenses.orderProduct(product);
  
  const addons = new Array(0);
  addons.push(await app.configurePage.getAddonByTitle(addonData.productTitle));
  const ipAddress = "2.2.2.2";

  await app.configurePage.fillIpAddress(ipAddress)
  await app.configurePage.chooseAddons(addons);
  await app.configurePage.checkPricesOnSummaryForm(product, addons);
  await app.configurePage.clickContinueButton();
  
  await app.reviewPage.checkCartItems(product, addons, ipAddress);
  await app.reviewPage.checkOrderSummary(product, addons);
  await app.reviewPage.clickCheckoutButton();
  
  await app.checkoutPage.checkAreAllElementsPresent();
});

test("Order some product with 2 addons", async ({ app }) => {
  
  const product = await app.cPanelLicenses.getProduct();
  
  await app.cPanelLicenses.orderProduct(product);
  
  const addons = new Array(0);
  addons.push(await app.configurePage.getAddon());
  addons.push(await app.configurePage.getAddonExclude(addons));
  const ipAddress = generateIp();
  
  await app.configurePage.fillIpAddress(ipAddress)
  await app.configurePage.chooseAddons(addons);
  await app.configurePage.checkPricesOnSummaryForm(product, addons);
  await app.configurePage.clickContinueButton();
  
  await app.reviewPage.checkCartItems(product, addons, ipAddress);
  await app.reviewPage.checkOrderSummary(product, addons);
  await app.reviewPage.clickCheckoutButton();
  
  await app.checkoutPage.checkAreAllElementsPresent();
});


test("Order some product with 4 addons", async ({ app }) => {
  
  const product = await app.cPanelLicenses.getProduct();
  
  await app.cPanelLicenses.orderProduct(product);
  
  const addons = new Array(0);
  addons.push(await app.configurePage.getAddon());
  addons.push(await app.configurePage.getAddonExclude(addons));
  addons.push(await app.configurePage.getAddonExclude(addons));
  addons.push(await app.configurePage.getAddonExclude(addons));
  const ipAddress = generateIp();
  
  await app.configurePage.fillIpAddress(ipAddress)
  await app.configurePage.chooseAddons(addons);
  await app.configurePage.checkPricesOnSummaryForm(product, addons);
  await app.configurePage.clickContinueButton();
  
  await app.reviewPage.checkCartItems(product, addons, ipAddress);
  await app.reviewPage.checkOrderSummary(product, addons);
  await app.reviewPage.clickCheckoutButton();
  
  await app.checkoutPage.checkAreAllElementsPresent();
});

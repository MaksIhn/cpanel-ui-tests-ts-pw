import { Addon } from "@pages/ConfigurePage";
import { Product } from "@pages/ProductPage";
import { Locator } from "@playwright/test";


export type Price = {
    symbol: string;
    value: number;
    currency: string;
}

export async function getPriceByLocator(priceLocator: Locator): Promise<Price> {
    
    const priceOnPage = await priceLocator.textContent();
    
    if (!priceOnPage) {
        throw new Error("Price not found");
    }
    const parsed = priceOnPage.match(/(\$)((?:\d,)?\d+\.\d+) (\w+)(?: (\w+))?/);
    if (!parsed) {
        throw new Error(`Can't parse price: ${priceOnPage}`);
    }

    return {
        symbol: parsed[1],
        value: parseFloat(parsed[2].replaceAll(",", "")),
        currency: parsed[3],
    }
}

export function calcTotalAmount(product: Product, addons: Addon[]): string {
    
    let sum = 0;
    
    for (const item of [product, ...addons]) {
        sum += item.price.value;
    }
    
    return sum.toFixed(2);
}

export function calcTotalDueToday(product: Product, addons: Addon[]): string {
    
    let sum = 0;
    const currentDayMinus1 = new Date().getDate()-1;
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    
    for (const item of [product, ...addons]) {
        sum += Math.round(item.price.value / lastDayOfMonth * (lastDayOfMonth - currentDayMinus1) * 100 ) / 100;
    }
    
    return sum.toString();
}

export function calcDueToday(item: Product | Addon): string {
    
    const currentDayMinus1 = new Date().getDate()-1;
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const sum = item.price.value / lastDayOfMonth * (lastDayOfMonth - currentDayMinus1);
    
    return sum.toFixed(2);
}

export function priceToString(price: Price | number | string): string {
    
    if (typeof price === 'object') return `${price.symbol}${price.value.toFixed(2)} ${price.currency}`;
    else if (typeof price === 'string') return `$${parseFloat(price).toFixed(2)} USD`;
    else return `$${price.toFixed(2)} USD`;
}

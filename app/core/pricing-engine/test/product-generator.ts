
import {ProductItem, ProductType} from "../price-engine";

export class ProductGenerator {
	constructor() {}

	private randomValue(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	public generateProcuts(minCount: number, maxCount: number,
						   minPrice: number, maxPrice: number,
						   types: ProductType[]): ProductItem[] {

		let result = new Array<ProductItem>();

		let itemCount = this.randomValue(minCount, maxCount);

		for (let i = 0; i < itemCount-1; i++) {
			let item = new ProductItem();
			item.itemId = this.randomValue(100, 1000);
			item.price = this.randomValue(minPrice, maxPrice);
		}

		return result;
	}
}
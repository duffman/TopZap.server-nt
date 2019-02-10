/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

let block = `import {IBasketItem} from '@zapModels/basket/basket-item.model';
import {BasketItem} from '@zapModels/basket/basket-item.model';
import {IBasketModel} from '@zapModels/basket/basket.model';
import {IVendorBasket} from '@zapModels/basket/vendor-basket.model';
import {VendorBasketModel} from '@zapModels/basket/vendor-basket.model';
import {IVendorOfferData} from '@zapModels/zap-offer.model';
import {ISessionBasket} from '@zapModels/session-basket';
import {PRandNum} from '@putte/prand-num';
import {ProductDb} from '@db/product-db';
import {BarcodeParser} from '@zaplib/barcode-parser';
import {IVendorModel} from '@zapModels/vendor-model';
import {IGameProductData} from '@zapModels/game-product-model';
import { IProductData} from '@zapModels/product.model';
import { IGameBasketItem} from '@zapModels/basket/basket-product-item';
import { ProductItemTypes} from '@zapModels/product-item-types';
import { CliDebugYield} from '@cli/cli.debug-yield';
import { Logger} from '@cli/cli.logger';
import { AppSessionManager} from '@components/app-session-manager';
`;



if (block.indexOf("\r\n") > -1) {
	console.log("WIN");
}

else if (block.indexOf("\n") > -1) {
	console.log("NIX");
}

let splitted = block.split(" ", 3);
console.log(splitted)
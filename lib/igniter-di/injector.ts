/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */



export const Injector = new class {
	// resolving instances
	resolve<T>(target: Type<any>): T {
		// tokens are required dependencies, while injections are resolved tokens from the Injector
		let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
			injections = tokens.map(token => Injector.resolve<any>(token));

		return new target(...injections);
	}
};
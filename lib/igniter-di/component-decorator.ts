/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { GenericClassDecorator }  from '@lib/igniter-di/generic-decorator';

const Component = () : GenericClassDecorator<Type<object>> => {
	return (target: Type<object>) => {
		// do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
	};
};
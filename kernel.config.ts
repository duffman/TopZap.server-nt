import { Container }              from "inversify";
import { IZapNode }               from '@app/types/coldmind-node';
import { IProductDb }             from "@db/product-db";
import { ProductDb }              from "@db/product-db";
import { IWebApp }                from "@app/webapp";
import { WebApp }                 from "@app/webapp";
import { Bootstrap }              from "./main";
import { IServerService }         from "@app/server.service";
import { ServerService }          from "@app/server.service";
import { IRestApiController }     from '@api/api-controller';
import { BidsApiController }      from '@api/bids-api.controller';
import { CaptchaController }      from '@api/captcha.controller';
import { DataCacheController }    from '@api/data-cache-controller';
import { ProductApiController }   from '@api/product-api.controller';
import { PutteController }        from '@api/putte.controller';
import { ServiceApiController }   from '@api/service-api.controller';
import { IBasketService }         from '@app/services/basket.service';
import { BasketService }          from '@app/services/basket.service';
import { BidsPubsub }             from '@pubsub/bids-pubsub';

let KernelModules = {
	ApiController      : Symbol("IApiController")
};

let Interface = {
	ZapNode           : "IZapNode",
	ServerService     : "IServerService",
	WebApp            : "IWebApp",
	ProductDb         : "IProductDb",
	BasketService     : "IBasketService",

	// Controllers
	RestApiController : "IRestApiController",
	PubsubController  : "IPubsubController"
};

let Tag = {
	Handler           : "handler",
	Message           : "message",
	DataModule        : "data_module",
	ProtocolManager   : "protocol_manager",
	ApiController     : "api_controller"
};

let kernel = new Container();


//
//
kernel.bind<IZapNode>             (Interface.ZapNode).to(Bootstrap);
kernel.bind<IServerService>       (Interface.ServerService).to(ServerService).inSingletonScope();
kernel.bind<IWebApp>              (Interface.WebApp).to(WebApp).inSingletonScope();
kernel.bind<IProductDb>           (Interface.ProductDb).to(ProductDb).inSingletonScope();
kernel.bind<IBasketService>       (Interface.BasketService).to(BasketService).inSingletonScope();
kernel.bind<IBasketService>       (Interface.PubsubController).to(BidsPubsub).inSingletonScope();



//
// Drone related
//

//
// API Controllers
//
kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(BidsApiController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(CaptchaController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(DataCacheController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(ProductApiController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(PutteController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

kernel.bind<IRestApiController>(Interface.RestApiController)
	.to(ServiceApiController).inSingletonScope()
	.whenTargetTagged(Tag.Handler, Tag.ApiController);

export { kernel, KernelModules, Interface, Tag };

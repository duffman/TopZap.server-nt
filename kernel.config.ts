import { Container }              from "inversify";
import { IZapNode }               from '@app/types/coldmind-node';
import { IProductDb }             from "@db/product-db";
import { ProductDb }              from "@db/product-db";
import { IWebApp }                from "@app/webapp";
import { WebApp }                 from "@app/webapp";
import { Bootstrap }              from "./main";
import { IServerService }         from "@app/server.service";
import { ServerService }          from "@app/server.service";
import { IDroneWorkersPipe }      from '@zapdrone/pipes/drone-workers-pipe';
import { DroneWorkersPipe }       from '@zapdrone/pipes/drone-workers-pipe';
import { IDroneBidsPipe}          from '@zapdrone/pipes/drone-bids-pipe';
import { DroneBidsPipe }          from '@zapdrone/pipes/drone-bids-pipe';
import { IRestApiController }     from '@api/api-controller';
import { BidsApiController }      from '@api/bids-api.controller';
import { CaptchaController }      from '@api/captcha.controller';
import { DataCacheController }    from '@api/data-cache-controller';
import { ProductApiController }   from '@api/product-api.controller';
import { PutteController }        from '@api/putte.controller';
import { ServiceApiController }   from '@api/service-api.controller';
import { IBasketService }         from '@app/services/basket.service';
import { BasketService }          from '@app/services/basket.service';

let KernelModules = {
	ApiController      : Symbol("IApiController")
};

let Interface = {
	ZapNode           : "IZapNode",
	ServerService     : "IServerService",
	WebApp            : "IWebApp",
	ProductDb         : "IProductDb",
	DroneWorkersPipe  : "IDroneWorkersPipe",
	DroneBidsPipe     : "IDroneBidsPipe",
	BasketService     : "IBasketService",

	// Controllers
	RestApiController : "IRestApiController",


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

//
// Drone related
//
kernel.bind<IDroneBidsPipe>       (Interface.DroneBidsPipe).to(DroneBidsPipe).inSingletonScope();
kernel.bind<IDroneWorkersPipe>    (Interface.DroneWorkersPipe).to(DroneWorkersPipe).inSingletonScope();

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



//
// Bind API Controllers
//
//kernel.bind<IMessageHandler>("IMessageHandler").to(KeyStoreMessageHandler).whenTargetTagged(Tag.Handler, Tag.Message);


/********************************************************************************************
 * ColdmindServerCore Core
 **
kernel.bind<IgniterApp>              ("IgniterApp").to(Application);
kernel.bind<IMessageHub>             ("IMessageHub").to(MessageHub).inSingletonScope();
kernel.bind<IConnectionHub>          ("IConnectionHub").to(ConnectionHub).inSingletonScope();
kernel.bind<INetworkHub>             ("INetworkHub").to(NetworkHub).inSingletonScope();
kernel.bind<IMessageEmitter>         ("IMessageEmitter").to(MessageEmitter).inSingletonScope();

kernel.bind<IMessageHandler>("IMessageHandler")
	.to(KeyStoreMessageHandler).whenTargetTagged(Tag.Handler, Tag.Message);

kernel.bind<IMessageHandler>("IMessageHandler")
	.to(SessionMessageHandler).whenTargetTagged(Tag.Handler, Tag.Message);
 */

export { kernel, KernelModules, Interface, Tag };

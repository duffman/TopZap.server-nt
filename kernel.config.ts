import { Container }              from "inversify";
import { IZapNode }               from '@app/types/coldmind-node';
import { IProductDb }             from "@db/product-db";
import { ProductDb }              from "@db/product-db";
import { IWebApp }                from "@app/webapp";
import { WebApp }                 from "@app/webapp";
import { Bootstrap }              from "./main";
import { IServerService }         from "@app/server.service";
import { ServerService }          from "@app/server.service";

let KernelModules = {
	ApiController      : Symbol("IApiController")
};

let Interface = {
	ZapNode           : "IZapNode",
	ServerService     : "IServerService",
	WebApp            : "IWebApp",
	ProductDb         : "IProductDb"
};

let Tag = {
	Handler           : "handler",
	Message           : "message",
	DataModule        : "data_module",
	ProtocolManager   : "protocol_manager"
};

let kernel = new Container();

//
//
kernel.bind<IZapNode>             (Interface.ZapNode).to(Bootstrap);
kernel.bind<IServerService>       (Interface.ServerService).to(ServerService).inSingletonScope();
kernel.bind<IWebApp>              (Interface.WebApp).to(WebApp).inSingletonScope();
kernel.bind<IProductDb>           (Interface.ProductDb).to(ProductDb).inSingletonScope();

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

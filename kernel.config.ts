import { Container }              from "inversify";
import { Main }                   from './main';
import { IColdmindNode }          from '@app/types/coldmind-node';
import { IProductDb, ProductDb } from "@db/product-db";

let KernelModules = {
	ApiController      : Symbol("IApiController")
};


let Interface = {
	ProductDb: "IProductDb"
};


let Tag = {
	Handler         : "handler",
	Message         : "message",
	DataModule      : "data_module",
	ProtocolManager : "protocol_manager"
};

let kernel = new Container();

//
//
//
kernel.bind<IColdmindNode>          ("IColdmindNode").to(Main);
kernel.bind<IProductDb>             (Interface.ProductDb).to(ProductDb).inSingletonScope();



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

export { kernel, KernelModules, Tag };
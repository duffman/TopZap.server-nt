
interface PublishData {
	room: string;
	message: any;
}

interface DroneChannel {
	on(name: string, handler: { (data?: any): void }) : void;
	unsubscribe();
}

declare module "Scaledrone" {
	function on(name: string, handler: { (data?: any): void }) : void;
	function subscribe(): DroneChannel;
	function publish(data: PublishData);
	function close();
}
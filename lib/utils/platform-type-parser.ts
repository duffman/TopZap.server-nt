/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */


enum ImageType {
	Platform,
	Icon
}

enum PlatformType {
	Unknown,
	CDAudio,
	GameboyAdvance,
	GameCube,
	Mac,
	Multiformat,
	NGage,
	Nintendo3DS,
	Nintendo64,
	NintendoDS,
	NintendoDSDSi,
	NintendoNES,
	NintendoSwitch,
	NintendoWii,
	NintendoWiiU,
	PC,
	PCDownload,
	PCMac,
	PlayStation,
	PlayStation2,
	PlayStation3,
	PlayStation4,
	PlayStationPortable,
	PlayStationVita,
	PSP,
	Wii,
	WiiU,
	Xbox,
	Xbox360,
	XboxOne
}


export class PlatformTypeParser {
	constructor() {
	}

	/**
	 * 
	 * @param type 
	 */
	public getTypeFromStr(type: string): PlatformType {
		let result = PlatformType.Unknown;

		type = type.toLowerCase();

		switch (type) {
			case "cd audio":
				result = PlatformType.CDAudio 
				break;
			case "gameboy advance":
				result = PlatformType.GameboyAdvance; 
				break;
			case "gamecube":
				result = PlatformType.GameCube;
				break;
			case "mac":
				result = PlatformType.Mac;
				break;
			case "multiformat":
				result = PlatformType.Multiformat;
				break;
			case "n-gage":
				result = PlatformType.NGage;
				break;
			case "nintendo 3ds":
				result = PlatformType.Nintendo3DS;
				break;
			case "nintendo 64":
				result = PlatformType.Nintendo64;
				break;
			case "nintendo ds":
				result = PlatformType.Nintendo3DS;
				break;
			case "nintendo ds/dsi":
				result = PlatformType.NintendoDSDSi;
				break;
			case "nintendo nes":
				result = PlatformType.NintendoNES;
				break;
			case "nintendo switch":
				result = PlatformType.NintendoSwitch;
				break;
			case "nintendo wii":
				result = PlatformType.Wii;
				break;
			case "nintendo wii u":
				result = PlatformType.WiiU;
				break;
			case "pc":
				result = PlatformType.PC;
				break;
			case "pc download":
				result = PlatformType.PCDownload;
				break;
			case "pc/mac":
				result = PlatformType.PCMac;
				break;
			case "playstation":
				result = PlatformType.PlayStation;
				break;
			case "playstation 2":
				result = PlatformType.PlayStation2;
				break;
			case "playstation 3":
				result = PlatformType.PlayStation3;
				break;
			case "playstation 4":
				result = PlatformType.PlayStation4;
				break;
			case "playstation portable":
				result = PlatformType.PlayStationPortable;
				break;
			case "playstation vita":
				result = PlatformType.PlayStationVita;
				break;
			case "psp":
				result = PlatformType.PSP;
				break;
			case "wii":
				result = PlatformType.Wii;
				break;
			case "wii u":
				result = PlatformType.WiiU;
				break;
			case "xbox":
				result = PlatformType.Xbox;
				break;
			case "xbox 360":
				result = PlatformType.Xbox360;
				break;
			case "xbox one":
				result = PlatformType.XboxOne;
				break;
		}

		return result
	}

	public getFilename(icon: boolean, type: PlatformType): string {
		let filenamePrefix = icon ? "icon-" : "platform-";
		let result = ""

		switch (type) {
			case PlatformType.Unknown:
				result = "unknown";
				break;
			case PlatformType.CDAudio:
				result = "music-cd";
				break;
			case PlatformType.GameboyAdvance:
				break;
			case PlatformType.GameCube:
				result = "gamecube";
				break;
			case PlatformType.Mac:
				break;
			case PlatformType.Multiformat:
				break;
			case PlatformType.NGage:
				result = "nintendo-3ds.png";
				break;
			case PlatformType.Nintendo3DS:
				result = "nintendo-3ds.png";
				break;
			case PlatformType.Nintendo64:
				result = "nintendo-64";
				break;
			case PlatformType.NintendoDS:
				result = "nintendo-ds";
				break;
			case PlatformType.NintendoDSDSi:
				result = "nintendo-ds";
				break;
			case PlatformType.NintendoNES:
				result = "nintendo";
				break;
			case PlatformType.NintendoSwitch:
				result = "nintendo-switch";
				break; 
			case PlatformType.PC:
				result = "windows";
				break;
			case PlatformType.PCDownload:
				result = "windows";
				break;
			case PlatformType.PCMac:
				break;
			case PlatformType.PlayStation: // DOUBLE
				result = "playstation";
				break;
			case PlatformType.PlayStation2:
				result = "playstation-2";
				break;
			case PlatformType.PlayStation3:
				result = "playstation-3";
			break;
			case PlatformType.PlayStation4:
				result = "playstation-4";
			break;
			case PlatformType.PlayStationPortable:
				result = "playstation";
			break;
			case PlatformType.PlayStationVita:
				result = "ps-vita"
			break;
			case PlatformType.PSP:
				result = "playstation";
				break;
			case PlatformType.NintendoWii: // DOUBLE
				result = "wii";
				break;
			case PlatformType.NintendoWiiU:
				result = "wii-u";
				break;
			case PlatformType.Wii:
				result = "wii";
				break;
			case PlatformType.WiiU:
				result = "wii-u";
				break;
			case PlatformType.Xbox:
				result = "xbox";
				break;
			case PlatformType.Xbox360:
				result = "xbox-360";
				break;
			case PlatformType.XboxOne:
				result = "xbox-one";
				break;
		}

		return filenamePrefix + result + ".png";
	}

	public parseFromName(name: string, icon: boolean): string {
		let type = this.getTypeFromStr(name);
		return this.getFilename(icon, type);
	}
}






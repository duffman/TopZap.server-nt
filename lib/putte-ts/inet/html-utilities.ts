/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

//import * as striptags from "striptags";

export class HtmlUtilities {
	public static stripTags(htmlData: string): string {
		return htmlData.replace(/(<([^>]+)>)/ig,"");
		//return striptags(input);
	}
}
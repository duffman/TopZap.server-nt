/**
 * COLDMIND LTD ("COMPANY") CONFIDENTIAL
 * Unpublished Copyright (c) 2015-2017 COLDMIND LTD, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of COMPANY. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg on 2017
 */

/*
 function weightedRandom($values, $weights){
 $count = count($values);
 $i = 0;
 $n = 0;
 $num = mt_rand(0, array_sum($weights));

 while($i < $count){
	 $n += $weights[$i];
	 if($n >= $num){
		 break;
	 }
	 $i++;
 }
 return $values[$i];
 }
 */


function arraySum(numArray: Array<number>) {
	console.log("arraySum");
	var result = 0;
	for (var i = 0; i < numArray.length; i++) {
		result = (result + numArray[i]);
	}

	return result;
}

function weightedRandom(values: Array<string>, weights: Array<number>) {
	console.log("weightedRandom");
	var sum = arraySum(weights);
	var rand = Math.floor(Math.random() * sum) + 1;

	var i = 0;
	var n = 0;

	while (i < values.length) {
		n = (n + weights[i]);
		if (n >= rand) {
			break;
		}

		i++;
	}

	return values[i];
}


var values = ["Första", "Andra", "Tredje", "Fjärde"];
var weights = [40, 30, 20, 10];

var res = weightedRandom(values, weights);

console.log(res);
'use strict';Object.defineProperty(exports,'__esModule',{value:true});class WorkQueueProgress{constructor(sessionId,totalItems,processedItems,percentDone){this.sessionId=sessionId;this.totalItems=totalItems;this.processedItems=processedItems;this.percentDone=percentDone;}}exports.WorkQueueProgress=WorkQueueProgress;class MinerProgress{getWorkQueueProgress(sessionId){let sql=`
			SELECT
				(SELECT
					COUNT(*) AS COUNT
				FROM
					price_miner_queue
				WHERE
					session_id=${sessionId} AND processed_when IS NOT NULL
			) AS totalCount,
			(
				SELECT
					COUNT(*) AS COUNT
				FROM
					price_miner_queue
				WHERE
					session_id=${sessionId} AND processed_when IS NOT NULL AND price > -1
			) AS processedCount		
		`;return new Promise((resolve,reject)=>{});}}exports.MinerProgress=MinerProgress;
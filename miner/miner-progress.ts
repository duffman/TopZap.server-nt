/**
 * Data structure representing MinerWorkQueue Progress
 */
export class WorkQueueProgress {
	constructor(
		public sessionId: number,
		public totalItems: number,
		public processedItems: number,
		public percentDone: number
	) {}
}

export class MinerProgress {

	public getWorkQueueProgress(sessionId: number): Promise<WorkQueueProgress> {
		let sql = `
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
		`;

		return new Promise((resolve, reject) => {

		});
	}


}
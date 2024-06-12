export class InMemoryCache {
	private cache: Record<string, string> = {};

	async getCache(key: any): Promise<string | null> {
		let cacheKey = undefined;

		try {
			cacheKey = JSON.stringify(key);
		} catch (e) {
		}

		if (cacheKey) {
			const data = this.cache[cacheKey];
			if (data) {
				try {
					return data;
				} catch (e) {
				}
			}
		}

		return null;
	}

	async setCache(key: any, cache: any): Promise<void> {
		let cacheKey = undefined;
		try {
			cacheKey = JSON.stringify(key);
		} catch (e) {
		}

		let cacheValue = undefined;
		try {
			cacheValue = JSON.stringify(cache);
		} catch (e) {
		}

		if (cacheKey && cacheValue) {
			this.cache[cacheKey] = cacheValue;
		}
	}

	async clearCache(): Promise<void> {
		this.cache = {};
	}

}

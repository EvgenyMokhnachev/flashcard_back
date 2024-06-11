import FoldersFilter from "../../domain/folders/FoldersFilter";
import Folder from "../../domain/folders/Folder";
import { redisRepository } from "./RedisRepository";

class FoldersRedisRepository {

	public async setFoldersCacheByFilter(filter: FoldersFilter, cache: Folder[]): Promise<void> {
		const connectToRedis = redisRepository.connectToRedis();

		let filterJSON = '{}';
		try {
			filterJSON = JSON.stringify(filter) || '{}';
		} catch (e) {
			filterJSON = '{}'
		}

		let cacheJSON = null;
		try {
			cacheJSON = JSON.stringify(cache) || null;
		} catch (e) {
			cacheJSON = null;
		}

		if (cacheJSON) {
			await connectToRedis;
			return redisRepository.set('folders:' + filterJSON, cacheJSON, 300);
		}
	}

	public async getFoldersCacheByFilter(filter: FoldersFilter): Promise<Folder[] | null> {
		const connectToRedis = redisRepository.connectToRedis();

		let filterJSON = '{}';
		try {
			filterJSON = JSON.stringify(filter) || '{}';
		} catch (e) {
			filterJSON = '{}'
		}

		await connectToRedis;
		const result: string | null = await redisRepository.get('folders:' + filterJSON) || null;

		if (result) {
			try {
				return JSON.parse(result) || null;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	public async setFolderById(folderId: number, cache: Folder): Promise<void> {
		const connectToRedis = redisRepository.connectToRedis();

		let cacheJSON = null;
		try {
			cacheJSON = JSON.stringify(cache) || null;
		} catch (e) {
			cacheJSON = null;
		}

		if (cacheJSON) {
			await connectToRedis;
			return redisRepository.set('folders:byId:' + folderId, cacheJSON, 300);
		}
	}

	public async getFolderById(folderId: number): Promise<Folder | null> {
		const connectToRedis = redisRepository.connectToRedis();

		await connectToRedis;
		const result: string | null = await redisRepository.get('folders:byId:' + folderId) || null;

		if (result) {
			try {
				return JSON.parse(result) || null;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	public async clearFoldersCache() {
		await redisRepository.deleteByPattern('folders:');
	}

}

export const foldersRedisRepository = new FoldersRedisRepository();

import FolderRepository from "../../../domain/folders/FolderRepository";
import Folder from "../../../domain/folders/Folder";
import FoldersFilter from "../../../domain/folders/FoldersFilter";
import { InMemoryCache } from "../InMemory.Cache";

export default class FoldersRepositoryInMemoryCache implements FolderRepository {
	folderRepository: FolderRepository;
	cache: InMemoryCache;

	constructor(folderRepository: FolderRepository) {
		this.folderRepository = folderRepository;
		this.cache = new InMemoryCache();
	}

	public async save(folder: Folder): Promise<Folder> {
		const result = this.folderRepository.save(folder);
		await this.cache.clearCache();
		return result;
	}

	async delete(id: number): Promise<boolean> {
		const result = this.folderRepository.delete(id);
		await this.cache.clearCache();
		return result;
	}

	async findById(id: number): Promise<Folder | null> {
		const cache: string | null = await this.cache.getCache(id);
		if (cache) try {
			return JSON.parse(cache);
		} catch (e) {
		}

		const result = this.folderRepository.findById(id);

		if (result) {
			await this.cache.setCache(id, result);
		}

		return result;
	}

	public async find(filter: FoldersFilter): Promise<Folder[]> {
		const cache: string | null = await this.cache.getCache(filter);
		if (cache) try {
			return JSON.parse(cache);
		} catch (e) {
		}

		const result = await this.folderRepository.find(filter);

		if (result && result.length) {
			await this.cache.setCache(filter, result);
		}

		return result;
	}

}

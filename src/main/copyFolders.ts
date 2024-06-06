import fs from 'fs';
import FoldersRepositoryPgSql from "./database/pgsql/folders/FoldersRepositoryPgSql";
import FoldersFilter from "./domain/folders/FoldersFilter";

const repo = new FoldersRepositoryPgSql();

const main = async () => {
	const items = await repo.find(FoldersFilter.create());

	let writeStream = fs.createWriteStream('./dist/folders-dump.json')

	items.forEach((item, index) => {
		const result = {
			"Item": {
				...(item.id ? {
					"id": {"N": String(item.id)},
				} : {}),
				...(item.name ? {
					"name": {"S": String(item.name)},
				} : {}),
				...(item.parentId ? {
					"parentId": {"N": String(item.parentId)},
				} : {}),
				...(item.userId ? {
					"userId": {"N": String(item.userId)},
				} : {})
			}
		};

		writeStream.write(JSON.stringify(result) + '\n', () => {})
	})

	writeStream.end();

	writeStream.on('finish', () => {
		console.log('finish write stream, moving along')
	}).on('error', (err) => {
		console.log(err)
	})
}

main();

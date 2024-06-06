import fs from 'fs';
import CardRepositoryPgSql from "./database/pgsql/cards/CardRepositoryPgSql";
import CardFilter from "./domain/cards/CardFilter";

const repo = new CardRepositoryPgSql();

const main = async () => {
	const items = await repo.find(CardFilter.create());

	let writeStream = fs.createWriteStream('./dist/cards-dump.json')


	items.forEach((item, index) => {
		const result = {
			"Item": {
				...(item.id ? {
					"id": {"N": String(item.id)},
				} : {}),
				"bookmarked": {"N": String(item.bookmarked ? 1 : 0)},
				...(item.folderId ? {
					"folderId": {"N": String(item.folderId)},
				} : {}),
				...(item.userId ? {
					"userId": {"N": String(item.userId)},
				} : {}),
				...(item.frontSide ? {
					"frontSide": {"S": String(item.frontSide)},
				} : {}),
				...(item.backSide ? {
					"backSide": {"S": String(item.backSide)},
				} : {}),
				"difficult": {"N": String(item.difficult?.valueOf() || 0)},
				...(item.difficultChangeTime ? {
					"difficultChangeTime": {"N": String(item.difficultChangeTime?.getTime() || new Date().getTime())},
				} : {}),
				...(item.createdAt ? {
					"createdAt": {"N": String(item.createdAt?.getTime() || new Date().getTime())},
				} : {}),
			}
		};

		writeStream.write(JSON.stringify(result) + '\n', () => {});
	});

	writeStream.end();

	writeStream.on('finish', () => {
		console.log('finish write stream, moving along')
	}).on('error', (err) => {
		console.log(err)
	})
}

main();

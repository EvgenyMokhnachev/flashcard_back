import UserRepositoryPgSql from "./database/pgsql/user/UserRepositoryPgSql";
import UserFilter from "./domain/user/UserFilter";
import fs from 'fs';

const usersRepo = new UserRepositoryPgSql();

const main = async () => {
	const allUsers = await usersRepo.find(UserFilter.create());

	let writeStream = fs.createWriteStream('./dist/users-dump.csv')

	writeStream.write('id|email|pass' + '\n', () => {
		console.log(`headers: id,email,pass`);
	});

	allUsers.forEach((user, index) => {
		let newLine = []
		newLine.push(user.id || '');
		newLine.push(user.email || '');
		newLine.push(user.pass || '');

		const lineStr = newLine.join('|');

		writeStream.write(lineStr + '\n', () => {
			console.log(`new line: ${lineStr}`);
		})
	})

	writeStream.end();

	writeStream.on('finish', () => {
		console.log('finish write stream, moving along')
	}).on('error', (err) => {
		console.log(err)
	})
}

main();

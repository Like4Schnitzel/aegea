# aegea
A discord bot that sends random safebooru posts in specified intervals. It will never send the same post twice.

## Usage
1. Invite the bot to your server: https://discord.com/oauth2/authorize?client_id=1499545551291810025
2. Create a job with /createjob. (Example: `/createjob taglist: yuri intervalhours: 1` will send a random post with the `yuri` tag once every hour.)

[TODO] You can also specify intervals using cron, but you can't mix this option with the unit intervals.

Jobs can be deleted using /deletejob, you can get the ID of the job you want to delete using /listjob. If you want to stop a job without deleting its history of already-sent posts, use /pausejob. You can start it again using /resumejob.

## Self-Hosting instructions
You'll need to set up a discord bot in the [developer portal](https://discord.com/developers/home) so that you have the tokens to enter into .env. There's plenty of tutorials on how to do that out there, I'm sure you'll be fine.
```sh
git clone https://github.com/like4schnitzel/aegea
cd aegea
cp .example.env .env
nano .env
npm install
npm run deploy
npm run push-db
npm run main
```

### Database Migrations
Migrations should work by just running `npm run push-db`. In the case where that would result in data loss, there is an sql file in the `migrations/` folder. Run the file for whichever migration you need using `sqlite3 local.db "$(cat migrations/n-migration-file.sql)"`, then try `npm run push-db` again.

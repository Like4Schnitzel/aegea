import { CommandInteraction, MessageFlagsBitField, SlashCommandBuilder } from "discord.js";
import { jobTable } from "../lib/schema";
import { db } from "../lib/env";
import { IntervalTypes } from "../lib/intervals";
import { createJobTask } from "../lib/jobStore";

const data = new SlashCommandBuilder()
    .setName('createjob')
    .setDescription('Create a job to periodically post images in THIS channel.')
    .setDefaultMemberPermissions(1 << 5)
    .addStringOption(option => 
        option.setName('taglist')
            .setDescription('Safebooru tags to search by')
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('message')
            .setDescription('Custom message to be sent with each post')
    )
    .addIntegerOption(option =>
        option.setName('intervalseconds')
            .setDescription('Number of seconds between posts')
    )
    .addIntegerOption(option =>
        option.setName('intervalminutes')
            .setDescription('Number of minutes between posts')
    )
    .addIntegerOption(option =>
        option.setName('intervalhours')
            .setDescription('Number of hours between posts')
    )
    .addIntegerOption(option =>
        option.setName('intervaldays')
            .setDescription('Number of days between posts')
    )
    .addIntegerOption(option =>
        option.setName('initialdelay')
            .setDescription('Number of seconds to wait before the first post should be sent')
    )
    .addStringOption(option =>
        option.setName('cron')
            .setDescription('Alternative interval specifier using cron syntax')
    );

export default {
    data,
    async execute(interaction: CommandInteraction) {
        const optionsInteraction = interaction as any;
        const intervalSeconds = optionsInteraction.options.getInteger('intervalseconds') ?? 0;
        const intervalMinutes = optionsInteraction.options.getInteger('intervalminutes') ?? 0;
        const intervalHours = optionsInteraction.options.getInteger('intervalhours') ?? 0;
        const intervalDays = optionsInteraction.options.getInteger('intervaldays') ?? 0;
        const cron = optionsInteraction.options.getString('cron') ?? 0;

        const secondsDelay = intervalSeconds +
        intervalMinutes * 60 +
        intervalHours * 60 * 60 +
        intervalDays * 60 * 60 * 24;

        if (cron && secondsDelay) {
            return interaction.reply({
                content: "Error: You can't supply both a cron interval and a unit interval.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }
        if (!cron && !secondsDelay) {
            return interaction.reply({
                content: "Error: You must supply either a cron interval or a unit interval.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const taglist = optionsInteraction.options.getString('taglist');
        const message = optionsInteraction.options.getString('message');

        try {
            const intervalType = secondsDelay ? IntervalTypes.seconds : IntervalTypes.cron;
            
            const dbEntry: typeof jobTable.$inferInsert = {
                guildId: interaction.guildId!,
                channelId: interaction.channelId,
                userId: interaction.user.id,
                tagList: taglist,
                intervalType: intervalType,
                timestamp: Date.now(),
                message: message ?? ""
            };

            if (intervalType == IntervalTypes.seconds) {
                dbEntry.intervalSeconds = secondsDelay;
            } else {
                dbEntry.intervalCron = cron;
            }

            const job = await db.insert(jobTable).values(dbEntry).returning();
            createJobTask(interaction.client, job[0]);

            interaction.reply({
                content: `Successfully created job! Will send random \`${taglist}\` post every ${secondsDelay} seconds`,
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        } catch(e: any) {
            if (e instanceof Error) {
                console.error(e);
                interaction.reply({
                    content: `Error: ${e.message}`,
                    flags: MessageFlagsBitField.Flags.Ephemeral
                });
            }
        }
    }
}

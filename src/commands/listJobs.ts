import { ChatInputCommandInteraction, MessageFlagsBitField, SlashCommandBuilder } from "discord.js";
import { findJobsByChannel, findJobsByServer } from "../lib/dbScripts";
import { Job } from "../lib/jobStore";
import { IntervalTypes } from "../lib/intervals";

const data = new SlashCommandBuilder()
    .setName('listjobs')
    .setDescription('List all jobs.')
    .setDefaultMemberPermissions(1 << 5)
    .addBooleanOption(option =>
        option.setName("global")
            .setDescription("List all jobs in the server instead of just the channel?")
    );

export default {
    data,
    async execute(interaction: ChatInputCommandInteraction) {
        const global = interaction.options.getBoolean('global') ?? false;
        let jobs: Job[];
        if (global) {
            const guildId = interaction.guildId;
            if (!guildId) {
                return interaction.reply("You can only list all jobs in the server if you're using the command in a server :p")
            }
            jobs = await findJobsByServer(guildId);
        } else {
            jobs = await findJobsByChannel(interaction.channelId);
        }

        const jobsString = jobs?.map(j => {
            let string = "";
            string += `ID: ${j.id}; `
            string += `Tags: \`${j.tagList}\`; `
            string += `Interval: ${j.intervalSeconds || j.intervalCron}${j.intervalType === IntervalTypes.seconds ? 's' : ''}; `
            string += `Created by: <@${j.userId}>; `
            if (global) {
                string += `Channel: <#${j.channelId}>;`
            }
            return string;
        }).reduce((a, b) => a + b + "\n", "");

        return interaction.reply({
            content: jobsString,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
    }
}

import { ChatInputCommandInteraction, MessageFlagsBitField, SlashCommandBuilder } from "discord.js";
import { ADMIN_PERMISSION_BIT } from "../lib/consts";
import { findJobById } from "../lib/dbScripts";
import { db } from "../lib/env";
import { jobTable } from "../lib/schema";
import { eq } from "drizzle-orm";
import { jobToString } from "../lib/jobStore";

const data = new SlashCommandBuilder()
    .setName('pausejob')
    .setDescription('Pause a job.')
    .setDefaultMemberPermissions(1 << ADMIN_PERMISSION_BIT)
    .addIntegerOption(option =>
        option.setName("id")
            .setDescription("ID of the job you want to pause.")
            .setRequired(true)
    );

export default {
    data,
    async execute(interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getInteger('id')!;
        const job = await findJobById(id);

        if (job?.guildId !== interaction.guildId) {
            return interaction.reply({
                content: `Couldn't find job with ID ${id}.`,
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        const updatedJob = (await db.update(jobTable).set({ paused: true }).where(eq(jobTable.id, id)).returning()).at(0);
        if (!updatedJob) {
            return interaction.reply({
                content: "Something went wrong.",
                flags: MessageFlagsBitField.Flags.Ephemeral
            });
        }

        return interaction.reply({
            content: `Successfully updated job: ${jobToString(updatedJob, false)}`,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
    }
};

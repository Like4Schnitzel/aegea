import { Client, SendableChannels } from "discord.js";
import { getRandomPost } from "./safebooruApi";
import { Job } from "./jobStore";

export async function sendPost(client: Client<true>, job: Job) {
    const channel = await client.channels.fetch(job.channelId);
    if (channel?.isSendable()) {
        const sendableChannel = channel as SendableChannels;

        const postId = 6893136;
        const attachment = await getRandomPost(job.tagList);
        if (!attachment) {
            throw Error(`Failed to get post ${postId}.`);
        }

        return sendableChannel.send({
            content: `${job.message}\n[source](${attachment})`
        });
    }
}

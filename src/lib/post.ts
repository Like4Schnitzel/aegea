import { Client, SendableChannels } from "discord.js";
import { getPost, getRandomPost } from "./safebooruApi";
import { Job } from "./jobStore";

export async function sendPost(client: Client<true>, job: Job) {
    const channel = await client.channels.fetch(job.channelId);
    if (channel?.isSendable()) {
        const sendableChannel = channel as SendableChannels;

        const postId = 6893136;
        const attachment = await getRandomPost(job.tags);
        if (!attachment) {
            throw Error(`Failed to get post ${postId}.`);
        }

        sendableChannel.send({
            files: [{
                attachment,
                name: "file.png"
            }],
            content: job.message
        });
    }
}

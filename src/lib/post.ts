import { Client, SendableChannels } from "discord.js";
import { getPost, getRandomPost } from "./safebooruApi";

export async function sendPost(client: Client<true>, channelId: string, tags: string) {
    const channel = await client.channels.fetch(channelId);
    if (channel?.isSendable()) {
        const sendableChannel = channel as SendableChannels;

        const postId = 6893136;
        const attachment = await getRandomPost(tags);
        if (!attachment) {
            throw Error(`Failed to get post ${postId}.`);
        }

        sendableChannel.send({
            files: [{
                attachment,
                name: "file.png"
            }],
            content: "Test :3"
        });
    }
}

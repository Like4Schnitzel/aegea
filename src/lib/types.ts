export type Post = {
    fileUrl: string,
    postUrl: string,
    source: string | null,
    postId: number
}

export type SafebooruApiPost = {
    "preview_url": string,
    "sample_url": string,
    "file_url": string,
    "directory": number,
    "hash": string,
    "width": number,
    "height": number,
    "id": number,
    "image": string,
    "change": number,
    "owner": string,
    "parent_id": number,
    "rating": string,
    "sample": true,
    "sample_height": number,
    "sample_width": number,
    "score": number,
    "tags": string,
    "source": string,
    "status": string,
    "has_notes": false,
    "comment_count": number
}

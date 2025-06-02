import fs from 'fs';
import { Dropbox } from 'dropbox';
import dotenv from 'dotenv'

dotenv.config()


const dropbox = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN!,
})

export async function uploadToDropbox(filePath: string, fileName: string): Promise<string> {
    try {

        const fileContent = fs.readFileSync(filePath);

        const dropboxPath = `/libros/${fileName}`;


        const response = await dropbox.filesUpload({
            path: dropboxPath,
            contents: fileContent,
            mode: { '.tag': 'overwrite' }
        });

        const sharedLink = await dropbox.sharingCreateSharedLinkWithSettings({
            path: response.result.path_lower!,
        });

        const originalUrl = sharedLink.result.url;

        const directUrl = originalUrl.replace('www.dropbox.com', 'www.dl.dropboxusercontent.com').replace('&dl=0', '&raw=1')

        const previewUrl = `https://docs.google.com/viewer?url=${directUrl}&embedded=true`


        return previewUrl;
    } catch (error: any) {
        console.error('Error al subir a Dropbox:', error);
        throw new Error('Error al subir archivo a Dropbox');
    }
}

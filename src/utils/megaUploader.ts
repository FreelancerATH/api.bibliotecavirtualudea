import fs from 'fs';
import path from 'path';
import { Storage, File } from 'megajs';

export async function uploadToMega(filePath: string, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileStats = fs.statSync(filePath)
        const storage = new Storage({
            email: process.env.MEGA_EMAIL!,
            password: process.env.MEGA_PASSWORD!,
        });

        storage.once('ready', () => {
            // Buscar carpeta "libros" o crearla
            const folder = storage.root.children?.find(child => child.name === 'libros' && child.directory);

            const uploadToFolder = (target: typeof storage.root) => {
                const upload = target.upload({
                    name: fileName,
                    size: fileStats.size
                });
                fs.createReadStream(filePath).pipe(upload);

                upload.on('complete', (file: File) => {
                    file.link({})
                        .then((url: string) => {
                            resolve(url);
                        })
                        .catch((err: any) => {
                            reject(err);
                        });
                });


                upload.on('error', reject);
            };

            if (folder) {
                uploadToFolder(folder);
            } else {
                // Crear carpeta "libros" si no existe
                storage.root.mkdir('libros', (err, newFolder) => {
                    if (err || !newFolder) return reject(err || new Error('No se pudo crear carpeta MEGA'));
                    uploadToFolder(newFolder);
                });
            }
        });

        (storage as any).on('error', reject);
    });
}


import { GameState, DriveFile } from '../types';
import { APP_DRIVE_FOLDER_NAME, APP_DRIVE_FOLDER_MIME_TYPE, SAVE_FILE_MIME_TYPE } from '../constants';

interface GapiFileResource {
    id?: string;
    name?: string;
    mimeType?: string;
    parents?: string[];
    modifiedTime?: string;
    size?: string; // Drive API returns size as string
}

const DRIVE_FIELDS = "files(id, name, mimeType, modifiedTime, size)";

let appFolderIdCache: string | null = null;

async function ensureGapiClientDriveLoaded(accessToken: string): Promise<void> {
    if (!window.gapi || !window.gapi.client) {
        throw new Error("Google API client (gapi.client) not loaded.");
    }
    if (window.gapi.client.drive) { // Already loaded
      window.gapi.client.setToken({ access_token: accessToken });
      return;
    }
    
    return new Promise((resolve, reject) => {
        window.gapi.client.load('drive', 'v3')
            .then(() => {
                window.gapi.client.setToken({ access_token: accessToken });
                resolve();
            })
            .catch((err: any) => {
                console.error("Error loading Google Drive client:", err);
                reject(new Error("Không thể tải Google Drive client."));
            });
    });
}

export async function findOrCreateAppFolder(accessToken: string): Promise<string> {
    if (appFolderIdCache) return appFolderIdCache;
    await ensureGapiClientDriveLoaded(accessToken);

    try {
        const response = await window.gapi.client.drive.files.list({
            q: `mimeType='${APP_DRIVE_FOLDER_MIME_TYPE}' and name='${APP_DRIVE_FOLDER_NAME}' and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive',
        });

        if (response.result.files && response.result.files.length > 0) {
            appFolderIdCache = response.result.files[0].id!;
            return appFolderIdCache!;
        } else {
            const fileMetadata = {
                name: APP_DRIVE_FOLDER_NAME,
                mimeType: APP_DRIVE_FOLDER_MIME_TYPE,
            };
            const createResponse = await window.gapi.client.drive.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
            appFolderIdCache = createResponse.result.id!;
            return appFolderIdCache!;
        }
    } catch (error) {
        console.error("Error finding or creating app folder:", error);
        throw new Error("Không thể truy cập hoặc tạo thư mục ứng dụng trên Google Drive.");
    }
}

export async function listSaveFiles(accessToken: string, folderId: string): Promise<DriveFile[]> {
    await ensureGapiClientDriveLoaded(accessToken);
    try {
        const response = await window.gapi.client.drive.files.list({
            q: `'${folderId}' in parents and mimeType='${SAVE_FILE_MIME_TYPE}' and trashed=false`,
            fields: DRIVE_FIELDS,
            orderBy: 'modifiedTime desc',
            pageSize: 100, // Adjust as needed
        });
        
        return (response.result.files || []).map((file: GapiFileResource) => ({
            id: file.id!,
            name: file.name!,
            modifiedTime: file.modifiedTime!,
            size: file.size
        }));
    } catch (error) {
        console.error("Error listing save files:", error);
        throw new Error("Không thể liệt kê các file đã lưu từ Google Drive.");
    }
}

export async function saveGameToDrive(
    accessToken: string,
    folderId: string,
    gameState: GameState,
    fileName: string, // User-defined file name, e.g., "My Epic Adventure.json"
    existingFileId?: string // Optional: if overwriting an existing file
): Promise<DriveFile> {
    await ensureGapiClientDriveLoaded(accessToken);
    const metadata: GapiFileResource = {
        name: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
        mimeType: SAVE_FILE_MIME_TYPE,
    };
    if (!existingFileId) { // Only add parents if creating a new file
        metadata.parents = [folderId];
    }
    
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const close_delim = `\r\n--${boundary}--`;

    const gameContentString = JSON.stringify(gameState);
    
    const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${SAVE_FILE_MIME_TYPE}\r\n\r\n` +
        gameContentString +
        close_delim;

    const requestPath = existingFileId 
        ? `/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=${DRIVE_FIELDS}`
        : `/upload/drive/v3/files?uploadType=multipart&fields=${DRIVE_FIELDS}`;
    
    const method = existingFileId ? 'PATCH' : 'POST';

    try {
        const response = await window.gapi.client.request({
            path: requestPath,
            method: method,
            headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
            body: multipartRequestBody,
        });
        const savedFile = response.result as GapiFileResource;
        return {
            id: savedFile.id!,
            name: savedFile.name!,
            modifiedTime: savedFile.modifiedTime!,
            size: savedFile.size,
        };
    } catch (error) {
        console.error("Error saving game to Drive:", error);
        throw new Error("Không thể lưu game lên Google Drive.");
    }
}

export async function loadGameFromDrive(accessToken: string, fileId: string): Promise<GameState> {
    await ensureGapiClientDriveLoaded(accessToken);
    try {
        const response = await window.gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media',
        });
        if (typeof response.body === 'string') {
            return JSON.parse(response.body) as GameState;
        } else {
             // For non-string bodies, it might be an object already if not stringified by client lib.
             // This branch might not be hit if gapi client always returns string for 'media'.
            return response.result as GameState;
        }
    } catch (error) {
        console.error("Error loading game from Drive:", error);
        throw new Error("Không thể tải game từ Google Drive.");
    }
}

export async function deleteFileFromDrive(accessToken: string, fileId: string): Promise<void> {
    await ensureGapiClientDriveLoaded(accessToken);
    try {
        await window.gapi.client.drive.files.delete({
            fileId: fileId,
        });
    } catch (error) {
        console.error("Error deleting file from Drive:", error);
        throw new Error("Không thể xóa file từ Google Drive.");
    }
}

// Call this to reset cached folder ID on sign out
export function resetDriveCache(): void {
    appFolderIdCache = null;
}


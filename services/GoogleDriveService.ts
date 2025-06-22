import { DRIVE_APP_FOLDER_NAME } from '../constants';

declare global {
  interface Window {
    gapi: any;
  }
}

export const loadDriveApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.gapi && window.gapi.client && window.gapi.client.drive) {
      resolve(); // Already loaded
      return;
    }
    window.gapi.client.load('drive', 'v3', () => {
      if (window.gapi.client.drive) {
        resolve();
      } else {
        reject(new Error("Failed to load Google Drive API v3."));
      }
    });
  });
};

export const getOrCreateAppFolderId = async (): Promise<string | null> => {
  if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
    console.error("Google Drive API client is not loaded.");
    return null;
  }

  try {
    // Check if folder exists
    const response = await window.gapi.client.drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${DRIVE_APP_FOLDER_NAME}' and 'root' in parents and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id; // Folder exists
    } else {
      // Create folder
      const fileMetadata = {
        name: DRIVE_APP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['root'],
      };
      const createResponse = await window.gapi.client.drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      return createResponse.result.id;
    }
  } catch (error) {
    console.error('Error finding or creating app folder in Drive:', error);
    const gapiError = error as any;
    if (gapiError.result && gapiError.result.error) {
        console.error('Drive API Error Details:', gapiError.result.error);
         throw new Error(`Drive API: ${gapiError.result.error.message} (Code: ${gapiError.result.error.code})`);
    }
    throw error; // Re-throw if it's not a standard GAPI error structure
  }
};

export const uploadGameFileToDrive = async (
  fileName: string,
  fileContent: string, // JSON string
  folderId: string
): Promise<any> => {
  if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
    throw new Error("Google Drive API client is not loaded.");
  }
  if (!folderId) {
    throw new Error("Google Drive Folder ID is missing for upload.");
  }
  
  const metadata = {
    name: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
    mimeType: 'application/json',
    parents: [folderId],
  };

  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' + // Assuming fileContent is JSON string
      fileContent +
      close_delim;
  
  try {
    const response = await window.gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
            'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
    });
    return response.result; // Contains file ID and other details
  } catch (error) {
     console.error('Error uploading file to Drive:', error);
     const gapiError = error as any;
    if (gapiError.result && gapiError.result.error) {
        console.error('Drive API Upload Error Details:', gapiError.result.error);
        throw new Error(`Drive Upload API: ${gapiError.result.error.message} (Code: ${gapiError.result.error.code})`);
    }
    throw error;
  }
};

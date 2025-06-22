
import { GameState, GoogleTokenResponse, GoogleUserProfile } from '../types';
import { GOOGLE_CLIENT_ID, GOOGLE_DRIVE_SCOPES, DRIVE_DISCOVERY_DOCS, GAME_DRIVE_FOLDER_NAME } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let gapiInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let googleIdentityClient: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tokenClient: any = null;

let gapiLoadedPromise: Promise<void> | null = null;
let gisLoadedPromise: Promise<void> | null = null;

const loadGapiScript = () => {
  if (!gapiLoadedPromise) {
    gapiLoadedPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        gapiInstance = window.gapi;
        gapiInstance.load('client', resolve);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return gapiLoadedPromise;
};

const loadGisScript = () => {
  if (!gisLoadedPromise) {
    gisLoadedPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleIdentityClient = window.google;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return gisLoadedPromise;
};


export const initGoogleClient = async (): Promise<void> => {
  try {
    await loadGapiScript();
    await loadGisScript();

    if (!gapiInstance || !googleIdentityClient) {
        throw new Error("Google API or Identity Services client not loaded.");
    }
    
    await new Promise<void>((resolve, reject) => {
         // Initialize the GAPI client for Drive API
        gapiInstance.client.init({
          // API key is not needed for OAuth2 protected APIs like Drive if discovery docs are correctly loaded and token is set.
          // If discovery docs fail to load, an API_KEY might be required in Google Cloud Console for the project.
          // For this app, as we are calling user-specific data, OAuth token is the primary auth mechanism.
          discoveryDocs: DRIVE_DISCOVERY_DOCS,
        }).then(() => {
            gapiInstance.client.load('drive', 'v3', resolve);
        }).catch(reject);
    });
    
    tokenClient = googleIdentityClient.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_DRIVE_SCOPES,
      callback: '', // Callback will be handled by the promise in requestAccessToken
    });

  } catch (error) {
    console.error('Error initializing Google clients:', error);
    throw error;
  }
};


export const requestAccessToken = (): Promise<GoogleTokenResponse> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Google Token Client not initialized.'));
      return;
    }
    tokenClient.callback = (tokenResponse: GoogleTokenResponse) => {
      if (tokenResponse.error) {
        reject(new Error(`Google Auth Error: ${tokenResponse.error} - ${tokenResponse.error_description}`));
      } else {
        gapiInstance.client.setToken({ access_token: tokenResponse.access_token });
        resolve(tokenResponse);
      }
    };
    tokenClient.requestAccessToken({ prompt: 'consent' }); // Use 'consent' to ensure user sees permissions dialog
  });
};

export const fetchUserProfile = async (): Promise<GoogleUserProfile | null> => {
  try {
    const response = await gapiInstance.client.request({
      path: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
    const profile = response.result;
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      givenName: profile.given_name,
      familyName: profile.family_name,
      picture: profile.picture,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const signOutGoogle = () => {
  const token = gapiInstance.client.getToken();
  if (token) {
    googleIdentityClient.accounts.oauth2.revoke(token.access_token, () => {
      console.log('Google access token revoked.');
    });
    gapiInstance.client.setToken(null);
  }
  if (googleIdentityClient && googleIdentityClient.accounts && googleIdentityClient.accounts.id) {
    googleIdentityClient.accounts.id.disableAutoSelect();
  }
};

const findOrCreateFolder = async (): Promise<string | null> => {
  try {
    // Check if folder exists
    const response = await gapiInstance.client.drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${GAME_DRIVE_FOLDER_NAME}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id; // Folder exists
    } else {
      // Create folder
      const fileMetadata = {
        name: GAME_DRIVE_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      };
      const createResponse = await gapiInstance.client.drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      return createResponse.result.id;
    }
  } catch (error) {
    console.error('Error finding or creating Drive folder:', error);
    return null;
  }
};

export const uploadGameToDrive = async (gameState: GameState, fileName: string): Promise<{id: string, name: string} | null> => {
  if (!gapiInstance || !gapiInstance.client.getToken()) {
    throw new Error('Google API not initialized or user not signed in.');
  }

  const folderId = await findOrCreateFolder();
  if (!folderId) {
    throw new Error('Could not find or create game save folder on Google Drive.');
  }

  const fileContent = JSON.stringify(gameState, null, 2);
  const blob = new Blob([fileContent], { type: 'application/json' });
  
  const metadata = {
    name: `${fileName}.json`,
    mimeType: 'application/json',
    parents: [folderId],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  try {
    const response = await gapiInstance.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      body: form,
    });
    return { id: response.result.id, name: response.result.name };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

// Helper to check if gapi is loaded (for components)
export const isGapiLoaded = () => !!gapiInstance && !!gapiInstance.client;
export const isGisLoaded = () => !!googleIdentityClient;

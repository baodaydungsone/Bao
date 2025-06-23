
import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { GameState, AutosavedGameInfo, DriveFile } from '../../types';
import { usePublicToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext'; // Corrected import
import { LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX } from '../../constants';
import * as GoogleDriveService from '../../services/GoogleDriveService';

interface LoadStoryModalProps {
  isOpen: boolean; 
  onClose: () => void;
  onLoadStoryFromFile: (gameState: GameState) => void;
  onLoadStoryFromSlot: (slotKey: string) => void;
  onLoadStoryFromDrive: (gameState: GameState) => void;
}

interface ExistingSlotInfo {
  key: string;
  displayName: string;
  savedAt: string;
}

const getAvailableLoadSlots = (): ExistingSlotInfo[] => {
  const slots: ExistingSlotInfo[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX)) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed: AutosavedGameInfo = JSON.parse(item);
          if (parsed.gameState && parsed.savedAt) {
            const slotNamePart = key.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length);
            slots.push({
              key: key,
              displayName: parsed.gameState.setup?.name || slotNamePart.replace(/_/g, ' '),
              savedAt: parsed.savedAt,
            });
          }
        }
      } catch (e) {
        console.warn(`Could not parse autosave slot ${key}:`, e);
      }
    }
  }
  return slots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
};


const LoadStoryModal: React.FC<LoadStoryModalProps> = ({ isOpen, onClose, onLoadStoryFromFile, onLoadStoryFromSlot, onLoadStoryFromDrive }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [existingSlots, setExistingSlots] = useState<ExistingSlotInfo[]>([]);
  const { addToast } = usePublicToast();
  const { isGoogleLoggedIn, accessToken, requestDriveScopes, isGapiLoaded, driveContext, setDriveContext } = useAuth();
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  // const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null); // Use driveContext.appFolderId

  const refreshSlots = useCallback(() => {
    setExistingSlots(getAvailableLoadSlots());
  }, []);

  const fetchDriveFiles = useCallback(async () => {
    if (!isGoogleLoggedIn || !accessToken || !isGapiLoaded) {
      if(isGoogleLoggedIn && isGapiLoaded && !accessToken) { // Logged in but no token for Drive
        addToast({message: "Cần cấp quyền truy cập Google Drive để tải game từ Drive.", type: 'warning'});
      }
      return;
    }
    setIsLoadingDrive(true);
    try {
      let folderId = driveContext.appFolderId;
      if (!folderId) {
        folderId = await GoogleDriveService.findOrCreateAppFolder(accessToken);
        setDriveContext(prev => ({ ...prev, appFolderId: folderId }));
      }
      const files = await GoogleDriveService.listSaveFiles(accessToken, folderId);
      setDriveFiles(files);
      if (files.length === 0) {
        addToast({ message: "Không tìm thấy file lưu nào trên Google Drive.", type: 'info', duration: 3000 });
      }
    } catch (error: any) {
      addToast({ message: `Lỗi khi tải danh sách từ Drive: ${error.message}`, type: 'error' });
      if (error.message.toLowerCase().includes("token") || error.message.toLowerCase().includes("auth")) {
        await requestDriveScopes(); // Try to re-request scopes
      }
    } finally {
      setIsLoadingDrive(false);
    }
  }, [isGoogleLoggedIn, accessToken, addToast, driveContext.appFolderId, setDriveContext, isGapiLoaded, requestDriveScopes]);


  useEffect(() => {
    if (isOpen) {
        refreshSlots();
        if (isGoogleLoggedIn && isGapiLoaded) {
            fetchDriveFiles();
        } else {
            setDriveFiles([]); // Clear drive files if not logged in or gapi not ready
        }
    }
  }, [isOpen, refreshSlots, isGoogleLoggedIn, fetchDriveFiles, isGapiLoaded]); 

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/json") {
        setSelectedFile(file);
      } else {
        addToast({ message: "Vui lòng chọn một file .json hợp lệ.", type: 'error' });
        setSelectedFile(null);
        event.target.value = ""; 
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleLoadFromFileSubmit = () => {
    if (!selectedFile) {
      addToast({ message: "Vui lòng chọn một file để tải.", type: 'warning' });
      return;
    }
    setIsLoadingFile(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const parsedGameState: GameState = JSON.parse(text);
          if (parsedGameState && parsedGameState.setup && parsedGameState.storyLog) {
            onLoadStoryFromFile(parsedGameState);
          } else {
            throw new Error("Cấu trúc file save không hợp lệ.");
          }
        } else {
          throw new Error("Không thể đọc nội dung file.");
        }
      } catch (error) {
        console.error("Error loading or parsing game file:", error);
        addToast({ message: `Lỗi khi tải file: ${error instanceof Error ? error.message : "Nội dung file không hợp lệ."}`, type: 'error', duration: 7000 });
      } finally {
        setIsLoadingFile(false);
      }
    };
    reader.onerror = () => {
      addToast({ message: "Lỗi khi đọc file.", type: 'error' });
      setIsLoadingFile(false);
    }
    reader.readAsText(selectedFile);
  };
  
  const handleDeleteLocalSlot = (slotKey: string, displayName: string) => {
    localStorage.removeItem(slotKey);
    refreshSlots();
    addToast({message: `Đã xóa slot lưu trữ: "${displayName}"`, type: 'info', icon: 'fas fa-trash-alt'});
  };

  const handleLoadFromDrive = async (fileId: string, fileName: string) => {
    if (!isGoogleLoggedIn || !accessToken || !isGapiLoaded) {
        addToast({message: "Vui lòng đăng nhập Google và cấp quyền Drive.", type: 'error'});
        return;
    }
    setIsLoadingDrive(true);
    try {
        const gameState = await GoogleDriveService.loadGameFromDrive(accessToken, fileId);
        onLoadStoryFromDrive(gameState);
        addToast({message: `Đã tải game "${fileName}" từ Google Drive.`, type: 'success'});
    } catch (error: any) {
        addToast({message: `Lỗi khi tải game từ Drive: ${error.message}`, type: 'error'});
    } finally {
        setIsLoadingDrive(false);
    }
  };

  const handleDeleteFromDrive = async (fileId: string, fileName: string) => {
    if (!isGoogleLoggedIn || !accessToken || !isGapiLoaded) {
        addToast({message: "Vui lòng đăng nhập Google và cấp quyền Drive.", type: 'error'});
        return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn file "${fileName}" từ Google Drive không? Hành động này không thể hoàn tác.`)) {
        setIsLoadingDrive(true);
        try {
            await GoogleDriveService.deleteFileFromDrive(accessToken, fileId);
            addToast({message: `Đã xóa file "${fileName}" khỏi Google Drive.`, type: 'success'});
            fetchDriveFiles(); // Refresh list
        } catch (error: any) {
            addToast({message: `Lỗi khi xóa file từ Drive: ${error.message}`, type: 'error'});
        } finally {
            setIsLoadingDrive(false);
        }
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tải Game Đã Lưu" size="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Local Saves Section */}
        <div className="p-4 border rounded-lg bg-primary/5 dark:bg-primary-dark/10 border-primary/30 dark:border-primary-dark/40">
          <h3 className="text-lg font-semibold text-primary dark:text-primary-light mb-2 flex items-center">
            <i className="fas fa-hdd mr-2"></i>Tải Từ Slot Trình Duyệt
          </h3>
          {existingSlots.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {existingSlots.map(slot => (
                <div key={slot.key} className="p-3 border rounded-md bg-white dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong className="block text-sm text-slate-800 dark:text-slate-100">{slot.displayName}</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Lưu lúc: {new Date(slot.savedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <div className='flex gap-2 mt-2 sm:mt-0'>
                    <Button onClick={() => {onLoadStoryFromSlot(slot.key);}} variant="primary" size="xs" className="!px-2.5 !py-1" leftIcon={<i className="fas fa-play-circle"></i>}>
                      Tải
                    </Button>
                     <Button onClick={() => handleDeleteLocalSlot(slot.key, slot.displayName)} variant="danger" size="xs" className="!px-2 !py-1" title={`Xóa slot: ${slot.displayName}`}>
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Không tìm thấy slot nào được lưu trong trình duyệt.</p>
          )}
          <hr className="border-border-light dark:border-border-dark my-4" />
          <div>
            <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2 flex items-center">
                <i className="fas fa-file-upload mr-2"></i>Hoặc Tải Game Từ File JSON
            </h3>
            <div>
                <input id="file-upload-load" type="file" accept=".json" onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light/20 file:text-primary dark:file:bg-primary-dark/30 dark:file:text-primary-light hover:file:bg-primary-light/30 dark:hover:file:bg-primary-dark/40 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary-dark"/>
            </div>
            {selectedFile && <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5">Đã chọn: <span className="font-medium">{selectedFile.name}</span></p>}
            <Button onClick={handleLoadFromFileSubmit} disabled={!selectedFile || isLoadingFile} isLoading={isLoadingFile} className="mt-3 w-full sm:w-auto" variant="outline" leftIcon={<i className="fas fa-upload"></i>}>
                {isLoadingFile ? "Đang Tải..." : "Tải Từ File"}
            </Button>
          </div>
        </div>

        {/* Google Drive Saves Section */}
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-800/60 border-blue-200 dark:border-blue-700/60">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2 flex items-center">
            <i className="fab fa-google-drive mr-2"></i>Tải Từ Google Drive
          </h3>
          {!isGoogleLoggedIn ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Vui lòng đăng nhập Google để tải game từ Drive.</p>
          ) : isLoadingDrive ? (
             <div className="flex items-center justify-center py-4"><svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang tải danh sách...</div>
          ) : driveFiles.length > 0 ? (
            <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {driveFiles.map(file => (
                <div key={file.id} className="p-3 border rounded-md bg-white dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong className="block text-sm text-slate-800 dark:text-slate-100">{file.name}</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Lưu lúc: {new Date(file.modifiedTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {file.size && <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({(parseInt(file.size) / 1024).toFixed(1)} KB)</span>}
                  </div>
                  <div className='flex gap-2 mt-2 sm:mt-0'>
                    <Button onClick={() => handleLoadFromDrive(file.id, file.name)} variant="primary" size="xs" className="!px-2.5 !py-1 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600" leftIcon={<i className="fas fa-cloud-download-alt"></i>}>
                      Tải
                    </Button>
                    <Button onClick={() => handleDeleteFromDrive(file.id, file.name)} variant="danger" size="xs" className="!px-2 !py-1" title={`Xóa file: ${file.name} khỏi Drive`}>
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-2">Không tìm thấy file lưu nào trên Google Drive hoặc chưa cấp quyền.</p>
                <Button onClick={fetchDriveFiles} variant="ghost" size="sm" isLoading={isLoadingDrive} disabled={!isGapiLoaded}>
                    <i className="fas fa-sync-alt mr-1"></i> Thử Lại / Xin Quyền
                </Button>
             </div>
          )}
        </div>
      </div>


      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={onClose} disabled={isLoadingFile || isLoadingDrive} size="lg">
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default LoadStoryModal;
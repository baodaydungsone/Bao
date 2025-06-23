
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { GameState, AutosavedGameInfo, DriveFile } from '../../types';
import { LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX } from '../../constants';
import { usePublicToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext'; // Corrected import
import * as GoogleDriveService from '../../services/GoogleDriveService';


interface SaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState | null;
  onSaveToJsonFile: (gameState: GameState) => void;
  onSaveToLocalStorageSlot: (gameState: GameState, slotName: string) => void;
}

interface ExistingSlotInfo {
  key: string;
  displayName: string;
  savedAt: string;
}

const getAvailableSaveSlots = (): ExistingSlotInfo[] => {
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


const SaveGameModal: React.FC<SaveGameModalProps> = ({ 
  isOpen, 
  onClose, 
  gameState,
  onSaveToJsonFile,
  onSaveToLocalStorageSlot
}) => {
  const { addToast } = usePublicToast();
  const { isGoogleLoggedIn, accessToken, requestDriveScopes, isGapiLoaded, driveContext, setDriveContext } = useAuth();
  const [slotName, setSlotName] = useState<string>('');
  const [driveFileName, setDriveFileName] = useState<string>('');
  const [existingSlots, setExistingSlots] = useState<ExistingSlotInfo[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  // const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null); // Use driveContext
  const [selectedDriveFileToOverwrite, setSelectedDriveFileToOverwrite] = useState<DriveFile | null>(null);


  const refreshLocalSlots = useCallback(() => {
    setExistingSlots(getAvailableSaveSlots());
  }, []);

  const fetchDriveFiles = useCallback(async (token?: string | null, gapiReady?: boolean) => {
    const currentToken = token === undefined ? accessToken : token;
    const currentGapiReady = gapiReady === undefined ? isGapiLoaded : gapiReady;

    if (!isGoogleLoggedIn || !currentToken || !currentGapiReady) {
      if(isGoogleLoggedIn && currentGapiReady && !currentToken) {
         addToast({message: "Cần cấp quyền truy cập Google Drive để thao tác với Drive.", type: 'warning'});
      }
      return;
    }
    setIsLoadingDrive(true);
    try {
      let folderId = driveContext.appFolderId;
      if (!folderId) {
        folderId = await GoogleDriveService.findOrCreateAppFolder(currentToken);
        setDriveContext(prev => ({ ...prev, appFolderId: folderId }));
      }
      const files = await GoogleDriveService.listSaveFiles(currentToken, folderId);
      setDriveFiles(files);
    } catch (error: any) {
      addToast({ message: `Lỗi khi tải danh sách từ Drive: ${error.message}`, type: 'error' });
       if (error.message.toLowerCase().includes("token") || error.message.toLowerCase().includes("auth")) {
        await requestDriveScopes(); 
      }
    } finally {
      setIsLoadingDrive(false);
    }
  }, [isGoogleLoggedIn, accessToken, isGapiLoaded, addToast, driveContext.appFolderId, setDriveContext, requestDriveScopes]);


  useEffect(() => {
    if (isOpen) {
      refreshLocalSlots();
      const defaultNameBase = gameState?.setup.name || `Game_${new Date().toISOString().slice(0,10)}`;
      
      if (gameState && gameState.setup.name) {
        setSlotName(gameState.setup.name);
        setDriveFileName(gameState.setup.name + ".json");
      } else if (gameState && gameState.setup.id) {
        const storyIdSlotName = gameState.setup.id.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX) 
          ? gameState.setup.id.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length) 
          : gameState.setup.id;
        setSlotName(storyIdSlotName.replace(/_/g, ' '));
        setDriveFileName(storyIdSlotName.replace(/_/g, ' ') + ".json");
      } else {
        setSlotName(defaultNameBase);
        setDriveFileName(defaultNameBase + ".json");
      }
      setSelectedDriveFileToOverwrite(null); // Reset overwrite selection

      if (isGoogleLoggedIn && isGapiLoaded) {
        fetchDriveFiles();
      } else {
        setDriveFiles([]);
      }
    }
  }, [isOpen, gameState, refreshLocalSlots, isGoogleLoggedIn, fetchDriveFiles, isGapiLoaded]);

  const handleSaveToLocalSlot = () => {
    if (!gameState) {
      addToast({ message: "Không có dữ liệu game để lưu.", type: 'error' });
      return;
    }
    const trimmedSlotName = slotName.trim();
    if (!trimmedSlotName) {
      addToast({ message: "Vui lòng nhập tên cho slot lưu trữ.", type: 'warning' });
      return;
    }
    
    const normalizedSlotIdentifier = trimmedSlotName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
    const fullSlotKey = LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX + normalizedSlotIdentifier;
    const isOverwriting = existingSlots.some(s => s.key === fullSlotKey);

    onSaveToLocalStorageSlot(gameState, normalizedSlotIdentifier);
    
    if (isOverwriting) {
      addToast({ message: `Đã ghi đè slot: "${trimmedSlotName}"`, type: 'success', icon: 'fas fa-hdd' });
    } else {
      addToast({ message: `Game đã được lưu vào slot mới: "${trimmedSlotName}"`, type: 'success', icon: 'fas fa-save' });
    }
    refreshLocalSlots();
  };

  const handleDeleteLocalSlot = (slotKey: string, displayName: string) => {
    localStorage.removeItem(slotKey);
    refreshLocalSlots();
    addToast({message: `Đã xóa slot lưu trữ: "${displayName}"`, type: 'info', icon: 'fas fa-trash-alt'});
  };
  
  const handleSelectLocalSlotForOverwrite = (slotInfo: ExistingSlotInfo) => {
    setSlotName(slotInfo.displayName);
    addToast({message: `Tên slot "${slotInfo.displayName}" đã được điền. Nhấn "Lưu Vào Slot Này" để ghi đè.`, type: 'info', icon: 'fas fa-edit'});
  };

  const handleSaveToDrive = async () => {
    if (!gameState) {
        addToast({ message: "Không có dữ liệu game để lưu.", type: 'error' });
        return;
    }
    if (!isGoogleLoggedIn || !accessToken || !isGapiLoaded) {
        addToast({ message: "Vui lòng đăng nhập Google và cấp quyền Drive.", type: 'error' });
        return;
    }
    const trimmedDriveFileName = driveFileName.trim();
    if (!trimmedDriveFileName) {
        addToast({ message: "Vui lòng nhập tên file cho Google Drive.", type: 'warning' });
        return;
    }

    setIsLoadingDrive(true);
    try {
        let folderId = driveContext.appFolderId;
        if (!folderId) {
            folderId = await GoogleDriveService.findOrCreateAppFolder(accessToken);
            setDriveContext(prev => ({ ...prev, appFolderId: folderId }));
        }
        
        const fileToSaveName = trimmedDriveFileName.endsWith('.json') ? trimmedDriveFileName : `${trimmedDriveFileName}.json`;
        
        // Check if overwriting selected file or a file with the same name
        let fileIdToOverwrite = selectedDriveFileToOverwrite?.id;
        if (!fileIdToOverwrite) {
            const existingFileWithName = driveFiles.find(f => f.name === fileToSaveName);
            if (existingFileWithName) {
                if (!window.confirm(`File "${fileToSaveName}" đã tồn tại trên Google Drive. Bạn có muốn ghi đè không?`)) {
                    setIsLoadingDrive(false);
                    return;
                }
                fileIdToOverwrite = existingFileWithName.id;
            }
        }


        await GoogleDriveService.saveGameToDrive(accessToken, folderId, gameState, fileToSaveName, fileIdToOverwrite);
        addToast({ message: `Đã lưu game "${fileToSaveName}" lên Google Drive.`, type: 'success', icon: 'fab fa-google-drive' });
        fetchDriveFiles(); // Refresh file list
        setSelectedDriveFileToOverwrite(null); // Reset selection
        setDriveFileName(gameState.setup.name ? gameState.setup.name + ".json" : `GameLuu_${Date.now()}.json`); // Reset to default for next save
    } catch (error: any) {
        addToast({ message: `Lỗi khi lưu game lên Drive: ${error.message}`, type: 'error' });
    } finally {
        setIsLoadingDrive(false);
    }
  };
  
  const handleSelectDriveFileForOverwrite = (file: DriveFile) => {
    setDriveFileName(file.name);
    setSelectedDriveFileToOverwrite(file);
    addToast({message: `File "${file.name}" đã được chọn để ghi đè. Nhấn "Lưu Vào Google Drive" để xác nhận.`, type:'info', icon: 'fas fa-edit'});
  };


  if (!gameState) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lưu Tiến Trình Game" size="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Local Save Section */}
        <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
          <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-3">
            <i className="fas fa-file-download mr-2 text-primary dark:text-primary-light"></i>Lưu Dưới Dạng File (.json)
          </h3>
          <Button onClick={() => onSaveToJsonFile(gameState)} variant="primary" className="w-full" leftIcon={<i className="fas fa-download"></i>}>
            Tải File JSON Xuống
          </Button>
          <hr className="my-4 border-border-light dark:border-border-dark"/>
          <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2">
            <i className="fas fa-hdd mr-2 text-primary dark:text-primary-light"></i>Lưu Vào Slot Trình Duyệt
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 items-end mb-3">
            <Input label="Tên Slot Lưu Trữ:" value={slotName} onChange={(e) => setSlotName(e.target.value)} placeholder="Tên cuộc phiêu lưu" wrapperClass="flex-grow !mb-0"/>
            <Button onClick={handleSaveToLocalSlot} variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0" disabled={!slotName.trim()} leftIcon={<i className="fas fa-save"></i>}>
              Lưu Vào Slot Này
            </Button>
          </div>
          {existingSlots.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">Slot đã lưu (nhấn để điền tên và ghi đè):</h4>
              <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                {existingSlots.map(slot => (
                  <div key={slot.key} className="p-1.5 border rounded-md bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 flex justify-between items-center text-xs hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors">
                    <div className="cursor-pointer flex-grow mr-1" onClick={() => handleSelectLocalSlotForOverwrite(slot)} title={`Chọn để ghi đè slot: ${slot.displayName}`}>
                      <strong className="block text-slate-800 dark:text-slate-100">{slot.displayName}</strong>
                      <span className="text-slate-500 dark:text-slate-400">Lúc: {new Date(slot.savedAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                    <Button size="xs" variant="danger" onClick={() => handleDeleteLocalSlot(slot.key, slot.displayName)} className="!p-1 flex-shrink-0" title={`Xóa slot: ${slot.displayName}`}><i className="fas fa-trash-alt"></i></Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Save Section */}
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700">
          <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2">
            <i className="fab fa-google-drive mr-2 text-blue-500 dark:text-blue-400"></i>Lưu Vào Google Drive
          </h3>
          {!isGoogleLoggedIn ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Vui lòng đăng nhập Google để lưu game lên Drive.</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2 items-end mb-3">
                <Input label="Tên File trên Drive:" value={driveFileName} onChange={(e) => {setDriveFileName(e.target.value); setSelectedDriveFileToOverwrite(null);}} placeholder="Ví dụ: PhieuLuuCuaToi.json" wrapperClass="flex-grow !mb-0"/>
                <Button onClick={handleSaveToDrive} variant="success" className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600" disabled={!driveFileName.trim() || isLoadingDrive} isLoading={isLoadingDrive} leftIcon={<i className="fas fa-cloud-upload-alt"></i>}>
                  Lưu Lên Drive
                </Button>
              </div>
              {isLoadingDrive && !driveFiles.length && <div className="text-xs text-blue-500 dark:text-blue-400"><i className="fas fa-spinner fa-spin mr-1"></i>Đang tải danh sách file...</div>}
              {driveFiles.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">File trên Drive (nhấn để điền tên và ghi đè):</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                    {driveFiles.map(file => (
                      <div key={file.id} className={`p-1.5 border rounded-md flex justify-between items-center text-xs transition-colors ${selectedDriveFileToOverwrite?.id === file.id ? 'bg-blue-100 dark:bg-blue-700 ring-1 ring-blue-500' : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600/50'}`}>
                        <div className="cursor-pointer flex-grow mr-1" onClick={() => handleSelectDriveFileForOverwrite(file)} title={`Chọn để ghi đè file: ${file.name}`}>
                          <strong className="block text-slate-800 dark:text-slate-100">{file.name}</strong>
                          <span className="text-slate-500 dark:text-slate-400">Sửa đổi: {new Date(file.modifiedTime).toLocaleTimeString('vi-VN')}</span>
                        </div>
                        {/* Delete from Drive might be added to Load modal for safety */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={onClose} size="lg" disabled={isLoadingDrive}>Đóng</Button>
      </div>
    </Modal>
  );
};

export default SaveGameModal;
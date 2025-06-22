import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { GameState, AutosavedGameInfo } from '../../types';
import { usePublicToast } from '../../contexts/ToastContext';
import { LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX } from '../../constants';

interface LoadStoryModalProps {
  isOpen: boolean; 
  onClose: () => void;
  onLoadStoryFromFile: (gameState: GameState) => void;
  onLoadStoryFromSlot: (slotKey: string) => void;
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


const LoadStoryModal: React.FC<LoadStoryModalProps> = ({ isOpen, onClose, onLoadStoryFromFile, onLoadStoryFromSlot }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [existingSlots, setExistingSlots] = useState<ExistingSlotInfo[]>([]);
  const { addToast } = usePublicToast();

  const refreshSlots = useCallback(() => {
    setExistingSlots(getAvailableLoadSlots());
  }, []);

  useEffect(() => {
    if (isOpen) {
        refreshSlots();
    }
  }, [isOpen, refreshSlots]); 

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

  const handleLoadFromFile = () => {
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
            // onClose(); // Close modal on successful load
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
  
  const handleDeleteSlot = (slotKey: string, displayName: string) => {
    localStorage.removeItem(slotKey);
    refreshSlots();
    addToast({message: `Đã xóa slot lưu trữ: "${displayName}"`, type: 'info', icon: 'fas fa-trash-alt'});
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tải Game Đã Lưu" size="lg">
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-primary/5 dark:bg-primary-dark/10 border-primary/30 dark:border-primary-dark/40">
          <h3 className="text-lg font-semibold text-primary dark:text-primary-light mb-2 flex items-center">
            <i className="fas fa-history mr-2"></i>Tải Từ Các Slot Đã Lưu Trong Trình Duyệt
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
                    <Button onClick={() => {onLoadStoryFromSlot(slot.key); /* onClose(); */}} variant="primary" size="xs" className="!px-2.5 !py-1" leftIcon={<i className="fas fa-play-circle"></i>}>
                      Tải Slot Này
                    </Button>
                     <Button onClick={() => handleDeleteSlot(slot.key, slot.displayName)} variant="danger" size="xs" className="!px-2 !py-1" title={`Xóa slot: ${slot.displayName}`}>
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Không tìm thấy slot nào được lưu trong trình duyệt.</p>
          )}
        </div>

        <hr className="border-border-light dark:border-border-dark my-4" />

        <div>
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 flex items-center">
            <i className="fas fa-file-upload mr-2"></i>Hoặc Tải Game Từ File JSON
          </h3>
          <p className="text-sm text-text-light dark:text-text-dark mb-2">
            Chọn file JSON (.json) đã lưu thủ công trước đó.
          </p>
          <div>
            <label htmlFor="file-upload-load" className="block text-xs font-medium text-text-light dark:text-text-dark mb-1 sr-only"> 
              Chọn file save game:
            </label>
            <input
              id="file-upload-load" // Changed ID to be unique
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 dark:text-slate-400
                         file:mr-4 file:py-2 file:px-3
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary-light/20 file:text-primary dark:file:bg-primary-dark/30 dark:file:text-primary-light
                         hover:file:bg-primary-light/30 dark:hover:file:bg-primary-dark/40
                         focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </div>
          {selectedFile && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5">
              Đã chọn: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
           <Button 
            onClick={handleLoadFromFile} 
            disabled={!selectedFile || isLoadingFile}
            isLoading={isLoadingFile}
            className="mt-3 w-full sm:w-auto"
            variant="outline"
            leftIcon={<i className="fas fa-upload"></i>}
          >
            {isLoadingFile ? "Đang Tải Từ File..." : "Tải Từ File"}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="ghost" onClick={onClose} disabled={isLoadingFile} size="lg">
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default LoadStoryModal;
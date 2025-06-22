import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { GameState, AutosavedGameInfo } from '../../types';
import { LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX } from '../../constants';
import { usePublicToast } from '../../contexts/ToastContext';

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
  const [slotName, setSlotName] = useState<string>('');
  const [existingSlots, setExistingSlots] = useState<ExistingSlotInfo[]>([]);

  const refreshSlots = useCallback(() => {
    setExistingSlots(getAvailableSaveSlots());
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshSlots();
      if (gameState && gameState.setup.name) {
        setSlotName(gameState.setup.name);
      } else if (gameState && gameState.setup.id) {
        const storyIdSlotName = gameState.setup.id.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX) 
          ? gameState.setup.id.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length) 
          : gameState.setup.id;
        setSlotName(storyIdSlotName.replace(/_/g, ' ')); // Make it more readable
      } else {
        setSlotName(`Game_${new Date().toISOString().slice(0,10)}`);
      }
    }
  }, [isOpen, gameState, refreshSlots]);

  const handleSaveToSlot = () => {
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
    refreshSlots();
  };

  const handleDeleteSlot = (slotKey: string, displayName: string) => {
    localStorage.removeItem(slotKey);
    refreshSlots();
    addToast({message: `Đã xóa slot lưu trữ: "${displayName}"`, type: 'info', icon: 'fas fa-trash-alt'});
  };
  
  const handleSelectSlotForOverwrite = (slotInfo: ExistingSlotInfo) => {
    // Use the display name for the input field, as it's more user-friendly.
    // The actual saving logic will normalize it.
    setSlotName(slotInfo.displayName);
    addToast({message: `Tên slot "${slotInfo.displayName}" đã được điền. Nhấn "Lưu Vào Slot Này" để ghi đè.`, type: 'info', icon: 'fas fa-edit'});
  };

  if (!gameState) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lưu Tiến Trình Game" size="lg">
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
          <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2">
            <i className="fas fa-file-download mr-2 text-primary dark:text-primary-light"></i>Lưu Dưới Dạng File (.json)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Tải về một bản sao của tiến trình game hiện tại. File này có thể được sử dụng để tải lại game sau này.
          </p>
          <Button 
            onClick={() => onSaveToJsonFile(gameState)}
            variant="primary"
            className="w-full sm:w-auto"
            leftIcon={<i className="fas fa-download"></i>}
          >
            Tải File JSON Xuống
          </Button>
        </div>

        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700">
          <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2">
            <i className="fas fa-database mr-2 text-blue-500 dark:text-blue-400"></i>Lưu Vào Slot Trong Trình Duyệt
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Lưu game vào một slot trong bộ nhớ của trình duyệt. Bạn có thể đặt tên cho slot này.
            Lưu ý: Dữ liệu này có thể bị mất nếu bạn xóa cache trình duyệt.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 items-end mb-4">
            <Input
              label="Tên Slot Lưu Trữ:"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              placeholder="Ví dụ: Cuộc phiêu lưu của Lý Tiểu Long"
              wrapperClass="flex-grow !mb-0"
            />
            <Button 
              onClick={handleSaveToSlot}
              variant="secondary"
              className="w-full sm:w-auto mt-2 sm:mt-0"
              disabled={!slotName.trim()}
              leftIcon={<i className="fas fa-save"></i>}
            >
              Lưu Vào Slot Này
            </Button>
          </div>

          {existingSlots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Các slot đã lưu (nhấn để điền tên và ghi đè):</h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
                {existingSlots.map(slot => (
                  <div 
                    key={slot.key} 
                    className="p-2.5 border rounded-md bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 flex justify-between items-center text-xs hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors"
                  >
                    <div className="cursor-pointer flex-grow mr-2" onClick={() => handleSelectSlotForOverwrite(slot)} title={`Chọn để ghi đè slot: ${slot.displayName}`}>
                      <strong className="block text-slate-800 dark:text-slate-100">{slot.displayName}</strong>
                      <span className="text-slate-500 dark:text-slate-400">Lưu lúc: {new Date(slot.savedAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <Button 
                      size="xs" 
                      variant="danger" 
                      onClick={() => handleDeleteSlot(slot.key, slot.displayName)}
                      className="!p-1.5 ml-2 flex-shrink-0"
                      title={`Xóa slot: ${slot.displayName}`}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={onClose} size="lg">Đóng</Button>
      </div>
    </Modal>
  );
};

export default SaveGameModal;
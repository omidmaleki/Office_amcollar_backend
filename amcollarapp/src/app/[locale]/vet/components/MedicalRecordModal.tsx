"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  records: Array<{
    id: string;
    date: string;
    description: string;
    [key: string]: any; // Additional fields from backend
  }>;
  isEditMode?: boolean;
  onAddRecord?: (record: { id: string; date: string; description: string; [key: string]: any }) => void;
}

export default function MedicalRecordModal({
  isOpen,
  onClose,
  title,
  records,
  isEditMode = false,
  onAddRecord,
}: MedicalRecordModalProps) {
  const tCommon = useTranslations("common");
  const tNewPet = useTranslations("vetNewPet");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecordDate, setNewRecordDate] = useState("");
  const [newRecordDescription, setNewRecordDescription] = useState("");

  const handleAddNewRecord = () => {
    if (!newRecordDate || !newRecordDescription || !onAddRecord) return;
    
    const newRecord = {
      id: `record-${Date.now()}`,
      date: newRecordDate,
      description: newRecordDescription,
    };
    
    onAddRecord(newRecord);
    setNewRecordDate("");
    setNewRecordDescription("");
    setShowAddForm(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Add Record Form (Edit Mode) */}
            {isEditMode && (
              <div className="mb-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-4">
                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>{tNewPet("addRecord")}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {tNewPet("recordDate")}
                      </label>
                      <input
                        type="date"
                        value={newRecordDate}
                        onChange={(e) => setNewRecordDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {tNewPet("recordDescription")}
                      </label>
                      <textarea
                        value={newRecordDescription}
                        onChange={(e) => setNewRecordDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder={tNewPet("recordDescriptionPlaceholder")}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewRecord}
                        disabled={!newRecordDate || !newRecordDescription}
                        className="flex-1 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {tNewPet("saveRecord")}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewRecordDate("");
                          setNewRecordDescription("");
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {tCommon("cancel")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Records List */}
            {records.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                {isEditMode ? tNewPet("noRecordsYet") : tCommon("noRecords")}
              </p>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-gray-200 p-4 hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {record.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    {/* Additional fields can be rendered here */}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#D4AF37] py-3 text-white font-medium hover:bg-[#0b4a3a] transition-colors"
            >
              {tCommon("close")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


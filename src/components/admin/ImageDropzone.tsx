"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ImageDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function ImageDropzone({ files, onFilesChange }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    console.log("ТРИГГЕР: useEffect сработал!");
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFiles = (fileList: FileList | null | undefined) => {
    if (!fileList?.length) {
      return;
    }

    const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!nextFiles.length) {
      return;
    }

    onFilesChange([...files, ...nextFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="md:col-span-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragging
            ? "border-[#FF7A00] bg-[#FF7A00]/10"
            : "border-[#2A2A2A] bg-[#0B0B0B] hover:border-[#FF7A00] hover:bg-[#111111]"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#171717] text-2xl text-[#FF7A00]">
          ⬆
        </div>
        <p className="mt-4 text-base font-semibold text-white">
          Перетащите изображения сюда
        </p>
        <p className="mt-2 text-sm text-[#A3A3A3]">
          Или нажмите, чтобы выбрать файлы с устройства. Поддерживаются JPG, PNG и WEBP до 5 МБ.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0B0B0B]">
              <img
                src={previewUrls[index]}
                alt={file.name}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile(index);
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#171717]/90 text-sm text-white transition hover:border-rose-400 hover:text-rose-400"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
              <div className="border-t border-[#2A2A2A] bg-[#171717] px-3 py-2 text-xs text-[#A3A3A3]">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

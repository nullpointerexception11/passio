/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HardDrive, BookOpen, Eye } from 'lucide-react';
import { IMaterialActiveSession } from '../types/material.types';

interface RecentMaterialsProps {
  customPdfs: IMaterialActiveSession[];
  onSelect: (session: IMaterialActiveSession) => void;
}

export const RecentMaterials: React.FC<RecentMaterialsProps> = ({ customPdfs, onSelect }) => {
  if (customPdfs.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
        <HardDrive className="w-3.5 h-3.5" />
        <span>YÜKLENEN YEREL PDF BELGELERİ ({customPdfs.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customPdfs.map((pdf) => (
          <div
            key={pdf.docId}
            onClick={() => onSelect(pdf)}
            className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-accent hover:shadow-md group"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderColor: 'var(--color-border-subtle)',
            }}
          >
            <div className="flex items-center gap-3 truncate">
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-serif font-medium text-sm truncate group-hover:text-accent transition-colors">
                  {pdf.title}
                </span>
                <span className="text-[10px] font-mono opacity-50">Yerel Cihaz Dosyası • PDF</span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 opacity-80 group-hover:opacity-100 group-hover:bg-accent group-hover:text-white transition-all">
              <Eye className="w-3.5 h-3.5" />
              <span>Oku</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

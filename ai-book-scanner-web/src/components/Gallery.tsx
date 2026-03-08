import { useEffect, useState } from 'react';
import { getAllDocuments, deleteDocument } from '../db/db';
import { jsPDF } from 'jspdf';

interface DocumentData {
    id?: number;
    blob: Blob;
    width: number;
    height: number;
    created: Date;
}

interface GalleryProps {
    onClose: () => void;
}

const Gallery = ({ onClose }: GalleryProps) => {
    const [docs, setDocs] = useState<DocumentData[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        const documents = await getAllDocuments();
        setDocs(documents.sort((a, b) => b.created.getTime() - a.created.getTime()));
    };

    const toggleSelect = (id: number) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (confirm(`Delete ${selected.length} items?`)) {
            for (const id of selected) {
                await deleteDocument(id);
            }
            setSelected([]);
            loadDocs();
        }
    };

    const generatePDF = async () => {
        if (selected.length === 0) return;
        setGenerating(true);

        try {
            const doc = new jsPDF();

            // Filter selected docs and sort by creation time (or user order - simple creation time for now)
            // Actually user might want to select order. For now we assume selected order or date order.
            // Let's use date order of selected items (oldest first for book)
            const selectedDocs = docs.filter(d => d.id && selected.includes(d.id)).reverse(); // Oldest first usually? 
            // Or actually current sort is Newest first.
            // Let's stick to Newest First in UI, but PDF usually implies page 1..N.
            // The user selects pages. If they select randomly, it's ambiguous.
            // We'll just take the list order.

            for (let i = 0; i < selectedDocs.length; i++) {
                const item = selectedDocs[i];
                const imgData = await blobToBase64(item.blob);

                const pageWidth = 210; // A4 width mm
                const pageHeight = 297; // A4 height mm

                // Calculate aspect ratio
                const ratio = item.width / item.height;
                let imgWidth = pageWidth;
                let imgHeight = pageWidth / ratio;

                if (imgHeight > pageHeight) {
                    imgHeight = pageHeight;
                    imgWidth = pageHeight * ratio;
                }

                if (i > 0) doc.addPage();
                doc.addImage(imgData, 'JPEG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
            }

            doc.save('scanned_document.pdf');
        } catch (e) {
            console.error(e);
            alert('Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <div className="absolute inset-0 z-50 bg-gray-900 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                <h2 className="text-xl font-bold">Gallery ({docs.length})</h2>
                <button onClick={onClose} className="text-gray-300">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-2 align-top content-start">
                {docs.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => doc.id && toggleSelect(doc.id)}
                        className={`relative aspect-[3/4] bg-gray-800 rounded overflow-hidden border-2 ${doc.id && selected.includes(doc.id) ? 'border-blue-500' : 'border-transparent'}`}
                    >
                        <img src={URL.createObjectURL(doc.blob)} className="w-full h-full object-cover" alt="scan" />
                        {doc.id && selected.includes(doc.id) && (
                            <div className="absolute top-1 right-1 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</div>
                        )}
                    </div>
                ))}
            </div>

            {selected.length > 0 && (
                <div className="p-4 bg-gray-800 flex justify-between items-center pb-8 sticky bottom-0">
                    <span className="text-sm">{selected.length} selected</span>
                    <div className="space-x-4">
                        <button onClick={handleDelete} className="text-red-400">Delete</button>
                        <button
                            onClick={generatePDF}
                            disabled={generating}
                            className="bg-blue-600 px-4 py-2 rounded font-bold disabled:opacity-50"
                        >
                            {generating ? 'Exporting...' : 'Export PDF'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;

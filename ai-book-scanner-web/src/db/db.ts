import { openDB, type DBSchema } from 'idb';

interface BookScannerDB extends DBSchema {
    documents: {
        key: number;
        value: {
            id?: number;
            created: Date;
            blob: Blob;
            width: number;
            height: number;
        };
        indexes: { 'by-date': Date };
    };
}

const DB_NAME = 'book-scanner-db';

export async function initDB() {
    return openDB<BookScannerDB>(DB_NAME, 1, {
        upgrade(db) {
            const store = db.createObjectStore('documents', {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('by-date', 'created');
        },
    });
}

export async function saveDocument(blob: Blob, width: number, height: number) {
    const db = await initDB();
    return db.add('documents', {
        created: new Date(),
        blob,
        width,
        height
    });
}

export async function getAllDocuments() {
    const db = await initDB();
    return db.getAllFromIndex('documents', 'by-date');
}

export async function deleteDocument(id: number) {
    const db = await initDB();
    return db.delete('documents', id);
}

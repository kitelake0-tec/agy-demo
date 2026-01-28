import React from 'react';

interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'consumable' | 'material' | 'skillbook';
    icon: string;
    quantity: number;
    description: string;
    price: number;
    effect?: {
        hp?: number;
        mp?: number;
        attack?: number;
        defense?: number;
    };
}

interface InventoryProps {
    inventory: InventoryItem[];
    onUseItem?: (item: InventoryItem) => void;
    onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onUseItem, onClose }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70">
            <div className="bg-slate-800 p-6 rounded-lg border-2 border-slate-600 w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">가방</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-5 gap-2 overflow-y-auto p-2 bg-slate-900 rounded flex-1">
                    {inventory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-slate-700 p-2 rounded border border-slate-600 hover:bg-slate-600 cursor-pointer relative group aspect-square flex flex-col items-center justify-center"
                            onClick={() => onUseItem && onUseItem(item)}
                        >
                            <div className="text-3xl mb-1">{item.icon}</div>
                            <div className="absolute bottom-1 right-1 text-xs font-bold text-white bg-black/50 px-1 rounded">
                                x{item.quantity}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-black text-white text-xs p-2 rounded z-30 pointer-events-none border border-slate-500">
                                <div className="font-bold text-yellow-400 mb-1">{item.name}</div>
                                <div className="text-gray-300">{item.description}</div>
                                {item.effect && (
                                    <div className="mt-1 text-green-400">
                                        {Object.entries(item.effect).map(([key, val]) => (
                                            <div key={key}>{key.toUpperCase()} +{val}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {/* Empty slots filler */}
                    {Array.from({ length: Math.max(0, 25 - inventory.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-900/50 rounded border border-slate-800 aspect-square" />
                    ))}
                </div>
                <div className="mt-4 text-center text-gray-400 text-sm">
                    아이템을 클릭하여 사용하세요 via Click
                </div>
            </div>
        </div>
    );
};

export default Inventory;

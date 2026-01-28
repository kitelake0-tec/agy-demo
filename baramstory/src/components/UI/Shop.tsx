import React, { useState } from 'react';
import { Item, InventoryItem } from '../../game/types';

interface ShopProps {
    npcName: string;
    shopItems: Item[];
    playerGold: number;
    inventory: InventoryItem[];
    onClose: () => void;
    onBuy: (item: Item, quantity: number) => void;
    onSell: (item: InventoryItem, quantity: number) => void;
}


const Shop: React.FC<ShopProps> = ({
    npcName,
    shopItems,
    playerGold,
    inventory,
    onClose,
    onBuy,
    onSell,
}) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedItem, setSelectedItem] = useState<Item | InventoryItem | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleTransaction = () => {
        if (!selectedItem) return;

        if (activeTab === 'buy') {
            onBuy(selectedItem as Item, quantity);
        } else {
            onSell(selectedItem as InventoryItem, quantity);
        }
        setQuantity(1);
        // Note: In a real app we might want to keep selection if item still exists, 
        // but for simplicity we can clear or keep it. Keeping it allows repeated buy.
    };

    const getRarityColor = (price: number) => {
        if (price >= 10000) return 'border-yellow-500 text-yellow-500';
        if (price >= 1000) return 'border-purple-500 text-purple-400';
        if (price >= 500) return 'border-blue-500 text-blue-400';
        return 'border-gray-600 text-white';
    };

    const currentItems = activeTab === 'buy' ? shopItems : inventory;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border-2 border-yellow-700 rounded-lg w-[700px] h-[500px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-yellow-900/40 p-4 border-b border-yellow-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-yellow-400">🏪 {npcName}</h2>
                    <div className="flex gap-4 items-center">
                        <div className="bg-black/50 px-3 py-1 rounded-full border border-yellow-600">
                            💰 <span className="text-yellow-400">{playerGold.toLocaleString()} G</span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                    <button
                        onClick={() => { setActiveTab('buy'); setSelectedItem(null); setQuantity(1); }}
                        className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'buy' ? 'bg-yellow-800 text-white' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                            }`}
                    >
                        구매하기
                    </button>
                    <button
                        onClick={() => { setActiveTab('sell'); setSelectedItem(null); setQuantity(1); }}
                        className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'sell' ? 'bg-green-800 text-white' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                            }`}
                    >
                        판매하기
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Item List */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
                        <div className="grid grid-cols-4 gap-2">
                            {currentItems.map((item, idx) => (
                                <div
                                    key={item.id + idx}
                                    onClick={() => { setSelectedItem(item); setQuantity(1); }}
                                    className={`
                    relative p-2 border-2 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700
                    flex flex-col items-center justify-center h-24
                    ${selectedItem === item ? 'ring-2 ring-white border-white' : getRarityColor(item.price)}
                  `}
                                >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <div className="text-xs text-center truncate w-full px-1">{item.name}</div>
                                    {'quantity' in item && (
                                        <span className="absolute top-1 right-1 bg-black/80 px-1 rounded text-xs text-white">
                                            {(item as InventoryItem).quantity}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {currentItems.length === 0 && (
                                <div className="col-span-4 text-center text-gray-500 py-10">
                                    {activeTab === 'buy' ? '판매하는 물건이 없습니다.' : '판매할 물건이 없습니다.'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-64 bg-gray-800 p-4 border-l border-gray-700 flex flex-col">
                        {selectedItem ? (
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    <div className="text-5xl mb-2">{selectedItem.icon}</div>
                                    <div className={`font-bold text-lg ${getRarityColor(selectedItem.price).split(' ')[1]}`}>
                                        {selectedItem.name}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 capitalize">{selectedItem.type}</div>
                                </div>

                                <div className="text-sm text-gray-300 mb-4 bg-black/30 p-2 rounded h-24 overflow-y-auto">
                                    {selectedItem.description}
                                    {selectedItem.effect && (
                                        <div className="mt-2 text-green-400 text-xs">
                                            {Object.entries(selectedItem.effect || {}).map(([key, val]) => (
                                                <div key={key}>+ {val} {key.toUpperCase()}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span>단가:</span>
                                        <span className="text-yellow-400">
                                            {activeTab === 'buy' ? selectedItem.price : selectedItem.sellPrice} G
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm">수량:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max={activeTab === 'sell' ? (selectedItem as InventoryItem).quantity : 99}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, activeTab === 'sell' ? (selectedItem as InventoryItem).quantity : 99)))}
                                            className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-right text-white"
                                        />
                                    </div>

                                    <div className="border-t border-gray-600 pt-3 mb-3">
                                        <div className="flex justify-between items-center font-bold">
                                            <span>총액:</span>
                                            <span className={activeTab === 'buy' && (selectedItem.price * quantity) > playerGold ? 'text-red-500' : 'text-yellow-400'}>
                                                {(activeTab === 'buy' ? selectedItem.price : selectedItem.sellPrice) * quantity} G
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleTransaction}
                                        disabled={activeTab === 'buy' && (selectedItem.price * quantity) > playerGold}
                                        className={`w-full py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95 ${activeTab === 'buy'
                                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-gray-600 disabled:text-gray-400'
                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                            }`}
                                    >
                                        {activeTab === 'buy' ? '구매하기' : '판매하기'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                                아이템을 선택하세요.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;

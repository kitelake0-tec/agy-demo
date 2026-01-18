"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

interface Branch {
    id: number;
    name: string;
}

interface BranchSearchProps {
    onSelectBranch: (branchId: number | null) => void;
}

export default function BranchSearch({ onSelectBranch }: BranchSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ideally this search endpoint should be debounced or just load all for small sets
        // For 200 branches, loading all once is fine.
        fetchBranches();

        // Close on click outside
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch("/api/branches");
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredBranches = branches.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (branch: Branch) => {
        setSelectedBranch(branch);
        onSelectBranch(branch.id);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = () => {
        setSelectedBranch(null);
        onSelectBranch(null);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full max-w-xs" ref={wrapperRef}>
            <div
                className="flex items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
                onClick={() => setIsOpen(true)}
            >
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />

                {selectedBranch ? (
                    <span className="flex-1 text-gray-900 font-medium">{selectedBranch.name}</span>
                ) : (
                    <input
                        type="text"
                        className="flex-1 border-none focus:ring-0 p-0 text-sm"
                        placeholder="지점 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                )}

                {selectedBranch ? (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleClear(); }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBranches.length > 0 ? (
                        <ul className="py-1">
                            {!selectedBranch && searchTerm === "" && (
                                <li
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-500"
                                    onClick={() => setIsOpen(false)}
                                >
                                    전체 보기
                                </li>
                            )}
                            {filteredBranches.map((branch) => (
                                <li
                                    key={branch.id}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center"
                                    onClick={() => handleSelect(branch)}
                                >
                                    <MapPin className="w-3 h-3 text-gray-400 mr-2" />
                                    {branch.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            지점을 찾을 수 없습니다.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

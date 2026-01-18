"use client";

import { User } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
            <div className="flex items-center">
                {/* Placeholder for Breadcrumbs or Page Title if needed */}
                <h2 className="text-lg font-semibold text-gray-800">대시모드</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-gray-700">관리자</p>
                        <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

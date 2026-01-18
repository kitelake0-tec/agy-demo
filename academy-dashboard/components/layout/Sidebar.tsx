"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Upload, LogOut } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: "전체 대시보드", href: "/dashboard", icon: LayoutDashboard },
        { name: "지점 관리", href: "/branches", icon: Store },
        { name: "데이터 업로드", href: "/upload", icon: Upload },
    ];

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider text-blue-400">AcademyAdmin</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? "bg-gray-800 text-blue-400"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                                        }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-800">
                <button
                    className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
                    onClick={() => {
                        // Handle logout logic later
                        console.log("Logout clicked");
                    }}
                >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                    로그아웃
                </button>
            </div>
        </div>
    );
}

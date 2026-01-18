"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{
        success?: number;
        failed?: number;
        error?: string;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/data/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setResult({ success: data.success, failed: data.failed });
            } else {
                setResult({ error: data.error || "업로드 실패" });
            }
        } catch (error) {
            setResult({ error: "네트워크 오류가 발생했습니다." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">데이터 업로드</h1>
                <p className="text-sm text-gray-500 mt-1">
                    CSV 파일을 통해 매출 및 운영 데이터를 일괄 등록합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        파일 선택
                    </h3>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                        >
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {file ? file.name : "CSV 파일을 선택하세요"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                Click to browse or drag file here
                            </span>
                        </label>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {uploading ? "업로드 중..." : "업로드 시작"}
                        </button>
                    </div>
                </div>

                {/* Result Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        업로드 결과
                    </h3>

                    {!result ? (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400 border border-gray-100 rounded-lg bg-gray-50">
                            <FileText className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">업로드 후 결과가 여기에 표시됩니다.</p>
                        </div>
                    ) : result.error ? (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold">업로드 실패</h4>
                                <p className="text-sm mt-1">{result.error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-start">
                                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold">처리 완료</h4>
                                    <p className="text-sm mt-1">파일 처리가 완료되었습니다.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">성공</p>
                                    <p className="text-2xl font-bold text-green-600">{result.success}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">실패</p>
                                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

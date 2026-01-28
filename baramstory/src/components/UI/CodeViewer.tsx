import React from 'react';

interface CodeViewerProps {
    onClose: () => void;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/90">
            <div className="bg-[#1e1e1e] w-full h-full md:w-3/4 md:h-3/4 rounded-lg flex flex-col overflow-hidden border border-gray-700 shadow-2xl">
                <div className="bg-[#2d2d2d] p-3 flex justify-between items-center border-b border-black">
                    <span className="text-gray-300 font-mono text-sm">System Code Viewer</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <div className="flex-1 p-6 overflow-auto font-mono text-sm text-gray-300">
                    <p className="text-green-400 mb-4">// System initialized...</p>
                    <p className="mb-2">Target: Baram of the Kingdom</p>
                    <p className="mb-2">Version: 1.0.0-alpha</p>
                    <p className="mb-2">Status: Online</p>
                    <br />
                    <p className="text-blue-400">Loading modules...</p>
                    <ul className="list-disc pl-5 text-gray-400">
                        <li>GameEngine: OK</li>
                        <li>RenderSystem: OK</li>
                        <li>AudioSystem: Muted</li>
                        <li>Network: Local</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CodeViewer;

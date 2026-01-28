import React from 'react';

interface ZipDownloaderProps {
    onClose: () => void;
}

const ZipDownloader: React.FC<ZipDownloaderProps> = ({ onClose }) => {
    const downloadCode = () => {
        const fullCode = `
========================================
바람의 전설 RPG - 전체 소스 코드
========================================

이 파일을 다음과 같이 분리하여 저장하세요:

1. 프로젝트 폴더 생성
2. 각 파일을 해당 경로에 저장
3. npm install 실행
4. npm run dev 실행
`;

        const blob = new Blob([fullCode], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wind-legend-rpg-source.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('다운로드가 시작되었습니다!\\n\\n전체 코드는 이 채팅에서 확인하세요.');
    };

    const copyToClipboard = () => {
        const text = '전체 코드는 이 채팅 내용에서 복사하세요. 모든 파일이 제공되었습니다.';
        navigator.clipboard.writeText(text);
        alert('안내: 전체 코드는 이 채팅 내용에서 파일별로 복사하세요.');
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                style={{
                    backgroundColor: '#1a1a2e',
                    border: '2px solid #4ade80',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '400px',
                    maxWidth: '90vw',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold' }}>📥 코드 다운로드</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>

                <p style={{ color: '#ccc', marginBottom: '16px', fontSize: '14px' }}>
                    전체 소스 코드(27개 파일)가 이 채팅에 모두 제공되었습니다.
                    각 파일을 복사하여 프로젝트를 구성하세요.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={downloadCode}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        📥 TXT 파일 다운로드
                    </button>

                    <button
                        onClick={copyToClipboard}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        📋 안내 보기
                    </button>
                </div>

                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#2a2a4a', borderRadius: '8px' }}>
                    <p style={{ color: '#fbbf24', fontSize: '12px', marginBottom: '8px' }}>📌 사용 방법:</p>
                    <ol style={{ color: '#aaa', fontSize: '12px', paddingLeft: '16px' }}>
                        <li>이 채팅에서 각 파일 코드를 복사</li>
                        <li>해당 경로에 파일 생성</li>
                        <li>npm install 실행</li>
                        <li>npm run dev 실행</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ZipDownloader;

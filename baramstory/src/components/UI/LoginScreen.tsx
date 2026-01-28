import React, { useState } from 'react';

interface LoginScreenProps {
    onLoginSuccess: (userId: string) => void;
    onGoToSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToSignup }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple mock authentication against LocalStorage
        const users = JSON.parse(localStorage.getItem('baram_users') || '{}');

        if (users[id] && users[id].password === password) {
            onLoginSuccess(id);
        } else {
            setError('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 opacity-30 bg-[url('/assets/bg_login.png')] bg-cover bg-center" />

            <div className="z-10 bg-black/80 p-8 rounded-xl shadow-2xl border border-gray-700 w-96 backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">바람의 무지개</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="아이디를 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded mt-2 transition-colors"
                    >
                        로그인
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        계정이 없으신가요?
                        <button
                            type="button"
                            onClick={onGoToSignup}
                            className="ml-2 text-yellow-400 hover:text-yellow-300 underline"
                        >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;

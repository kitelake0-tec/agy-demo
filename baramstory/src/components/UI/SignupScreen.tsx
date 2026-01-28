import React, { useState } from 'react';

interface SignupScreenProps {
    onSignupSuccess: () => void;
    onCancel: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupSuccess, onCancel }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || !password) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('baram_users') || '{}');

        if (users[id]) {
            setError('이미 존재하는 아이디입니다.');
            return;
        }

        // Register User
        users[id] = { password }; // In a real app, never store passwords locally!
        localStorage.setItem('baram_users', JSON.stringify(users));

        alert('회원가입이 완료되었습니다!');
        onSignupSuccess();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans relative">
            <div className="absolute inset-0 z-0 bg-animated-gradient opacity-80" />

            <div className="z-10 bg-black/80 p-8 rounded-xl shadow-2xl border border-gray-700 w-96 backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">회원가입</h1>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-white"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded transition-colors"
                        >
                            가입하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupScreen;

import React from 'react';
import './Layout.css';

const Sidebar = () => (
    <aside className="sidebar">
        <div className="sidebar-logo">EduManager</div>
        <nav className="sidebar-nav">
            <a href="/" className="nav-item active">대시보드</a>
            <a href="/branches" className="nav-item">지점 목록</a>
            <a href="/analysis" className="nav-item">분석</a>
            <a href="/settings" className="nav-item">설정</a>
        </nav>
    </aside>
);

const Header = () => (
    <header className="header">
        <h2 className="page-title">대시보드</h2>
        <div className="user-profile">
            <span className="user-name">관리자님</span>
        </div>
    </header>
);

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

// components/Header.jsx
import React from 'react';
import './header1.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <span>로고</span>
                </div>
                <nav className="nav">
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/about">소개</a></li>
                        <li><a href="/contact">문의</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

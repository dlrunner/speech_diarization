// components/Header.jsx
import React from 'react';
import './header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <a href="/"><span>DLRunner</span></a>
                </div>
                <nav className="nav">
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="https://github.com/dlrunner/speech_diarization" target="_blank" rel="noopener noreferrer">소개</a></li>
                        <li><a href="/contact">실시간녹음하기</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

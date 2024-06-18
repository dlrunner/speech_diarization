import React from 'react';
import './header.css';

const Header = () => {
    const click = async (event) => {
        event.preventDefault(); // 기본 동작 막기 (페이지 새로고침 방지)
        // 비동기 요청 처리 (예시로 간단히 setTimeout 사용)
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert('실시간기능 업데이트중입니다.');
    };
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
                        <li><a href="/contact" onClick={click}>실시간녹음하기</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};
export default Header;
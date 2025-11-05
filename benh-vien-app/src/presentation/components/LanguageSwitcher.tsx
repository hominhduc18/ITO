// src/presentation/components/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


const languageSwitcherStyles = `
.language-switcher {
    position: relative;
    display: inline-block;
    z-index: 1000;
}

.language-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    min-width: 140px;
    justify-content: space-between;
     position: relative; 
    z-index: 1002; 
}

.language-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.language-flag {
    font-size: 16px;
    flex-shrink: 0;
}

.language-name {
    font-weight: 500;
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown-arrow {
    font-size: 10px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

.dropdown-arrow.open {
    transform: rotate(180deg);
}

.language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    z-index: 1000;
    margin-top: 4px;
    overflow: hidden;
    animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.language-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    color: #374151;
    text-align: left;
}

.language-option:hover {
    background: #f8fafc;
    transform: translateX(2px);
}

.language-option.active {
    background: #3b82f6;
    color: white;
}

.option-flag {
    font-size: 16px;
    flex-shrink: 0;
}

.option-name {
    flex: 1;
    font-weight: 500;
}

.option-check {
    font-weight: bold;
    color: #10b981;
    flex-shrink: 0;
}

.language-option.active .option-check {
    color: white;
}

/* Dark theme support */
[data-theme="dark"] .language-dropdown {
    background: #1e293b;
    border-color: #374151;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .language-option {
    color: #e5e7eb;
}

[data-theme="dark"] .language-option:hover {
    background: #374151;
}

[data-theme="dark"] .language-option.active {
    background: #3b82f6;
}

/* Responsive design */
@media (max-width: 768px) {
    .language-toggle {
        min-width: 120px;
        padding: 6px 10px;
        font-size: 13px;
    }
    
    .language-name {
        display: none;
    }
    
    .language-dropdown {
        min-width: 140px;
    }
}
`;

// Inject styles
const injectLanguageSwitcherStyles = () => {
    useEffect(() => {
        if (!document.getElementById('language-switcher-styles')) {
            const style = document.createElement('style');
            style.id = 'language-switcher-styles';
            style.innerHTML = languageSwitcherStyles;
            document.head.appendChild(style);
        }
    }, []);
};

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Inject styles
    injectLanguageSwitcherStyles();

    const languages = [
        { code: 'vi', name: '🇻🇳 Tiếng Việt', nativeName: 'Tiếng Việt' },
        { code: 'en', name: '🇺🇸 English', nativeName: 'English' },

    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button
                className="language-toggle"
                onClick={toggleDropdown}
                title="Change language"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="language-flag">🌐</span>
                <span className="language-name">{currentLanguage.nativeName}</span>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="language-dropdown">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(language.code)}
                            aria-selected={i18n.language === language.code}
                        >
                            <span className="option-flag">{language.name.split(' ')[0]}</span>
                            <span className="option-name">{language.nativeName}</span>
                            {i18n.language === language.code && (
                                <span className="option-check">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
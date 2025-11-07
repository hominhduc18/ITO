// components/SmartTextArea.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useAbbreviation } from '../hooks/useAbbreviation';
import './SmartTextArea.css';

const SmartTextArea = ({
                           value,
                           onChange,
                           placeholder,
                           rows = 3,
                           className = '',
                           onBlur,
                           ...props
                       }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef(null);
    const { getSuggestion, applySuggestion, suggestion } = useAbbreviation();

    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab' && suggestion) {
            e.preventDefault();
            const newValue = applySuggestion(value, cursorPosition);
            onChange(newValue);

            // Focus lại textarea và đặt cursor
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    // Có thể tính toán vị trí cursor mới ở đây
                }
            }, 0);
        }
    }, [value, cursorPosition, suggestion, applySuggestion, onChange]);

    const handleSelectionChange = useCallback((e) => {
        setCursorPosition(e.target.selectionStart);
        getSuggestion(e.target.value, e.target.selectionStart);
    }, [getSuggestion]);

    return (
        <div className="smart-textarea-container">
      <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`smart-textarea ${className}`}
          {...props}
      />
            {suggestion && (
                <div className="suggestion-hint">
                    <kbd>TAB</kbd> để chọn: {suggestion}
                </div>
            )}
            <div className="shortcut-hints">
                <small>💡 Gõ viết tắt (vd: "cls") và nhấn TAB để tự động hoàn thành</small>
            </div>
        </div>
    );
};

export default SmartTextArea;
import React from 'react';

/**
 * Props cho component TextArea
 */
interface TextAreaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    required?: boolean;
    placeholder?: string;
    hint?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

/**
 * Component Textarea cho nhập văn bản dài
 */
export const TextArea: React.FC<TextAreaProps> = ({
                                                      label,
                                                      value,
                                                      onChange,
                                                      rows = 3,
                                                      required = false,
                                                      placeholder = '',
                                                      hint = '',
                                                      disabled = false,
                                                      readOnly = false
                                                  }) => {
    return (
        <div className="field">
            <label className={`field-label ${required ? 'required' : ''}`}>
                {label}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                className="field-textarea"
            />
            {hint && <div className="field-hint">{hint}</div>}
        </div>
    );
};
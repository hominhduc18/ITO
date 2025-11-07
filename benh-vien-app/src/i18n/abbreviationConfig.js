// config/abbreviationConfig.js
export const ABBREVIATIONS = {
    // Lý do vào viện
    'cls': 'Cận Lâm Sàng',
    'sot': 'Sốt cao',
    'ho': 'Ho khan',
    'kho tho': 'Khó thở',
    'dau bung': 'Đau bụng',
    'dau nguc': 'Đau ngực',
    'nôn': 'Buồn nôn, nôn',
    'tieu chay': 'Tiêu chảy',
    'dau dau': 'Đau đầu',

    // Tiền sử
    'ths': 'Tiền sử hút thuốc',
    'tsgd': 'Tiền sử gia đình',
    'tsbt': 'Tiền sử bản thân',
    'cao huyet ap': 'Tăng huyết áp',
    'tieu duong': 'Đái tháo đường',
    'tim mach': 'Bệnh tim mạch',

    // Khám thực thể
    'bt': 'Bình thường',
    'kbt': 'Không bình thường',
    'kdd': 'Không di động',
    'dd': 'Di động',
    'ck': 'Co cứng',
    'ddk': 'Đau dữ dội',
    'n': 'Đau nhẹ',
    'v': 'Đau vừa',

    // Xử trí
    'ks': 'Kháng sinh',
    'gs': 'Giảm đau',
    'hs': 'Hạ sốt',
    'crs': 'Chống viêm',
    'td': 'Theo dõi',
    'tn': 'Truyền nước',
    'xk': 'Xét nghiệm',
    'cdha': 'Chẩn đoán hình ảnh'
};

export const SMART_REPLACEMENTS = {
    // Pattern matching với regex
    patterns: [
        { pattern: /sot\s*cao?/gi, replacement: 'Sốt cao' },
        { pattern: /ho\s*khan?/gi, replacement: 'Ho khan' },
        { pattern: /kho\s*tho?/gi, replacement: 'Khó thở' },
        { pattern: /dau\s*bung?/gi, replacement: 'Đau bụng' },
        { pattern: /buon\s*non?/gi, replacement: 'Buồn nôn' },
        { pattern: /tieu\s*chay?/gi, replacement: 'Tiêu chảy' }
    ]
};
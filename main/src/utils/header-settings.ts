import axios from 'axios';

export interface HeaderSettings {
    bishopName: string;
    bishopPhone: string;
    execSecName: string;
    execSecPhone: string;
    fheTime: string;
    stakeTime: string;
    churchTime: string;
}

interface HeaderSettingRow {
    key: string;
    value: string;
}

const KEY_MAP: Record<string, keyof HeaderSettings> = {
    bishop_name: 'bishopName',
    bishop_phone: 'bishopPhone',
    exec_sec_name: 'execSecName',
    exec_sec_phone: 'execSecPhone',
    fhe_time: 'fheTime',
    stake_time: 'stakeTime',
    church_time: 'churchTime'
};

export const getHeaderSettings = async (): Promise<Partial<HeaderSettings>> => {
    const { data } = await axios.get<HeaderSettingRow[]>('/api/header-settings');
    const rows = Array.isArray(data) ? data : [];

    return rows.reduce<Partial<HeaderSettings>>((settings, row) => {
        const field = KEY_MAP[row.key];
        if (field) settings[field] = row.value;
        return settings;
    }, {});
};

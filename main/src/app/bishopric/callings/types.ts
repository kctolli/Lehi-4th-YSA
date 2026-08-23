export interface Calling {
    id: number;
    person_name: string;
    calling_name: string;
    organization: string | null;
    approved: boolean;
    in_lcr: boolean;
    in_lcr_at: string | null;
    submitted_at: string | null;
    date_extended: string | null;
    date_sustained: string | null;
    date_set_apart: string | null;
    date_released: string | null;
    date_rejected: string | null;
    notes: string | null;
}

export interface CallingFormValues {
    person_name: string;
    calling_name: string;
    organization?: string;
    approved?: boolean;
    in_lcr?: boolean;
    date_extended?: boolean;
    date_sustained?: boolean;
    date_set_apart?: boolean;
    date_released?: boolean;
    date_rejected?: boolean;
    notes?: string;
}

export const DATE_FIELDS: { key: keyof Pick<CallingFormValues, 'date_extended' | 'date_sustained' | 'date_set_apart' | 'date_released' | 'date_rejected'>; label: string }[] = [
    { key: 'date_extended', label: 'Extended' },
    { key: 'date_sustained', label: 'Sustained' },
    { key: 'date_set_apart', label: 'Set Apart' },
    { key: 'date_released', label: 'Released' },
    { key: 'date_rejected', label: 'Rejected' }
];

export const STATUSES: { value: string; label: string; color: string }[] = [
    { value: 'pending', label: 'Proposed', color: 'default' },
    { value: 'approved', label: 'Approved', color: 'cyan' },
    { value: 'extended', label: 'Extended', color: 'orange' },
    { value: 'sustained', label: 'Sustained', color: 'blue' },
    { value: 'set_apart', label: 'Set Apart', color: 'green' },
    { value: 'in_lcr', label: 'In LCR', color: 'purple' },
    { value: 'released', label: 'Released', color: 'default' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
];

export const STATUS_BY_VALUE = new Map(STATUSES.map((status, index) => [status.value, { ...status, rank: index }]));

export const getStatusValue = (calling: Calling): string => {
    if (calling.date_rejected) return 'rejected';
    if (calling.date_released) return 'released';
    if (calling.in_lcr) return 'in_lcr';
    if (calling.date_set_apart) return 'set_apart';
    if (calling.date_sustained) return 'sustained';
    if (calling.date_extended) return 'extended';
    if (calling.approved) return 'approved';
    return 'pending';
};

export const getStatus = (calling: Calling) => STATUS_BY_VALUE.get(getStatusValue(calling)) ?? STATUS_BY_VALUE.get('pending')!;

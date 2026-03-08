const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Auto-prepend slash if missing
    const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Fetch Error [${url}]:`, error);
        throw error;
    }
}

export const campaignsApi = {
    list: () => apiFetch('/campaigns'),
    listQueue: () => apiFetch('/campaigns/queue'),
    get: (id: string) => apiFetch(`/campaigns/${id}`),
    create: (data: any) => apiFetch('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiFetch(`/campaigns/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => apiFetch(`/campaigns/${id}`, { method: 'DELETE' }),
};

export const leadsApi = {
    list: (params?: { stage?: string; campaignId?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return apiFetch(`/leads?${query}`);
    },
    get: (id: string) => apiFetch(`/leads/${id}`),
    getTimeline: (id: string) => apiFetch(`/leads/${id}/timeline`),
    update: (id: string, data: any) => apiFetch(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    updateStage: (id: string, stage: string) => apiFetch(`/leads/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
    delete: (id: string) => apiFetch(`/leads/${id}`, { method: 'DELETE' }),
};

export const emailSequencesApi = {
    list: () => apiFetch('/email-sequences'),
    create: (data: any) => apiFetch('/email-sequences', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/email-sequences/${id}`, { method: 'DELETE' }),
};

export const agentsApi = {
    list: () => apiFetch('/agents'),
};

export const incidentsApi = {
    list: () => apiFetch('/incidents'),
};

export const metricsApi = {
    getOverview: () => apiFetch('/maintenance/metrics'), // Placeholder if exists
};

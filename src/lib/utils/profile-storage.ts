// Profile data type
export interface ProfileData {
    name: string;
    gender: 'male' | 'female';
    birthDate: string; // YYYY-MM-DD format
    birthTime: string; // HH:mm format
    calendarType: 'solar' | 'lunar';
}

const STORAGE_KEY = 'saju_user_profile';

/**
 * Save user profile to localStorage
 */
export function saveProfile(data: ProfileData): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save profile:', error);
    }
}

/**
 * Get saved user profile from localStorage
 */
export function getProfile(): ProfileData | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as ProfileData;
    } catch (error) {
        console.error('Failed to load profile:', error);
        return null;
    }
}

/**
 * Clear saved user profile
 */
export function clearProfile(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear profile:', error);
    }
}

/**
 * Check if profile exists
 */
export function hasProfile(): boolean {
    return getProfile() !== null;
}

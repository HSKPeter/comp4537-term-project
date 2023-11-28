import { API_PATHS, axiosInstance } from "./httpUtils";
import { LOCAL_STORAGE_KEYS } from "./locaStorageUtils";

export function getUserRoleFromCache() {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.role);
}

export async function getUserRole() {
    try {
        const response = await axiosInstance.get(API_PATHS.role);
        const { role } = response.data;
        if (role) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.role, role);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.role);
        }
        return role;
    } catch (error) {
        return undefined;
    }
}


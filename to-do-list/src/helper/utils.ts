import {useUserStore} from "@/stores/user.store.ts";
import {jwtPayload, type TokensResponse} from "@/types/auth.schema.ts";
import {jwtDecode} from "jwt-decode";
import {refresh} from "@/lib/api/auth.api.ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

dayjs.extend(utc);
dayjs.extend(timezone);

const viTimezone = "Asia/Ho_Chi_Minh"
const dateFormat = "DD/MM/YYYY"
const timeFormat = "DD/MM/YYYY HH:mm:ss"

/**
 * Format ISO date string or Date object to Vietnam timezone readable string.
 * Returns "-" if date is null/undefined or invalid.
 * @param date string | Date | undefined | null
 * @param withTime whether to include time, default true
 */
export function formatVNDate(
    date?: string | Date | null,
    withTime = false
): string {
    if (!date) return "-";

    const d = dayjs(date);
    if (!d.isValid()) return "-";

    return d
        .tz(viTimezone)
        .format(withTime ? timeFormat : dateFormat);
}

export function formatDate(date: string | Date, format = "YYYY-MM-DD"): string {
    return dayjs(date).tz(viTimezone).format(format);
}

export function today() {
    return new Date().toISOString().split("T")[0]
}

export function fieldLabel(field: string) {
    return field
        .replace(/([A-Z])/g, " $1") // insert space before capital letters
        .replace(/^./, str => str.toUpperCase()); // capitalize first letter
}

export async function getAccessToken(): Promise<string | null> {
    const userStore = useUserStore();

    // Lấy token từ store hoặc cookie
    let token = userStore.token || (getCookie("access_token"));
    if (token) {
        try {
            const payload = jwtPayload.parse(jwtDecode(token));
            // Nếu token còn hạn → return ngay
            if (payload.exp * 1000 > Date.now()) {
                return token;
            }
        } catch (error) {
            console.error("Failed to parse access token payload", error);
        }
    }

    // Lấy refresh token
    let refreshToken = userStore.claims ? getCookie("refresh_token") : getCookie("refresh_token");
    if (!refreshToken) return null;

    // Tránh race condition khi refresh
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refresh({refreshToken})
            .then((response: TokensResponse) => {
                const {accessToken: newAccessToken, refreshToken: newRefreshToken} = response;

                // Cập nhật UserStore + Cookie
                userStore.setToken(newAccessToken);
                setCookie("refresh_token", newRefreshToken, 7);

                return newAccessToken;
            })
            .catch((error: any) => {
                console.error("Failed to refresh token", error);
                userStore.logout(); // logout nếu refresh thất bại
                return null;
            })
            .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

// --------------------
// Get cookie by name
// --------------------
export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]!) : null;
}

// --------------------
// Set cookie
// --------------------
export function setCookie(name: string, value: string, days = 7): void {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// --------------------
// Remove cookie
// --------------------
export function removeCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-1; path=/`;
}

import {userClaims, type UserClaims} from "@/types/auth.schema.ts"
import {defineStore} from "pinia";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export const useUserStore = defineStore("user", {
    state: () => ({
        token: "",
        claims: {} as UserClaims,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        // --- Trigger when sign-in ---
        setToken(token: string) {
            this.token = token;
            Cookies.set("access_token", token, {expires: 7, path: "/"});
            this.parseToken(token);
        },

        setClaims(claims: UserClaims) {
            this.claims = claims;
        },

        setUser(token: string, claims: UserClaims) {
            this.token = token;
            this.claims = claims;
            Cookies.set("access_token", token, {expires: 7, path: "/"});
        },

        logout() {
            this.token = "";
            this.claims = {} as UserClaims;
            Cookies.remove("access_token", {path: "/"});
        },

        // --- Parse token from JWT + Zod validation ---
        parseToken(token: string) {
            try {
                const decoded = jwtDecode<UserClaims>(token);
                this.claims = userClaims.parse(decoded);
            } catch (error) {
                console.error("Invalid token", error);
                this.claims = {} as UserClaims;
                this.token = "";
                Cookies.remove("access_token", {path: "/"});
            }
        },

        // --- Auto load token form cookie when app start ---
        initializeFromCookie() {
            const token = Cookies.get("access_token");
            if (token) {
                this.token = token;
                this.parseToken(token);
            }
        }
    }
});

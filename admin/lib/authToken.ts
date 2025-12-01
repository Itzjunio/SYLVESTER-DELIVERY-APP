
let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

export const getAuthToken = () => accessToken;


if (typeof window !== "undefined") {
  window.addEventListener("refreshToken", (e: any) => {
    setAuthToken(e.detail);
  });
}

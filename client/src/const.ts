export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  if (!oauthPortalUrl) return "#";
  
  // Limpar variáveis de possíveis espaços ou quebras de linha
  const cleanPortalUrl = oauthPortalUrl.trim();
  const cleanAppId = (appId || "").trim();
  
  const loginUrl = `${cleanPortalUrl}/app-auth?appId=${encodeURIComponent(cleanAppId)}&redirectUri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&type=signIn`;
  
  return loginUrl;
};

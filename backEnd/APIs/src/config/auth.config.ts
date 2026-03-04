// Clé secrète pour signer les tokens JWT
// En production, utilisez une variable d'environnement: process.env.JWT_SECRET
export const authConfig = {
  secret: "Manu-yeye-glace-so-lome-alo-gaou-kpedi-lecampus-kpamé!",
  accessTokenExpiresIn: "15m", // Access token valide 15 minutes
  refreshTokenExpiresIn: "7d", // Refresh token valide 7 jours
};

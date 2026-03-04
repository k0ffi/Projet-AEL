// Clé secrète pour signer les tokens JWT
// En production, utilisez une variable d'environnement: process.env.JWT_SECRET
export const authConfig = {
  secret: "Manu-yeye-glace-so-lome-alo-gaou-kpedi-lecampus-kpamé!",
  expiresIn: "1h", // Token valide 1 heure (autres options: "15m", "7d", etc.)
};

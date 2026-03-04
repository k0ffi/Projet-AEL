export interface user {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  email: string;
  password: string; // Mot de passe hashé
  token: string | null; // Access token JWT ou null si déconnecté
  refreshToken: string | null; // Refresh token JWT ou null si déconnecté
  contrats: string[]; // Tableau des IDs de contrats
}

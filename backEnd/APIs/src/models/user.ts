export interface user {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  email: string;
  password: string; // Mot de passe hashé
  token: string | null; // Token JWT ou null si déconnecté
}

/**
 * Modèle de données pour les contrats
 * Ce modèle correspond à la structure du backend (backEnd/APIs/src/models/contrat.ts)
 */

// Données de consommation pour le graphique
export interface DonneesConsommation {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    data: number[];
  }[];
}

// Information du contrat
export interface InformationContrat {
  reference: number;
  contrat_name: string;
  activite: string;
  date_souscription: string; // Format: DD/MM/YYYY
  adresse: string;
}

// Facture associée au contrat
export interface Facture {
  montant: number;
  reference: string;
  date_facture?: string;
}

// Contrat complet (structure identique au backend)
export interface Contrat {
  id: string;
  userId: string; // ID de l'utilisateur propriétaire du contrat
  information: InformationContrat;
  consommation: DonneesConsommation;
  facture: Facture;
  date_creation: string;
  date_modification: string;
}

// Type pour la création d'un nouveau contrat (sans id ni dates)
export type CreateContratDto = Omit<Contrat, 'id' | 'date_creation' | 'date_modification'>;

// Type pour la mise à jour d'un contrat
export type UpdateContratDto = Partial<Omit<Contrat, 'id' | 'userId' | 'date_creation'>>;

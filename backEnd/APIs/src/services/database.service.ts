import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fs from "fs/promises";

type DBObject = {
  id?: number | string;
};

type DatabaseSchema = {
  users: DBObject[];
};

// Default data for the database
const defaultData: DatabaseSchema = {
  users: [],
};

class DBprocess<T extends DBObject> {
  private db: Low<DatabaseSchema> | null = null;
  private collectionName: keyof DatabaseSchema = "users";

  /**
   * Initialise la connexion à la base de données lowdb
   * @param filePath - Chemin vers le fichier JSON
   * @param collection - Nom de la collection (table)
   */
  async init(
    filePath: string,
    collection: keyof DatabaseSchema = "users",
  ): Promise<void> {
    const adapter = new JSONFile<DatabaseSchema>(filePath);
    this.db = new Low<DatabaseSchema>(adapter, defaultData);
    this.collectionName = collection;
    await this.db.read();

    // Ensure the collection exists
    if (!this.db.data[collection]) {
      this.db.data[collection] = [];
      await this.db.write();
    }
  }

  /**
   * Assure que la base de données est initialisée
   */
  private async ensureDb(): Promise<Low<DatabaseSchema>> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    await this.db.read();
    return this.db;
  }

  /**
   * Lit toutes les données de la collection
   * @returns Tableau de données
   */
  async readData(): Promise<T[]> {
    const db = await this.ensureDb();
    return db.data[this.collectionName] as T[];
  }

  /**
   * Écrit toutes les données dans la collection (écrase le contenu)
   * @param data - Données à écrire
   */
  async writeData(data: T[]): Promise<void> {
    const db = await this.ensureDb();
    db.data[this.collectionName] = data;
    await db.write();
  }

  /**
   * Ajoute de nouvelles données à la collection
   * @param newData - Données à ajouter
   */
  async createData(newData: T): Promise<T> {
    const db = await this.ensureDb();
    const collection = db.data[this.collectionName] as T[];

    // Generate new ID if not provided
    if (!newData.id) {
      const maxId = collection.reduce((max, item) => {
        const itemId =
          typeof item.id === "number"
            ? item.id
            : parseInt(item.id as string, 10);
        return itemId > max ? itemId : max;
      }, 0);
      newData.id = maxId + 1;
    }

    collection.push(newData);
    await db.write();
    return newData;
  }

  /**
   * Supprime des données par ID
   * @param id - ID de l'élément à supprimer
   */
  async deleteById(id: string): Promise<void> {
    const db = await this.ensureDb();
    const collection = db.data[this.collectionName] as T[];
    const index = collection.findIndex((item) => item.id?.toString() === id);

    if (index !== -1) {
      collection.splice(index, 1);
      await db.write();
    } else {
      throw new Error(`L'élément avec l'id: ${id} n'existe pas`);
    }
  }

  /**
   * Met à jour des données par ID
   * @param id - ID de l'élément à mettre à jour
   * @param updatedData - Nouvelles données (partielles)
   */
  async updateById(id: string, updatedData: Partial<T>): Promise<T | null> {
    const db = await this.ensureDb();
    const collection = db.data[this.collectionName] as T[];
    const index = collection.findIndex((item) => item.id?.toString() === id);

    if (index !== -1) {
      // Merge existing data with new data
      const existingItem = collection[index];
      const updatedItem = { ...existingItem, ...updatedData } as T;
      collection[index] = updatedItem;
      await db.write();
      return updatedItem;
    } else {
      throw new Error(`L'élément avec l'id: ${id} n'existe pas`);
    }
  }

  /**
   * Recherche un élément par ID
   * @param id - ID de l'élément à rechercher
   */
  async findById(id: string): Promise<T | null> {
    const db = await this.ensureDb();
    const collection = db.data[this.collectionName] as T[];
    return collection.find((item) => item.id?.toString() === id) || null;
  }

  /**
   * Recherche des éléments par critère
   * @param predicate - Fonction de recherche
   */
  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const db = await this.ensureDb();
    const collection = db.data[this.collectionName] as T[];
    return collection.filter(predicate);
  }
}

export default DBprocess;

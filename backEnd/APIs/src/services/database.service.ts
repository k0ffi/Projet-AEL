import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Type générique pour les données
type DatabaseData = {
  users: any[];
  contrats: any[];
};

// Default data for the database
const defaultData: DatabaseData = {
  users: [],
  contrats: [],
};

class DBprocess<T = any> {
  private db: Low<DatabaseData> | null = null;
  private collection: "users" | "contrats" = "users";

  /**
   * Initialise la connexion à la base de données lowdb
   * @param filePath - Chemin vers le fichier JSON
   * @param collection - Nom de la collection (users ou contrats)
   */
  async init(
    filePath: string,
    collection: "users" | "contrats" = "users",
  ): Promise<void> {
    const adapter = new JSONFile<DatabaseData>(filePath);
    this.db = new Low<DatabaseData>(adapter, defaultData);
    this.collection = collection;
    await this.db.read();

    // Ensure collections exist
    if (!this.db.data.users) {
      this.db.data.users = [];
    }
    if (!this.db.data.contrats) {
      this.db.data.contrats = [];
    }
    await this.db.write();
  }

  /**
   * Assure que la base de données est initialisée
   */
  private async ensureDb(): Promise<Low<DatabaseData>> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    await this.db.read();
    return this.db;
  }

  /**
   * Lit toutes les données de la collection
   */
  async readData(): Promise<T[]> {
    const db = await this.ensureDb();
    return db.data[this.collection] as T[];
  }

  /**
   * Lit toutes les données (toutes les collections)
   */
  async readAllData(): Promise<DatabaseData> {
    const db = await this.ensureDb();
    return db.data;
  }

  /**
   * Écrit toutes les données dans la collection
   */
  async writeData(data: T[]): Promise<void> {
    const db = await this.ensureDb();
    (db.data[this.collection] as any) = data;
    await db.write();
  }

  /**
   * Écrit toutes les données
   */
  async writeAllData(data: DatabaseData): Promise<void> {
    const db = await this.ensureDb();
    db.data = data;
    await db.write();
  }

  /**
   * Ajoute de nouvelles données à la collection
   */
  async createData(newData: T): Promise<T> {
    const db = await this.ensureDb();
    const collection = db.data[this.collection] as any[];

    // Generate new ID if not provided
    if (!newData.id) {
      let maxId = 0;
      let existingIdIsNumber = false;

      for (const item of collection) {
        if (item.id !== undefined) {
          const itemId =
            typeof item.id === "number"
              ? item.id
              : parseInt(item.id as string, 10);
          if (!isNaN(itemId)) {
            if (typeof item.id === "number") {
              existingIdIsNumber = true;
            }
            maxId = itemId > maxId ? itemId : maxId;
          }
        }
      }

      // Return same type as existing IDs
      (newData as any).id = existingIdIsNumber ? maxId + 1 : String(maxId + 1);
    }

    collection.push(newData);
    await db.write();
    return newData;
  }

  /**
   * Supprime des données par ID
   */
  async deleteById(id: string): Promise<void> {
    const db = await this.ensureDb();
    const collection = db.data[this.collection] as any[];
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
   */
  async updateById(id: string, updatedData: Partial<T>): Promise<T | null> {
    const db = await this.ensureDb();
    const collection = db.data[this.collection] as any[];
    const index = collection.findIndex((item) => item.id?.toString() === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updatedData };
      await db.write();
      return collection[index];
    }
    throw new Error(`L'élément avec l'id: ${id} n'existe pas`);
  }

  /**
   * Recherche un élément par ID
   */
  async findById(id: string): Promise<T | null> {
    const db = await this.ensureDb();
    const collection = db.data[this.collection] as any[];
    return collection.find((item) => item.id?.toString() === id) || null;
  }

  /**
   * Recherche des éléments par critère
   */
  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const db = await this.ensureDb();
    const collection = db.data[this.collection] as T[];
    return collection.filter(predicate);
  }
}

export default DBprocess;

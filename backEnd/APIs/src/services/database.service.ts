import fs from "fs/promises";

type DBObject = {
  id?: number | string;
};

class DBprocess<T extends DBObject> {
  /**
   * Lit les données depuis un fichier JSON
   * @param path - Chemin vers le fichier JSON
   * @returns Tableau de données
   */
  async readData(filePath: string): Promise<T[]> {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as T[];
    } catch (error) {
      // Si le fichier n'existe pas, retourner un tableau vide
      return [];
    }
  }

  /**
   * Écrit des données dans un fichier JSON (écrase le contenu)
   * @param filePath - Chemin vers le fichier JSON
   * @param data - Données à écrire
   */
  async writeData(filePath: string, data: T[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  /**
   * Ajoute de nouvelles données au fichier JSON
   * @param filePath - Chemin vers le fichier JSON
   * @param newData - Données à ajouter
   */
  async createData(filePath: string, newData: T): Promise<T> {
    const dbData = await this.readData(filePath);

    // Générer un nouvel ID si non fourni
    if (!newData.id) {
      const maxId = dbData.reduce((max, item) => {
        const itemId =
          typeof item.id === "number"
            ? item.id
            : parseInt(item.id as string, 10);
        return itemId > max ? itemId : max;
      }, 0);
      newData.id = maxId + 1;
    }

    dbData.push(newData);
    await this.writeData(filePath, dbData);
    return newData;
  }

  /**
   * Supprime des données par ID
   * @param filePath - Chemin vers le fichier JSON
   * @param id - ID de l'élément à supprimer
   */
  async deleteById(filePath: string, id: string): Promise<void> {
    const dbData = await this.readData(filePath);
    const index = dbData.findIndex((item) => item.id?.toString() === id);

    if (index !== -1) {
      dbData.splice(index, 1);
      await this.writeData(filePath, dbData);
    } else {
      throw new Error(`L'élément avec l'id: ${id} n'existe pas`);
    }
  }

  /**
   * Met à jour des données par ID
   * @param filePath - Chemin vers le fichier JSON
   * @param id - ID de l'élément à mettre à jour
   * @param updatedData - Nouvelles données (partielles)
   */
  async updateById(
    filePath: string,
    id: string,
    updatedData: Partial<T>,
  ): Promise<T | null> {
    const dbData = await this.readData(filePath);
    const index = dbData.findIndex((item) => item.id?.toString() === id);

    if (index !== -1) {
      // Fusionner les données existantes avec les nouvelles
      const existingItem = dbData[index];
      const updatedItem = { ...existingItem, ...updatedData } as T;
      dbData[index] = updatedItem;
      await this.writeData(filePath, dbData);
      return updatedItem;
    } else {
      throw new Error(`L'élément avec l'id: ${id} n'existe pas`);
    }
  }

  /**
   * Recherche un élément par ID
   * @param filePath - Chemin vers le fichier JSON
   * @param id - ID de l'élément à rechercher
   */
  async findById(filePath: string, id: string): Promise<T | null> {
    const dbData = await this.readData(filePath);
    return dbData.find((item) => item.id?.toString() === id) || null;
  }

  /**
   * Recherche des éléments par critère
   * @param filePath - Chemin vers le fichier JSON
   * @param predicate - Fonction de recherche
   */
  async findBy(
    filePath: string,
    predicate: (item: T) => boolean,
  ): Promise<T[]> {
    const dbData = await this.readData(filePath);
    return dbData.filter(predicate);
  }
}

export default DBprocess;

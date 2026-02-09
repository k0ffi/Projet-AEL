import { JSONFilePreset } from "lowdb/node";

const db = await JSONFilePreset("db.json", { users: [] });

import fs from "fs/promises";
type DBObject = {
  id?: Number;
};

class DBprocess<T extends DBObject> {
  async readData(path: string): Promise<T[]> {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data) as T[];
  }

  async writeData(path: string, data: T): Promise<void> {
    const dbData = await this.readData(path);
    dbData.push(data);
    await fs.writeFile(path, JSON.stringify(dbData), "utf-8");
  }

  async deleteById(path: string, id: string): Promise<void> {
    const dbData = await this.readData(path);
    const index = dbData.findIndex((items) => items.id?.toString() === id);
    if (index !== -1) {
      dbData.splice(index, 1);
      await fs.writeFile(path, JSON.stringify(dbData), "utf-8");
    } else {
      throw new Error(`le joueur avec l'id  : ${id} n'existe pas`);
    }
  }
}

export default DBprocess;

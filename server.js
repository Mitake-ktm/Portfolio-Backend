const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const getFilePath = (file) => path.join(__dirname, file);

const readData = (file) =>
  new Promise((resolve, reject) => {
    fs.readFile(getFilePath(file), "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data || "[]"));
    });
  });

const writeData = (file, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(getFilePath(file), JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const createCRUD = (file, route) => {
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const data = await readData(file);
      res.json(data);
    } catch {
      res.status(500).send(`Erreur lecture ${file}`);
    }
  });

  app.post(`/api/${route}`, async (req, res) => {
    try {
      const data = await readData(file);
      const newItem = { id: data.length + 1, ...req.body };
      data.push(newItem);
      await writeData(file, data);
      res.status(201).json(newItem);
    } catch {
      res.status(500).send(`Erreur écriture ${file}`);
    }
  });
};

createCRUD("chapters.json", "chapters");

createCRUD("webnovels.json", "webnovels");

createCRUD("projects.json", "projects");

createCRUD("otherProjects.json", "other-projects");

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

//Importação do Express (Framework mimificado)
const express = require("express");

//Importação do Recurso de Origem Cruzada
const cors = require("cors");

//Importação da biblioteca UUID para geração de um Id Único Universal
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

//Instanciação da aplicação
const app = express();

//Definição da porta
app.set('PORT', 3333);

//Definição do Express.JSON() como middleware do app para interceptação de JSON 
app.use(express.json());

//Definição do CORS como middleware no app para permitir o acesso externo aos recursos do Back-end
app.use(cors());



const repositories = [];

/**
 * Método [GET]
 * 
 * Parâmetros de Rota: [NENHUM]
 * Retorno: [Lista de repostórios] (200 - OK)
 */
app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

/**
 * Método [POST]
 * 
 * Parâmetros do Corpo: [Title, Url, Techs]
 *
 * Retorno: [Repositório criado] (200 - OK)
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

/**
 * Método [PUT]
 * 
 * Parâmetros da Rota: [Id]
 * Parâmetros do Corpo: [Title, Url, Techs]
 * 
 * Retorno: [Repositório atualizado] (201 - OK)
 */
app.put("/repositories/:id", (request, response) => {
  const { id = null } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "This id isn't valid!" });
  }

  repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Don't exist this Id repository!" });

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.status(201).json(repository);
});

/**
 * Método [DELETE]
 * 
 * Parâmetros da Rota: [Id]
 * 
 * Retorno: [Repositório deletado] (204 - Not Content)
 */
app.delete("/repositories/:id", (request, response) => {
  const { id = null } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "This id isn't valid!" });
  }

  repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Don't exist this Id repository!" });

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

/**
 * Método [POST]
 * 
 * Parâmetros da Rota: [:Id/like]
 * 
 * Retorno: [Repositório atualizado] (200 - Ok)
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "This id isn't valid!" });
  }

  repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Don't exist this Id repository!" });

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;

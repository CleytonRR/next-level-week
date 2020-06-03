import express from "express";
const routes = express.Router();
import knex from "./database/connection";

routes.get("/items", async (request, response) => {
  const items = await knex("items").select("*");
  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.name,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });
  return response.json(serializedItems);
});

routes.post("/points", async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = request.body;

  const trx = await knex.transaction();

  const insertIds = await trx("points").insert({
    image: "image-fake",
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const point_id = insertIds[0];

  const pointItems = items.map((item_id: Number) => {
    return {
      item_id,
      point_id,
    };
  });

  await trx("point_items").insert(pointItems);

  return response.json({ sucess: true });
});

export default routes;

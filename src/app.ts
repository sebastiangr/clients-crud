import express from "express";
import http from "http";
import io from "./lib/server/socket";

const app = express();
const server = http.createServer(app);
io.attach(server);

server.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const request = supertest("http://localhost:3000");

let testCartId = null;
let authCookie = "";

describe("🛒 Functional Tests - Cart Routes", () => {

  // Crear un nuevo carrito
  it("✅ Debe crear un nuevo carrito", async () => {
    const response = await request.post("/api/carts");
    expect(response.status).to.equal(201);
    expect(response.body.cart).to.have.property("_id");
    testCartId = response.body.cart._id;
  });

  // Obtener carrito por ID
  it("✅ Debe obtener el carrito por ID", async () => {
    const response = await request.get(`/api/carts/${testCartId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("_id", testCartId);
  });

  it("✅ Debe agregar un producto al carrito", async () => {
    const login = await request.post("/api/users/login").send({
      email: "franco@mail.com",
      password: "123456"
    });
  
    authCookie = login.headers["set-cookie"]?.[0];
    expect(authCookie).to.exist;
  
    // obtenemos ID de producto desde la API
    const products = await request.get("/api/products");
    const productId = products.body[0]?._id;
    expect(productId).to.exist;
  
    const response = await request
      .post(`/api/carts/${testCartId}/products`)
      .set("Cookie", authCookie)
      .send({ productId, quantity: 1 });
  
    expect(response.status).to.equal(200);
  });
  
  it("✅ Debe vaciar el carrito", async () => {
    const response = await request
      .delete(`/api/carts/${testCartId}`)
      .set("Cookie", authCookie); // ✅ lo usamos aquí también
  
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Carrito vaciado");
  });

  // Carrito no encontrado
  it("❌ Debe dar error si el carrito no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request.get(`/api/carts/${fakeId}`);
    expect(response.status).to.equal(404);
  });
});

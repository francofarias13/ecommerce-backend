import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";

dotenv.config();
const request = supertest("http://localhost:3000");

let authCookie = "";
let productId = "";

describe("🧪 Functional Tests - Product Routes", () => {

  // Login como admin
  before(async () => {
    const login = await request.post("/api/users/login").send({
      email: "ailen@mail.com",   // 🛠️ asegurate que exista este admin
      password: "123456"
    });
    authCookie = login.headers["set-cookie"]?.[0];
  });

  it("✅ Debe obtener todos los productos", async () => {
    const res = await request.get("/api/products");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("✅ Debe crear un nuevo producto (admin)", async () => {
    const res = await request
      .post("/api/products")
      .set("Cookie", authCookie)
      .send({
        title: "Producto Test",
        description: "Descripción de prueba",
        price: 100,
        stock: 20,
        category: "test"
      });

    expect(res.status).to.equal(201);
    expect(res.body.product).to.have.property("_id");
    productId = res.body.product._id;
  });

  it("✅ Debe obtener el producto por ID", async () => {
    const res = await request.get(`/api/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", productId);
  });

  it("✅ Debe actualizar el producto (admin)", async () => {
    const res = await request
      .put(`/api/products/${productId}`)
      .set("Cookie", authCookie)
      .send({ price: 150 });

    expect(res.status).to.equal(200);
    expect(res.body.updatedProduct.price).to.equal(150);
  });

  it("✅ Debe eliminar el producto (admin)", async () => {
    const res = await request
      .delete(`/api/products/${productId}`)
      .set("Cookie", authCookie);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("eliminado");
  });

  it("❌ Debe devolver 404 si el producto no existe", async () => {
    const res = await request.get("/api/products/000000000000000000000000");
    expect(res.status).to.equal(404);
  });
});

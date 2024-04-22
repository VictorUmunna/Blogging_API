const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const userModel = require("../models/userModel");
require("dotenv").config();

describe("Owner Routes", () => {
  beforeEach(async () => {
    mongoose.connect(process.env.MONGODB_URL);
  });
  afterEach(async () => {
    await mongoose.connection.close();
  });
  test("POST /api/blog/create", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };

    const response = await api.post("/api/login").send(loginDetails);

    const token = response.body.token;
    console.log(token);
    const articleDetails = {
      title: "Title 2",
      description: "description 2",
      body: "body 2",
      tags: ["tag 2"],
    };
    const result = await api
      .post("/api/blog/create")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(articleDetails)
      .expect(201);

    expect(result.body).toHaveProperty("message");
    expect(result.body).toHaveProperty("status");
    expect(result.body.message).toBe("Artcle created successfully");
  }, 30000);
  test("GET /api/blog/me/get", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api.post("/api/login").send(loginDetails);
    expect(response.body).toHaveProperty("token");
    const token = response.body.token;

    const result = await api
      .get("/api/blog/me/get?state=draft&limit=1")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`);

    expect(result.status).toBe(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("PATCH /api/blog/me/edit/:id", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api.post("/api/login").send(loginDetails);

    const token = response.body.token;

    const body = {
      body: "Lo Various have evolved over the years sometimes by accident, sometimes will uncover many web still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes will",
    };
    const result = await api
      .patch("/api/blog/me/edit/63665e32fce3e3e8019166be")
      .set("content-type", "application/json")

      .set("Authorization", `bearer ${token}`)
      .send(body)
      .expect(200);

    expect(result.body.body).toBe(body.body);
    expect(result.body).toHaveProperty("reading_time");
  }, 30000);
  test("PATCH /api/blog/me/edit/state/:id", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api.post("/api/login").send(loginDetails);
    const token = response.body.token;
    const state = { state: "published" };
    const result = await api
      .patch("/api/blog/me/edit/state/63674ce635271b110cff06d7")
      .set("content-type", "application/json")

      .set("Authorization", `bearer ${token}`)
      .send(state)
      .expect(200);
    expect(result.body.state).not.toContain("draft");
  }, 30000);
  test("GET /api/blog/me/publish/:id", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api.post("/api/login").send(loginDetails);
    const token = response.body.token;
    const result = await api
      .get("/api/blog/me/publish/6367428a1886fb17bb249e29")
      .set("content-type", "application/json")

      .set("Authorization", `bearer ${token}`)

      .expect(200);
    expect(result.body.state).toBe("published");
  }, 30000);
  test("DELETE /api/blog/me/delete/:id", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api.post("/api/login").send(loginDetails);
    const token = response.body.token;
    const result = await api
      .delete("/api/blog/me/delete/63674ce635271b110cff06d7")
      .set("content-type", "application/json")

      .set("Authorization", `bearer ${token}`)

      .expect(200);
    expect(result.body.message).toBe("Article deleted successfully");
  }, 30000);
});

describe("Public Routes", () => {
  beforeEach(async () => {
    mongoose.connect(process.env.MONGODB_URL);
  });
  afterEach(async () => {
    await mongoose.connection.close();
  });
  test("GET /api/blog/publish/:id", async () => {
    const result = await api
      .get("/api/blog/publish/6367428a1886fb17bb249e29")
      .set("content-type", "application/json")
      .expect(200);

    expect(result.body).toHaveProperty("state");
    expect(result.body.state).toBe("published");
  }, 30000);
  test("GET /api/blog/list?firstname=Munir", async () => {
    const result = await api
      .get("/api/blog/list?firstname=Munir")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("GET /api/blog/list?last_name=Abdullahi", async () => {
    const result = await api
      .get("/api/blog/list?lastname=Abdullahi")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("GET /api/blog/list?title=Learn python", async () => {
    const result = await api
      .get("/api/blog/list?title=Learn python")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
  }, 30000);
  test("GET /api/blog/list?read_count=asc", async () => {
    const result = await api
      .get("/api/blog/list?read_count=asc")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("GET /api/blog/list?reading_time=asc", async () => {
    const result = await api
      .get("/api/blog/list?reading_time=asc")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("GET /api/blog/list?timestamp=asc", async () => {
    const result = await api
      .get("/api/blog/list?timestamp=asc")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
  test("GET /api/blog/list?firstname=Munir&lastname=Abdullahi", async () => {
    const result = await api
      .get("/api/blog/list?firstname=Munir&lastname=Abdullahi")
      .set("content-type", "application/json")
      .expect(200);
    expect.arrayContaining(result.body);
    expect(result.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  }, 30000);
});
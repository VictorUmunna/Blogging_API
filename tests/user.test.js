const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
require('dotenv').config()

describe("User Route", () => {
    beforeEach(async () => {
    mongoose.connect(process.env.MONGODB_URL);
  });
  afterEach(async () => {
    await mongoose.connection.close();
  });
  it("POST api/signup works", async () => {
    const userData = {
      first_name: "first_name 2",
      last_name: "last_name 2",
      email: "email 2",
      password: "password 2",
    };
    const response = await api
      .post("/api/signup")
      .send(userData)
      .expect(201);

    expect(response.body).toBeTruthy();
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("first_name");
    expect(response.body.user).toHaveProperty("last_name");
    expect(response.body.user).toHaveProperty("password");

    const user = await userModel.findOne({ first_name: userData.first_name });
    expect(user).toBeTruthy();
    expect(user.email).toBe(userData.email);
  }, 30000);

  it("POST api/login works", async () => {
    const loginDetails = {
      email: "email 1",
      password: "Password 1",
    };
    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  }, 30000);
});
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");
const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const authController = require("../controllers/auth");
const bcrypt = require("bcryptjs");
const APP_SECRET = process.env.APP_SECRET;
const jwt = require("jsonwebtoken");
chai.use(chaiHttp);
const { expect, request } = chai;

describe("Authorization Controller - Signup and Login", function() {
  this.timeout("5s");
  let requester;
  before(async function() {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
    requester = await request(app).keepOpen();
  });

  it("Should create a user, with the hashed password and return 200", async function() {
    await User.deleteMany({});
    const req = {
      name: "Crash Pilot",
      email: "crash@pilot.com",
      password: "testpass"
    };
    sinon.spy(bcrypt, "hash");
    const response = await requester.post("/auth").send(req);
    expect(response).to.have.status(200);
    expect(bcrypt.hash.called).to.be.true;
    bcrypt.hash.restore();
  });

  it("Should throw 422 if user with same email in database", async function() {
    const req = {
      name: "Crash Pilot",
      email: "crash@pilot.com",
      password: "testpass"
    };
    const response = await requester.post("/auth").send(req);
    expect(response).to.have.status(422);
  });

  it("Should throw 404 if user email not found in database", async function() {
    const req = {
      email: "idonotexist@database.com",
      password: "testpass"
    };
    const response = await requester.post("/auth/login").send(req);
    expect(response).to.have.status(404);
  });

  it("Should throw 401 if wrong password", async function() {
    const req = {
      email: "crash@pilot.com",
      password: "nope,wrongpass"
    };
    const response = await requester.post("/auth/login").send(req);
    expect(response).to.have.status(401);
  });

  it("Should return 200 and a signed token with email and userId", async function() {
    const req = {
      email: "crash@pilot.com",
      password: "testpass"
    };
    const user = await User.findOne({ email: req.email });
    const response = await requester.post("/auth/login").send(req);
    expect(response.body).to.have.property("token");
    const decodedToken = jwt.verify(response.body.token, APP_SECRET);
    expect(response).to.have.status(200);
    expect(decodedToken.email).to.be.equal(user.email);
    expect(decodedToken.userId).to.be.equal(user._id.toString());
  });

  after(async function() {
    await mongoose.disconnect();
    await requester.close();
  });
});

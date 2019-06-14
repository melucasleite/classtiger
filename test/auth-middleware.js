require("dotenv").config();
const { expect, assert } = require("chai");
const lectureController = require("../controllers/lecture");
const faker = require("faker");
const mongoose = require("mongoose");
const Lecture = require("../models/lecture");
const isAuth = require("../middleware/is-auth");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

describe("Authorization Middleware", function() {
  it("Should have set the APP_SECRET env_var", function() {
    const APP_SECRET = process.env.APP_SECRET;
    expect(APP_SECRET).to.not.be.undefined;
  });
  it("Should throw an error if no authorization header is present", function() {
    const req = {
      get: () => {
        return undefined;
      }
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("Should throw an error if the token cannot be verified", function() {
    const req = {
      get: function(headerName) {
        return "Bearer xyz";
      }
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });
  it("Should yield a userId after verifying the token with the APP_SECRET", function() {
    const APP_SECRET = process.env.APP_SECRET;
    const token = "valid-token-with-correct-signature";
    const decodedToken = { userId: "abc" };
    const req = {
      get: () => {
        return `Bearer ${token}`;
      }
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns(decodedToken);
    isAuth(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    expect(jwt.verify.args[0][0]).to.be.equal(token);
    expect(jwt.verify.args[0][1]).to.be.equal(APP_SECRET);
    jwt.verify.restore();
  });
});

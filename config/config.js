"use strict";

module.exports = {
  baseUrl: "https://parabank.parasoft.com",
  paths: {
    login: "/parabank/login.htm",
    register: "/parabank/register.htm",
    logout: "/parabank/logout.htm",
    overview: "/parabank/overview.htm"
  },
  credentials: {
    validUsername: "john",
    validPassword: "demo"
  },
  waits: {
    implicit: 10000,
    explicit: 15000,
    pageLoad: 30000
  },
  testData: {
    validRegistration: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "555-123-4567",
      ssn: "123-45-6789",
      password: "SecurePass@123",
      confirmPassword: "SecurePass@123"
    },
    duplicateUsername: "john",
    mismatchedPassword: "DifferentPass@456"
  }
};

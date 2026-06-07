import request from "supertest";

import { describe, it, expect } from "vitest";
import app from "../app";


describe("Auth API", () => {
    it("should register a user", async () => {

        console.log("database url is ", process.env.DATABASE_URL);

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: `test${Date.now()}@example.com`,
                password: "123456"
            });

        console.log(response.status)
        console.log("the response body of should register a user is ", response.body);
        expect(response.status).toBe(201);
        expect(response.body.email).toBeDefined();

    })

    it("should reject invalid password", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: `test${Date.now()}@example.com`,
                password: "123"
            });
        console.log(response.body);
        expect(response.status).toBe(400);

    });

    it("should reject invalid email ", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                email: `test${Date.now()}`,
                password: "12345678"
            });
        console.log(response.body);
        expect(response.status).toBe(400);
    })

    it("should reject duplicate emails", async () => {

        const email = `test${Date.now()}@example.com`;

        await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "123456"
            });

        const response = await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "123456"
            });

        expect(response.status).toBe(400);



    });

    it("should login user", async () => {

        const email = `test${Date.now()}@example.com`;

        await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "123456",
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "123456"
            });

        console.log(response.status)
        console.log("the response body of should login user is ", response.body);
        expect(response.status).toBe(200);


    });

    it("should reject wrong password", async () => {
        const email = `test${Date.now()}@example.com`;

        await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "123456"
            })

        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "anywrongpassword"
            });
        console.log("should reject wrong password's response body is", response.body)
        expect(response.status).toBe(401);

    });

    it("should reject non-existent user ie login without registering first", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: `test${Date.now()}@example.com`,
                password: "123456"
            });

        console.log(response.body)
        expect(response.status).toBe(404);
    });

    it("should reject invalid email format on login", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: `test${Date.now()}`,
                password: "12345678"
            });
        console.log(response.body);
        expect(response.status).toBe(400);
    });

    it("should reject missing password", async () => {
        const email= `test${Date.now()}@example.com`
        await request(app) 
            .post("/auth/register")
            .send({
                email,
                password: "123456"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: undefined
            });

        expect(response.status).toBe()
    })
})


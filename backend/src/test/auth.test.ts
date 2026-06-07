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

        console.log(response.body);
        expect(response.status).toBe(400);

    })

    it("should reject invalid password", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: `test${Date.now()}@example.com`,
                password: "123"
            });
        console.log(response.body);
        expect(response.status).toBe(201);

    });

    it("should  ")
})
 

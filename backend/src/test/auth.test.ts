import request from "supertest";
import app from "../app";
import { describe, it, expect } from "vitest";

describe("Auth API", () => {
    it("should register a user", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "test@example.com",
                password: "123456"
            });

        console.log(response.body);
        expect(response.status).toBe(200);
    })
})
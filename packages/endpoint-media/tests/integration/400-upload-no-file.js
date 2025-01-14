import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if no file included in request", async (t) => {
  const request = await testServer();

  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, "No file included in request");
});

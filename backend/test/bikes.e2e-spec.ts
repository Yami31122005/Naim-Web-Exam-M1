import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DataSource } from "typeorm";
import { AppModule } from "../src/app.module";
import { BikeEntity } from "../src/bikes/entities/bike.entity";
import { configureApp } from "../src/configure-app";
import { BikeSellEntity } from "../src/customers/entities/bike-sell.entity";
import { CustomerEntity } from "../src/customers/entities/customer.entity";
import { databaseOptions } from "../src/database/database-options";
import { fixtureIds, populateShopFixture } from "./fixtures/shop-fixture";

const missingId = "90000000-0000-4000-8000-000000000009";
const validBike = {
  brand: "  Veloria ",
  model: "Trail 2",
  description: "Hardtail trail bike",
  category: "VTT",
  frameMaterial: "Aluminium",
  frameSizeCm: 52,
  wheelSizeInches: 29,
  gearCount: 12,
  weightKg: 13.5,
  electric: false,
  priceCents: 89900,
};

describe("Bikes API", () => {
  let app: INestApplication;
  let database: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useFactory({
        factory: () =>
          new DataSource({
            ...databaseOptions,
            database: ":memory:",
            entities: [CustomerEntity, BikeEntity, BikeSellEntity],
          }).initialize(),
      })
      .compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
    database = app.get(DataSource);
    await populateShopFixture(database);
  });

  afterEach(async () => {
    await app.close();
  });

  it("paginates the catalogue with defaults and rejects invalid paging", async () => {
    const all = await request(app.getHttpServer()).get("/bikes").expect(200);
    expect(all.body.totalCount).toBe(4);
    expect(all.body.bikes).toHaveLength(4);

    const page = await request(app.getHttpServer())
      .get("/bikes?page=2&limit=3")
      .expect(200);
    expect(page.body.totalCount).toBe(4);
    expect(page.body.bikes).toHaveLength(1);

    const beyond = await request(app.getHttpServer())
      .get("/bikes?page=9&limit=3")
      .expect(200);
    expect(beyond.body).toEqual({ totalCount: 4, bikes: [] });

    for (const query of ["page=0", "limit=0", "limit=51", "page=abc"])
      await request(app.getHttpServer()).get(`/bikes?${query}`).expect(400);
  });

  it("creates, reads, updates and deletes a bike", async () => {
    const created = await request(app.getHttpServer())
      .post("/bikes")
      .send(validBike)
      .expect(201);
    const id = created.body.id as string;
    expect(created.body).toMatchObject({ brand: "Veloria", model: "Trail 2" });

    await request(app.getHttpServer()).get(`/bikes/${id}`).expect(200);

    const patched = await request(app.getHttpServer())
      .patch(`/bikes/${id}`)
      .send({ priceCents: 79900 })
      .expect(200);
    expect(patched.body).toMatchObject({
      id,
      priceCents: 79900,
      brand: "Veloria",
    });

    await request(app.getHttpServer()).delete(`/bikes/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/bikes/${id}`).expect(404);
  });

  it("validates input and returns 404 for missing bikes", async () => {
    await request(app.getHttpServer())
      .post("/bikes")
      .send({ ...validBike, gearCount: 0 })
      .expect(400);
    await request(app.getHttpServer())
      .post("/bikes")
      .send({ ...validBike, electric: "yes" })
      .expect(400);
    await request(app.getHttpServer())
      .post("/bikes")
      .send({ ...validBike, extra: true })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/bikes/${fixtureIds.bikes[0]}`)
      .send({ frameSizeCm: -1 })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/bikes/${fixtureIds.bikes[0]}`)
      .send({})
      .expect(400);
    await request(app.getHttpServer()).get("/bikes/not-a-uuid").expect(400);
    await request(app.getHttpServer()).get(`/bikes/${missingId}`).expect(404);
    await request(app.getHttpServer())
      .patch(`/bikes/${missingId}`)
      .send({ priceCents: 1 })
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/bikes/${missingId}`)
      .expect(404);
  });

  it("refuses to delete a bike linked to a sale with 409", async () => {
    const bikeId = fixtureIds.bikes[0];
    await request(app.getHttpServer())
      .post(`/customers/${fixtureIds.customers[0]}/bikes`)
      .send({ bikeId, quantity: 1 })
      .expect(201);
    await request(app.getHttpServer()).delete(`/bikes/${bikeId}`).expect(409);
    await request(app.getHttpServer()).get(`/bikes/${bikeId}`).expect(200);
  });
});

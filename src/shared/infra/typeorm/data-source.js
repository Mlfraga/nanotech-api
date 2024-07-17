
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "nanotech",

    synchronize: true,
    logging: false,
    entities: [
      "dist/modules/**/infra/typeorm/entities/*.js"
    ],
    migrations: [
      "dist/shared/infra/typeorm/migrations/*.js"
    ],
    subscribers: [],
})

const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1729701144920 {
    name = 'Migrations1729701144920'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "middleName" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middleName"`);
    }
}

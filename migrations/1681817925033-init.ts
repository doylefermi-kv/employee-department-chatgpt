import {MigrationInterface, QueryRunner} from "typeorm";

export class init1681817925033 implements MigrationInterface {
    name = 'init1681817925033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "addressLine1" character varying NOT NULL, "addressLine2" character varying, "district" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "experience" integer NOT NULL, "joiningDate" TIMESTAMP NOT NULL, "role" character varying NOT NULL, "status" character varying NOT NULL, "addressId" integer, CONSTRAINT "REL_9db63829e525f028ccc7de5f9e" UNIQUE ("addressId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_departments_department" ("employeeId" integer NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "PK_9002b71de41a26ccb8640b8e03d" PRIMARY KEY ("employeeId", "departmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e745bece0786450d9cd6945129" ON "employee_departments_department" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c960954811f554047021ae821" ON "employee_departments_department" ("departmentId") `);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_9db63829e525f028ccc7de5f9e7" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_departments_department" ADD CONSTRAINT "FK_e745bece0786450d9cd6945129c" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_departments_department" ADD CONSTRAINT "FK_5c960954811f554047021ae821d" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_departments_department" DROP CONSTRAINT "FK_5c960954811f554047021ae821d"`);
        await queryRunner.query(`ALTER TABLE "employee_departments_department" DROP CONSTRAINT "FK_e745bece0786450d9cd6945129c"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_9db63829e525f028ccc7de5f9e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c960954811f554047021ae821"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e745bece0786450d9cd6945129"`);
        await queryRunner.query(`DROP TABLE "employee_departments_department"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}

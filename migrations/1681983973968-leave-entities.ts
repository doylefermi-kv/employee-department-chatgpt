import {MigrationInterface, QueryRunner} from "typeorm";

export class leaveEntities1681983973968 implements MigrationInterface {
    name = 'leaveEntities1681983973968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leave_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "maxDays" integer NOT NULL, CONSTRAINT "UQ_8c5e065d958cb9f9aa4e2e1fbac" UNIQUE ("name"), CONSTRAINT "PK_dea42866b70af67caabf936f496" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leave" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "employeeId" integer, "leaveTypeId" integer, CONSTRAINT "PK_501f6ea368365d2a40b1660e16b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_b8ff759530cff3e5f39f7dd0102" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_a600073e446a189d1f72498362e" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_a600073e446a189d1f72498362e"`);
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_b8ff759530cff3e5f39f7dd0102"`);
        await queryRunner.query(`DROP TABLE "leave"`);
        await queryRunner.query(`DROP TABLE "leave_type"`);
    }

}

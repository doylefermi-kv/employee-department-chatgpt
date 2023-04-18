const request = require('supertest');
const app = require('../app');
const { createConnection } = require('typeorm');
const Department = require('../models/Department');
const DepartmentRepository = require('../repositories/DepartmentRepository');

describe('Department API', () => {
    let connection;
    let departmentRepository;

    beforeAll(async () => {
        connection = await createConnection();
        departmentRepository = new DepartmentRepository();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('POST /departments', () => {
        it('should create a new department', async () => {
            const res = await request(app)
                .post('/departments')
                .send({ name: 'Sales', status: 'Active' })
                .expect(201);

            const department = await departmentRepository.findById(res.body.id);
            expect(department).toBeDefined();
            expect(department.name).toBe('Sales');
            expect(department.status).toBe('Active');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/departments')
                .send({ status: 'Active' })
                .expect(400);

            expect(res.body.error).toBe('Name is required');
        });
    });

    describe('GET /departments', () => {
        it('should get all departments', async () => {
            const res = await request(app).get('/departments').expect(200);

            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].name).toBeDefined();
            expect(res.body[0].status).toBeDefined();
        });
    });

    describe('GET /departments/:id', () => {
        it('should get department by id', async () => {
            const department = await departmentRepository.create({
                name: 'Finance',
                status: 'Active',
            });

            const res = await request(app)
                .get(`/departments/${department.id}`)
                .expect(200);

            expect(res.body.name).toBe('Finance');
            expect(res.body.status).toBe('Active');
        });

        it('should return 404 if department not found', async () => {
            const res = await request(app)
                .get('/departments/123')
                .expect(404);

            expect(res.body.error).toBe('Department not found');
        });
    });

    describe('PUT /departments/:id', () => {
        it('should update department by id', async () => {
            const department = await departmentRepository.create({
                name: 'HR',
                status: 'Active',
            });

            const res = await request(app)
                .put(`/departments/${department.id}`)
                .send({ name: 'Marketing' })
                .expect(200);

            expect(res.body.name).toBe('Marketing');
            expect(res.body.status).toBe('Active');
        });

        it('should return 404 if department not found', async () => {
            const res = await request(app)
                .put('/departments/123')
                .send({ name: 'Marketing' })
                .expect(404);

            expect(res.body.error).toBe('Department not found');
        });
    });

    describe('DELETE /departments/:id', () => {
        it('should delete department by id', async () => {
            const department = await departmentRepository.create({
                name: 'IT',
                status: 'Active',
            });

            await request(app).delete(`/departments/${department.id}`).expect(204);

            const deletedDepartment = await departmentRepository.findById(
                department.id
            );
            expect(deletedDepartment).toBeUndefined();
        });

        it('should return 404 if department does not exist', async () => {
            const fakeId = 'd9abba2d-8a4b-4c5e-974d-2fbc8aae715e';

            await request(app).delete(`/departments/${fakeId}`).expect(404);
        });
    });
});

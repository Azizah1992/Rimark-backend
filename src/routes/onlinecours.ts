import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createLifecoachController } from '../controllers/coachs';
import { createCourseController } from '../controllers/onlinecours';

const Course = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Course = Static<typeof Course>;  //define query 

const GetCourseQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetCourseQuery = Static<typeof GetCourseQuery>; //to define with type box

export let courses: Course[] = [  //which is defined in the contrlr coachs
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Lamis', phone: '0511111111' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'Lamis', phone: '0511111111' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'Amani', phone: '0511111111' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'Amani', phone: '0511111111' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'Amal', phone: '0511111111' },
	{ id: '3', name: 'Azizah', phone: '123123123' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/course',
		schema: {
			summary: 'Creates new course + all properties are required',
			tags: ['Courses'],
			body: Course,
		},
		handler: async (request, reply) => {
			const newCourse: any = request.body;
			return createCourseController(courses, newCourse);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/courses/:id',
		schema: {
			summary: 'Update a course by id + you dont need to pass all properties',
			tags: ['Courses'],
			body: Type.Partial(Course),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newCourse: any = request.body;
			return createLifecoachController(courses, newCourse);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/courses/:id',
		schema: {
			summary: 'Deletes a course',
			tags: ['Courses'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			courses = courses.filter((c) => c.id !== id);

			return courses;
		},
	});

	server.route({
		method: 'GET',
		url: '/courses/:id',
		schema: {
			summary: 'Returns one course or null',
			tags: ['Courses'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Course, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return courses.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/coursees',
		schema: {
			summary: 'Gets all courses',
			tags: ['Courses'],
			querystring: GetCourseQuery,
			response: {
				'2xx': Type.Array(Course),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetCourseQuery;

			if (query.name) {
				return courses.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return courses;
			}
		},
	});
}
function newCourse(coursees: { id: string; name: string; phone: string; }[], newCourse: any): unknown {
	throw new Error('Function not implemented.');
}


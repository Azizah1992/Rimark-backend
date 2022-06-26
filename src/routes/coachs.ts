import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createLifecoachController } from '../controllers/coachs';

const Coach = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Coach = Static<typeof Coach>;  //define query 

const GetCoachQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetCoachQuery = Static<typeof GetCoachQuery>; //to define with type box

export let coachs: Coach[] = [  //which is defined in the contrlr coachs
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
		url: '/coachs',
		schema: {
			summary: 'Creates new coach + all properties are required',
			tags: ['Coaches'],
			body: Coach,
		},
		handler: async (request, reply) => {
			const newCoach: any = request.body;
			return createLifecoachController(coachs, newCoach);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/coachs/:id',
		schema: {
			summary: 'Update a coachs by id + you dont need to pass all properties',
			tags: ['Coachs'],
			body: Type.Partial(Coach),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newCoach: any = request.body;
			return createLifecoachController(coachs, newCoach);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/coaches/:id',
		schema: {
			summary: 'Deletes a coache',
			tags: ['Coaches'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			coachs = coachs.filter((c) => c.id !== id);

			return coachs;
		},
	});

	server.route({
		method: 'GET',
		url: '/coaches/:id',
		schema: {
			summary: 'Returns one coach or null',
			tags: ['Coaches'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Coach, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return coachs.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/coaches',
		schema: {
			summary: 'Gets all contacts',
			tags: ['Coaches'],
			querystring: GetCoachQuery,
			response: {
				'2xx': Type.Array(Coach),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetCoachQuery;

			if (query.name) {
				return coachs.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return coachs;
			}
		},
	});
}
function newCoach(coachs: { id: string; name: string; phone: string; }[], newCoach: any): unknown {
	throw new Error('Function not implemented.');
}


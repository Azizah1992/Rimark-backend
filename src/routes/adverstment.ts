import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createAdverstmentController } from '../controllers/adversmetns';

const Adversmetn = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Adversmetn = Static<typeof Adversmetn>;  //define query 

const GetAdverstmentQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetAdverstmentQuery = Static<typeof GetAdverstmentQuery>; //to define with type box

export let adversmetns: Adversmetn[] = [  //which is defined in the contrlr coachs
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
		url: '/adverstment',
		schema: {
			summary: 'Creates new adverstment + all properties are required',
			tags: ['Adverstment'],
			body: Adversmetn,
		},
		handler: async (request, reply) => {
			const newAdverstment: any = request.body;
			return createAdverstmentController(adversmetns, newAdverstment);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/adverstment/:id',
		schema: {
			summary: 'Update a adverstment by id + you dont need to pass all properties',
			tags: [''],
			body: Type.Partial(Adversmetn),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newAdverstment: any = request.body;
			return createAdverstmentController(adversmetns, newAdverstment);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/adverstment/:id',
		schema: {
			summary: 'Deletes a adverstmenet',
			tags: ['Adverstment'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			adversmetns = adversmetns.filter((c) => c.id !== id);

			return adversmetns;
		},
	});

	server.route({
		method: 'GET',
		url: '/adverstment/:id',
		schema: {
			summary: 'Returns one adverstment or null',
			tags: ['Adverstment'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Adversmetn, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return adversmetns.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/adverstment',
		schema: {
			summary: 'Gets all contacts',
			tags: ['Adverstment'],
			querystring: GetAdverstmentQuery,
			response: {
				'2xx': Type.Array(Adversmetn),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetAdverstmentQuery;

			if (query.name) {
				return adversmetns.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return adversmetns;
			}
		},
	});
}
function newAdverstment(adversmetns: { id: string; name: string; phone: string; }[], newAdverstment: any): unknown {
	throw new Error('Function not implemented.');
}


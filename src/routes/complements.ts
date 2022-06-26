import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createLifecoachController } from '../controllers/coachs';
import { createComplementController } from '../controllers/complemetn';

const Complement = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Complement = Static<typeof Complement>;  //define query 

const GetComplementQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetComplementQuery = Static<typeof GetComplementQuery>; //to define with type box

export let complements: Complement[] = [  //which is defined in the contrlr coachs
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
		url: '/complements',
		schema: {
			summary: 'Creates new complement + all properties are required',
			tags: ['Complements'],
			body: Complement,
		},
		handler: async (request, reply) => {
			const newComplements: any = request.body;
			return createComplementController(complements, newComplements);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/complements/:id',
		schema: {
			summary: 'Update a complements by id + you dont need to pass all properties',
			tags: ['Complements'],
			body: Type.Partial(Complement),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newComplement: any = request.body;
			return createLifecoachController(complements, newComplement);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/complement/:id',
		schema: {
			summary: 'Deletes a complement',
			tags: ['Complements'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			complements = complements .filter((c) => c.id !== id);

			return complements ;
		},
	});

	server.route({
		method: 'GET',
		url: '/complements/:id',
		schema: {
			summary: 'Returns one complement or null',
			tags: ['Complement'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Complement, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return complements.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/complements',
		schema: {
			summary: 'Gets all complements',
			tags: ['Coaches'],
			querystring: GetComplementQuery,
			response: {
				'2xx': Type.Array(Complement),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetComplementQuery;

			if (query.name) {
				return complements.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return complements;
			}
		},
	});
}
function newComplement(complements: { id: string; name: string; phone: string; }[],newComplement: any): unknown {
	throw new Error('Function not implemented.');
}


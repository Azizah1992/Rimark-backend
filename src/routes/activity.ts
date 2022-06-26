import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createActivityController } from '../controllers/activity';

const Activity = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Activity = Static<typeof Activity>;  //define query 

const GetActivityQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetActivityQuery = Static<typeof GetActivityQuery>; //to define with type box

export let activites: Activity[] = [  //which is defined in the contrlr coachs
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
		url: '/activites',
		schema: {
			summary: 'Creates new activity + all properties are required',
			tags: ['Activites'],
			body: Activity,
		},
		handler: async (request, reply) => {
			const newActivity: any = request.body;
			return createActivityController(activites, newActivity);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/activites/:id',
		schema: {
			summary: 'Update a activites by id + you dont need to pass all properties',
			tags: ['Activites'],
			body: Type.Partial(Activity),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newActivity: any = request.body;
			return createActivityController(activites,newActivity);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/activites/:id',
		schema: {
			summary: 'Deletes a activity',
			tags: ['Activites'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			activites = activites.filter((c) => c.id !== id);

			return activites;
		},
	});

	server.route({
		method: 'GET',
		url: '/activites/:id',
		schema: {
			summary: 'Returns one activtes or null',
			tags: ['Activites'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Activity, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return activites.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/activites',
		schema: {
			summary: 'Gets all activites',
			tags: ['Activites'],
			querystring: GetActivityQuery,
			response: {
				'2xx': Type.Array(Activity),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetActivityQuery;

			if (query.name) {
				return activites.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return activites;
			}
		},
	});
}
function newCoach(activites: { id: string; name: string; phone: string; }[], newActivity: any): unknown {
	throw new Error('Function not implemented.');
}


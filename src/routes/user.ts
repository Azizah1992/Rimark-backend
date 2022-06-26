

import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createUserController } from '../controllers/user';

const User = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type User = Static<typeof User>;

const GetUserQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetUserQuery = Static<typeof GetUserQuery>;

export let users: User[] = [
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
		url: '/users',
		schema: {
			summary: 'Creates new user + all properties are required',
			tags: ['Users'],
			body: User,
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return createUserController(users, newContact);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/users/:id',
		schema: {
			summary: 'Update a user by id + you dont need to pass all properties',
			tags: ['Users'],
			body: Type.Partial(User),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newContact: any = request.body;
			return createUserController(users, newContact);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/users/:id',
		schema: {
			summary: 'Deletes a contact',
			tags: ['Users'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			users = users.filter((c) => c.id !== id);

			return users;
		},
	});

	server.route({
		method: 'GET',
		url: '/users/:id',
		schema: {
			summary: 'Returns one user or null',
			tags: ['Users'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([User, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return users.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/users',
		schema: {
			summary: 'Gets all contacts',
			tags: ['Users'],
			querystring: GetUserQuery,
			response: {
				'2xx': Type.Array(User),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetUserQuery;

			if (query.name) {
				return users.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return users;
			}
		},
	});
}


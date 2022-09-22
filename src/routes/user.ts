

import { Static, Type } from '@sinclair/typebox';
import { User } from '@prisma/client';
// import { FastifyInstance } from 'fastify';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import { partial } from 'lodash';
// import { createLifecoachController } from '../controllers/coachs';
import Fuse from 'fuse.js';
import { prismaClient } from '../prisma';
import _ from 'lodash';

const User = Type.Object({  //validation 
	user_id: Type.Optional(Type.String()),
	first_name: Type.String(),
	last_name: Type.String(),
	full_name: Type.String(),
	username: Type.String(),
	phone: Type.Optional(Type.String()),
	email: Type.Optional(Type.String()),
	gender: Type.String(),
	street: Type.String(),
	district: Type.String(),
	city: Type.String(),
	building_number: Type.Optional(Type.String()),
	password: Type.String(),
	articles: Type.String(),
	articles_title: Type.String(),
    role:Type.String()

});

const UserWithoutId = Type.Object({  //validation 

	username: Type.String(),
	first_name: Type.String(),
	last_name: Type.String(),
	full_name: Type.String(),
	phone: Type.String(),
	email: Type.Optional(Type.String()),
	gender: Type.String(),
	street: Type.String(),
	district: Type.String(),
	city: Type.String(),
	building_number: Type.Optional(Type.String()),
	password: Type.String(),
	articles: Type.String(),
	articles_title: Type.String(),
	role:Type.String()

});




type UserWithoutId = Static<typeof UserWithoutId>;

const PartialUserWithoutId = Type.Partial(UserWithoutId);
type PartialUserWithoutId = Static<typeof PartialUserWithoutId>;

const GetUserQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetUserQuery = Static<typeof GetUserQuery>;

const UserParams = Type.Object({
	user_id: Type.String(),
});
type UserParams = Static<typeof UserParams>;



export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/user',
		schema: {
			summary: 'Creates new user ',
			tags: ['Users'],
			body: UserWithoutId,
		},
		handler: async (request, reply) => {
			const user = request.body as any;
			await prismaClient.user.create({
				data: user,


			})
			return { 'msg': 'user added' };
		},
	});


	server.route({
		method: 'PUT',
		url: '/user',
		schema: {
			summary: 'Creates new user + all properties are required',
			tags: ['Users'],
			body: User,
		},
		handler: async (request, reply) => {
			const user = request.body as User;
			if (!ObjectId.isValid(user.user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
			} else {
				return await prismaClient.user.upsert({
					where: { user_id: user.user_id },
					create: user,
					update: _.omit(user, ['user_id']), //omit bring every things exept id 
				});
			}
		},
	});




	server.route({
		method: 'PATCH',   //update
		url: '/users/:user_id',
		schema: {
			summary: 'Update a users by id + you dont need to pass all properties',
			tags: ['Users'],
			body: PartialUserWithoutId,
			params: UserParams,
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as any;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id  should be an ObjectId!');
				return;
			}

			const user = request.body as any;

			return prismaClient.user.update({
				where: { user_id },
				data: user,
			});
		},
	});

	server.route({
		method: 'DELETE',
		url: '/users/:user_id',
		schema: {
			summary: 'Deletes a user',
			tags: ['Users'],
			params: UserParams,
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			await prismaClient.user.delete({
				where: { user_id },
			});

			return { 'msg': 'user deleted' }

		},
	});



	server.route({
		method: 'GET',
		url: '/users/:user_id',
		schema: {
			summary: 'Returns one users or null',
			tags: ['Users'],
			params: UserParams,
			response: {
				'2xx': Type.Union([User, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest(' should be an ObjectId!');
				return;
			}

			return prismaClient.user.findFirst({
				where: { user_id },
			});
		},
	});



	//  Get all contacts or search by name
	server.route({
		method: 'GET',
		url: '/users',
		schema: {
			summary: 'Gets all users',
			tags: ['Users'],
			querystring: GetUserQuery,
			response: {
				'2xx': Type.Array(User),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetUserQuery;

			const users = await prismaClient.user.findMany();
			if (!query.text) return users;

			const fuse = new Fuse(users, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['name', 'phone'],
			});

			console.log(JSON.stringify(fuse.search(query.text)));

			const result: User[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
}
function newUser(users: { id: string; username: string;first_name: string;last_name: string;full_name: string; phone: string;email: string;building_number: string;street: string;district: string;city: string;articles: string;articles_title: string; }[], newUser: any): unknown {
	throw new Error('Function not implemented.');
}

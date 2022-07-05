import { Static, Type } from '@sinclair/typebox';
import { Coach } from '@prisma/client';
// import { FastifyInstance } from 'fastify';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import { partial } from 'lodash';
import { createLifecoachController } from '../controllers/coachs';
import Fuse from 'fuse.js';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { addAuthorization } from '../hooks/auth';

const Coach = Type.Object({  //validation 
	coach_id: Type.Optional(Type.String()),
	name: Type.String(),
	phone: Type.String(),
	email: Type.Optional(Type.String()),
	// job_id: Type.String()

});

const CoachWithoutId = Type.Object({  //validation 

	name: Type.String(),
	phone: Type.String(),
	email: Type.Optional(Type.String()),
	

});




type CoachWithoutId = Static<typeof CoachWithoutId>;

const PartialCoachWithoutId = Type.Partial(CoachWithoutId);
type PartialCoachWithoutId = Static<typeof PartialCoachWithoutId>;

const GetCoachQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCoachQuery = Static<typeof GetCoachQuery>;

const CoachParams = Type.Object({
	coach_id: Type.String(),
});
type CoachParams = Static<typeof CoachParams>;

// export let coachs: Coach[] = [
// 	{ coach_id: new ObjectId().toHexString(), name: 'Lamis', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Lamis', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Amani', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Amani', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Saleh', phone: '0511111111', email: 'as@gmail' },
// ];

export default async function (server: FastifyInstance) {
	// addAuthorization(server)
	server.route({
		method: 'POST',
		url: '/coachs',
		schema: {
			summary: 'Creates new coach ',
			tags: ['Coaches'],
			body: CoachWithoutId,
		},
		handler: async (request, reply) => {
			const coach = request.body as any;
			await prismaClient.coach.create({
				data: coach,


			})
			return { 'msg': 'couch added' };
		},
	});


	server.route({
		method: 'PUT',
		url: '/coachs',
		schema: {
			summary: 'Creates new contact + all properties are required',
			tags: ['Coaches'],
			body: Coach,
		},
		handler: async (request, reply) => {
			const coach = request.body as Coach;
			if (!ObjectId.isValid(coach.coach_id)) {
				reply.badRequest('coach_id should be an ObjectId!');
			} else {
				return await prismaClient.coach.upsert({
					where: { coach_id: coach.coach_id },
					create: coach,
					update: _.omit(coach, ['coach_id']), //omit bring every things exept id 
				});
			}
		},
	});




	server.route({
		method: 'PATCH',   //update
		url: '/coachs/:coach_id',
		schema: {
			summary: 'Update a coachs by id + you dont need to pass all properties',
			tags: ['Coaches'],
			body: PartialCoachWithoutId,
			params: CoachParams,
		},
		handler: async (request, reply) => {
			const { coach_id } = request.params as CoachParams;
			if (!ObjectId.isValid(coach_id)) {
				reply.badRequest('coach_id  should be an ObjectId!');
				return;
			}

			const coach = request.body as any;

			return prismaClient.coach.update({
				where: { coach_id },
				data: coach,
			});
		},
	});

	server.route({
		method: 'DELETE',
		url: '/coachs/:coach_id',
		schema: {
			summary: 'Deletes a coach',
			tags: ['Coaches'],
			params: CoachParams,
		},
		handler: async (request, reply) => {
			const { coach_id } = request.params as CoachParams;
			if (!ObjectId.isValid(coach_id)) {
				reply.badRequest('coach_id should be an ObjectId!');
				return;
			}

			await prismaClient.coach.delete({
				where: { coach_id },
			});

			return { 'msg': 'couch deleted' }

		},
	});


	server.route({
		method: 'GET',
		url: '/Coaches/:coach_id',
		schema: {
			summary: 'Returns one contact or null',
			tags: ['Coaches'],
			params: CoachParams,
			response: {
				'2xx': Type.Union([Coach, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const { coach_id } = request.params as CoachParams;
			if (!ObjectId.isValid(coach_id)) {
				reply.badRequest('coach_id should be an ObjectId!');
				return;
			}

			return prismaClient.coach.findFirst({
				where: { coach_id },
			});
		},
	});



	/// Get all contacts or search by name
	server.route({
		method: 'GET',
		url: '/coachs',
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

			const coaches = await prismaClient.coach.findMany();
			if (!query.text) return coaches;

			const fuse = new Fuse(coaches, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['name', 'phone'],
			});

			console.log(JSON.stringify(fuse.search(query.text)));

			const result: Coach[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
}
function newCoach(coachs: { id: string; name: string; phone: string; }[], newCoach: any): unknown {
	throw new Error('Function not implemented.');
}


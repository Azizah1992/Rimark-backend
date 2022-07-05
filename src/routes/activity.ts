import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import { partial } from 'lodash';
import Fuse from 'fuse.js';
import { prismaClient } from '../prisma';
import _ from 'lodash';

// activity_id     String   @id @default(auto()) @map("_id") @db.ObjectId
// activity_name   String
// activity_time   DateTime
// activity_leader String


const Activity = Type.Object({  //validation 
	activity_id: Type.Optional(Type.String()),
	activity_name: Type.String(),
	activity_time: Type.String(),
	activity_leader: Type.Optional(Type.String()),

});

const ActivityWithoutId = Type.Object({  //validation 

	// activity_id: Type.String(),
	activity_name: Type.String(),
	activity_time: Type.String(),
	activity_leader: Type.Optional(Type.String()),

});




type ActivityWithoutId = Static<typeof ActivityWithoutId>;

const PartialActivityWithoutId = Type.Partial(ActivityWithoutId);
type PartialActivityWithoutId = Static<typeof PartialActivityWithoutId>;

const GetActivityQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetActivityQuery = Static<typeof GetActivityQuery>;

const ActivityParams = Type.Object({
	activity_id: Type.String(),
});
type ActivityParams = Static<typeof ActivityParams>;

// export let coachs: Coach[] = [
// 	{ coach_id: new ObjectId().toHexString(), name: 'Lamis', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Lamis', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Amani', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Amani', phone: '0511111111', email: 'as@gmail' },
// 	{ coach_id: new ObjectId().toHexString(), name: 'Saleh', phone: '0511111111', email: 'as@gmail' },
// ];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/activites',
		schema: {
			summary: 'Creates new activity ',
			tags: ['activites'],
			body: ActivityWithoutId,
		},
		handler: async (request, reply) => {
			const activity = request.body as any;
			await prismaClient.activity.create({
				data: activity,


			})
			return { 'msg': 'activity added' };
		},
	});


	// server.route({
	// 	method: 'PUT',
	// 	url: '/activites',
	// 	schema: {
	// 		summary: 'Creates new activity + all properties are required',
	// 		tags: ['Activites'],
	// 		body: Activity,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const activity = request.body as any;
	// 		if (!ObjectId.isValid(activity.activity_id)) {
	// 			reply.badRequest('activity_id should be an ObjectId!');
	// 		} else {
	// 			return await prismaClient.activity.upsert({
	// 				where: { activity_id: activity.activity_id },
	// 				create: activity,
	// 				update: _.omit(activity, ['activity_id']), //omit bring every things exept id 
	// 			});
	// 		}
	// 	},
	// });




	// server.route({
	// 	method: 'PATCH',   //update
	// 	url: '/activites/:activity_id',
	// 	schema: {
	// 		summary: 'Update a activites by id + you dont need to pass all properties',
	// 		tags: ['Activites'],
	// 		body: PartialActivityWithoutId,
	// 		params: ActivityParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { activity_id } = request.params as ActivityParams;
	// 		if (!ObjectId.isValid(activity_id)) {
	// 			reply.badRequest('activity_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		const activity = request.body as any;

	// 		return prismaClient.activity.update({
	// 			where: { activity_id },
	// 			data: activity,
	// 		});
	// 	},
	// });

	// server.route({
	// 	method: 'DELETE',
	// 	url: '/activites/:activity_id',
	// 	schema: {
	// 		summary: 'Deletes a activity',
	// 		tags: ['Activites'],
	// 		params: ActivityParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { activity_id } = request.params as ActivityParams;
	// 		if (!ObjectId.isValid(activity_id)) {
	// 			reply.badRequest('activity_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		await prismaClient.activity.delete({
	// 			where: { activity_id },
	// 		});

	// 		return { 'msg': 'couch activity' }

	// 	},
	// });


	// server.route({
	// 	method: 'GET',
	// 	url: '/activites/:activity_id',
	// 	schema: {
	// 		summary: 'Returns one contact or null',
	// 		tags: ['Activites'],
	// 		params: ActivityParams,
	// 		response: {
	// 			'2xx': Type.Union([Activity, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { activity_id } = request.params as ActivityParams;
	// 		if (!ObjectId.isValid(activity_id)) {
	// 			reply.badRequest('activity_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.activity.findFirst({
	// 			where: { activity_id },
	// 		});
	// 	},
	// });



	// / Get all contacts or search by name
		server.route({
			method: 'GET',
			url: '/activites',
			schema: {
				summary: 'Gets all activites',
				tags: ['activites'],
				querystring: GetActivityQuery,
				// response: {
				// 	'2xx': Type.Array(ActivityParams),
				// },
			},
			handler: async (request, reply) => {
				const query = request.query as GetActivityQuery;

				const activites = await prismaClient.activity.findMany();
				if (!query.text) return activites;

				const fuse = new Fuse(activites, { //question here the information down its should be in this activity 
					includeScore: true,
					isCaseSensitive: false,
					includeMatches: true,
					findAllMatches: true,
					threshold: 1,
					keys: ['name', 'phone'],
				});

				console.log(JSON.stringify(fuse.search(query.text)));

				const result: any[] = fuse.search(query.text).map((r) => r.item);
				return result;
			},
		});
}
function newActivity(activites: { id: string; name: string; phone: string; }[], newActivity: any): unknown {
	throw new Error('Function not implemented.');
}


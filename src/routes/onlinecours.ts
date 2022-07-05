import { Static, Type } from '@sinclair/typebox';
import { Course } from '@prisma/client';
// import { FastifyInstance } from 'fastify';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import { partial } from 'lodash';
import Fuse from 'fuse.js';
import { prismaClient } from '../prisma';
import _ from 'lodash';

// course_id    String  @id @default(auto()) @map("_id") @db.ObjectId
// course_title String
// description  String
// user_id      String? @db.ObjectId

const Course = Type.Object({  //validation 
	course_id: Type.Optional(Type.String()),
	course_title: Type.String(),
	description: Type.String(),
	user_id: Type.Optional(Type.String()),


});

const CourseWithoutId = Type.Object({  //validation 

	course_id: Type.String(),
	course_title: Type.String(),
	description: Type.Optional(Type.String()),
	user_id: Type.Optional(Type.String()),

});




type CourseWithoutId = Static<typeof CourseWithoutId>;

const PartialCoachWithoutId = Type.Partial(CourseWithoutId);
type PartialCoachWithoutId = Static<typeof PartialCoachWithoutId>;

const GetCourseQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCourseQuery = Static<typeof GetCourseQuery>;

const CourseParams = Type.Object({
	course_id: Type.String(),
});
type CourseParams = Static<typeof CourseParams>;

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
		url: '/courses',
		schema: {
			summary: 'Creates new course ',
			tags: ['Courses'],
			body: CourseWithoutId,
		},
		handler: async (request, reply) => {
			const course = request.body as any;
			await prismaClient.course.create({
				data: course,

			})
			return { 'msg': 'couch added' };
		},
	});


	server.route({
		method: 'PUT',
		url: '/courses',
		schema: {
			summary: 'Creates new course + all properties are required',
			tags: ['Courses'],
			body: Course,
		},
		handler: async (request, reply) => {
			const course = request.body as Course;
			if (!ObjectId.isValid(course.course_id)) {
				reply.badRequest('course_id should be an ObjectId!');
			} else {
				return await prismaClient.course.upsert({
					where: { course_id: course.course_id },
					create: course,
					update: _.omit(course, ['course_id']), //omit bring every things exept id 
				});
			}
		},
	});




	server.route({
		method: 'PATCH',   //update
		url: '/courses/:course_id',
		schema: {
			summary: 'Update a course by id + you dont need to pass all properties',
			tags: ['Courses'],
			body: PartialCoachWithoutId,
			params: CourseParams,
		},
		handler: async (request, reply) => {
			const { course_id } = request.params as CourseParams;
			if (!ObjectId.isValid(course_id)) {
				reply.badRequest('course_id  should be an ObjectId!');
				return;
			}

			const course = request.body as any;

			return prismaClient.course.update({
				where: { course_id },
				data: course,
			});
		},
	});

	// 	//stoped here 
	// 	server.route({
	// 		method: 'DELETE',
	// 		url: '/coachs/:coach_id',
	// 		schema: {
	// 			summary: 'Deletes a coach',
	// 			tags: ['Coaches'],
	// 			params: CoachParams,
	// 		},
	// 		handler: async (request, reply) => {
	// 			const { coach_id } = request.params as CoachParams;
	// 			if (!ObjectId.isValid(coach_id)) {
	// 				reply.badRequest('coach_id should be an ObjectId!');
	// 				return;
	// 			}

	// 			await prismaClient.coach.delete({
	// 				where: { coach_id },
	// 			});

	// 			return { 'msg': 'couch deleted' }

	// 		},
	// 	});


	// 	server.route({
	// 		method: 'GET',
	// 		url: '/Coaches/:coach_id',
	// 		schema: {
	// 			summary: 'Returns one contact or null',
	// 			tags: ['Coaches'],
	// 			params: CoachParams,
	// 			response: {
	// 				'2xx': Type.Union([Coach, Type.Null()]),
	// 			},
	// 		},
	// 		handler: async (request, reply) => {
	// 			const { coach_id } = request.params as CoachParams;
	// 			if (!ObjectId.isValid(coach_id)) {
	// 				reply.badRequest('coach_id should be an ObjectId!');
	// 				return;
	// 			}

	// 			return prismaClient.coach.findFirst({
	// 				where: { coach_id },
	// 			});
	// 		},
	// 	});



	// 	/// Get all contacts or search by name
	// 	server.route({
	// 		method: 'GET',
	// 		url: '/coachs',
	// 		schema: {
	// 			summary: 'Gets all contacts',
	// 			tags: ['Coaches'],
	// 			querystring: GetCoachQuery,
	// 			response: {
	// 				'2xx': Type.Array(Coach),
	// 			},
	// 		},
	// 		handler: async (request, reply) => {
	// 			const query = request.query as GetCoachQuery;

	// 			const contacts = await prismaClient.coach.findMany();
	// 			if (!query.text) return coachs;

	// 			const fuse = new Fuse(coachs, {
	// 				includeScore: true,
	// 				isCaseSensitive: false,
	// 				includeMatches: true,
	// 				findAllMatches: true,
	// 				threshold: 1,
	// 				keys: ['name', 'phone'],
	// 			});

	// 			console.log(JSON.stringify(fuse.search(query.text)));

	// 			const result: Coach[] = fuse.search(query.text).map((r) => r.item);
	// 			return result;
	// 		},
	// 	});
}
function newCourse(course: { id: string; name: string; phone: string; }[], newCourse: any): unknown {
	throw new Error('Function not implemented.');
}


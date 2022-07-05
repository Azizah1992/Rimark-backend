import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createAppointmentController } from '../controllers/appointment';
import { Appointment } from '@prisma/client';

import { ObjectId } from 'bson';
import { partial } from 'lodash';
import Fuse from 'fuse.js';
import { prismaClient } from '../prisma';
import _ from 'lodash';



const Appointment = Type.Object({  //validation 
	// appointment_id: Type.Optional(Type.String()),
	Appointment_id: Type.String(),
	title: Type.String(),
	// coach_name: Type.String(),
	description: Type.String(),
	time: Type.String(),
	// user_id: Type.String(),
	// coach_id: Type.String(),




});

const AppointmentWithoutId = Type.Object({  //validation 


	title: Type.String(),
	description: Type.String(),
	// coach_name: Type.String(),
	time: Type.String(),
	// user_id: Type.Optional(Type.String()),

});




type AppointmentWithoutId = Static<typeof AppointmentWithoutId>;

const PartialAppointmentWithoutId = Type.Partial(AppointmentWithoutId);
type PartialAppointmentWithoutId = Static<typeof PartialAppointmentWithoutId>;

const GetAppointmentQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetAppointmentQuery = Static<typeof GetAppointmentQuery>;

const AppointmentParams = Type.Object({
	appointment_id: Type.String(),
});
type AppointmentParams = Static<typeof AppointmentParams>;

// export let appointmemts: Appointment[] = [
// 	{ appointment_id: new ObjectId().toHexString(),title:'achivement goal', coach_name: 'Lamis',description:'with salem life coach' , time:'4-40 pm' },
// 	{ appointment_id: new ObjectId().toHexString(), title:'achivement goal', coach_name: 'Lamis',description:'this user is our coustomer' ,time:'4-40 pm' },
// 	{ appointment_id: new ObjectId().toHexString(), title:'achivement goal', coach_name: 'Amani',description:'with salem life coach' ,time:'4-40 pm'},
// 	{ appointment_id: new ObjectId().toHexString(),title:'achivement goal',  coach_name: 'Amani', description:'with salem life coach', time:'4-40 pm'},
// 	{ appointment_id: new ObjectId().toHexString(), title:'achivement goal', coach_name: 'Saleh', description:'with salem life coach', time:'4-40 pm'},
// ];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/appointments',
		schema: {
			summary: 'Creates new appointment ',
			tags: ['appointments'],
			body: AppointmentWithoutId,
		},
		handler: async (request, reply) => {
			const appointmemt = request.body as any;
			await prismaClient.appointment.create({
				data: appointmemt,


			})
			return { 'msg': 'appointments added' };
		},
	});


	// 	server.route({
	// 		method: 'PUT',
	// 		url: '/appointments',
	// 		schema: {
	// 			summary: 'Creates new appointment + all properties are required',
	// 			tags: ['Appointment'],
	// 			body: Appointment,
	// 		},
	// 		handler: async (request, reply) => {
	// 			const appointmemt = request.body as Appointment;
	// 			if (!ObjectId.isValid(appointmemt.appointment_id)) {
	// 				reply.badRequest('appointment_id should be an ObjectId!');
	// 			} else {
	// 				return await prismaClient.appointment.upsert({
	// 					where: { appointment_id: appointmemt.appointment_id },
	// 					create: appointmemt,
	// 					update: _.omit(appointmemt, ['appointment_id']), //omit bring every things exept id 
	// 				});
	// 			}
	// 		},
	// 	});




	server.route({
		method: 'PATCH',   //update
		url: '/appointments/:appointment_id',
		schema: {
			summary: 'Update a appointment by id + you dont need to pass all properties',
			tags: ['appointments'],
			body: AppointmentWithoutId,
			params: AppointmentParams,
		},
		handler: async (request, reply) => {
			const { appointment_id } = request.params as any;
			if (!ObjectId.isValid(appointment_id)) {
				reply.badRequest('appointment_id  should be an ObjectId!');
				return;
			}

			const appointmemt = request.body as any;

			return prismaClient.appointment.update({
				where: { appointment_id },
				data: appointmemt,
			});
		},
	});

	server.route({
		method: 'DELETE',
		url: '/appointments/:appointment_id',
		schema: {
			summary: 'Deletes a appointment',
			tags: ['appointments'],
			params: AppointmentParams,
		},
		handler: async (request, reply) => {
			const { appointment_id } = request.params as any;
			if (!ObjectId.isValid(appointment_id)) {
				reply.badRequest('appointment_id should be an ObjectId!');
				return;
			}

			await prismaClient.appointment.delete({
				where: { appointment_id },
			});

			return { 'msg': 'appointment deleted' }

		},
	});


	// 	server.route({
	// 		method: 'GET',
	// 		url: '/appointments/:appointment_id',
	// 		schema: {
	// 			summary: 'Returns one contact or null',
	// 			tags: ['Appointment'],
	// 			params: AppointmentParams,
	// 			response: {
	// 				'2xx': Type.Union([Appointment, Type.Null()]),
	// 			},
	// 		},
	// 		handler: async (request, reply) => {
	// 			const { appointment_id } = request.params as any;
	// 			if (!ObjectId.isValid(appointment_id)) {
	// 				reply.badRequest('appointment_id should be an ObjectId!');
	// 				return;
	// 			}

	// 			return prismaClient.appointment.findFirst({
	// 				where: { appointment_id },
	// 			});
	// 		},
	// 	});



	// 	// Get all contacts or search by name
	server.route({
		method: 'GET',
		url: '/appointments',
		schema: {
			summary: 'Gets all appointments',
			tags: ['appointments'],
			querystring: GetAppointmentQuery,
			// response: {
			// 	'2xx': Type.Array(AppointmentWithoutId),
			// },
		},
		handler: async (request, reply) => {
			const query = request.query as any;

			const appointmemt = await prismaClient.appointment.findMany();
			if (!query.title) return appointmemt;

			// 	const fuse = new Fuse(appointmemt, {
			// 		includeScore: true,
			// 		isCaseSensitive: false,
			// 		includeMatches: true,
			// 		findAllMatches: true,
			// 		threshold: 1,
			// 		keys: ['title', 'time'],
			// 	});

			// 	console.log(JSON.stringify(fuse.search(query.text)));

			// 	const result: Appointment[] = fuse.search(query.text).map((r) => r.title );
			// 	return result;
		},
	});
}
function newAppointment(appointmemts: { id: string; title: string; time: string; }[], newAppointment: any): unknown {
	throw new Error('Function not implemented.');
}

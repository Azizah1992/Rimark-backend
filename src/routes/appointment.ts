import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createAppointmentController } from '../controllers/appointment';


const Appointment = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Appointment = Static<typeof Appointment>;  //define query 

const GetAppointmentQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetAppointmentQuery = Static<typeof GetAppointmentQuery>; //to define with type box

export let appointments: Appointment[] = [  //which is defined in the contrlr coachs
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
		url: '/Appointment',
		schema: {
			summary: 'Creates new appointment + all properties are required',
			tags: ['Appointmetn'],
			body: Appointment,
		},
		handler: async (request, reply) => {
			const newCoach: any = request.body;
			return createAppointmentController(appointments, newCoach);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/appointment/:id',
		schema: {
			summary: 'Update appointment by id + you dont need to pass all properties',
			tags: ['Appointment'],
			body: Type.Partial(Appointment),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newCoach: any = request.body;
			return createAppointmentController(appointments, newCoach);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/appointment/:id',
		schema: {
			summary: 'Deletes a appointmetn',
			tags: ['Appointment'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			appointments = appointments.filter((c) => c.id !== id);

			return appointments;
		},
	});

	server.route({
		method: 'GET',
		url: '/appointmetn/:id',
		schema: {
			summary: 'Returns one appointment or null',
			tags: ['Appointmetn'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Appointment, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return appointments.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/appointmemt',
		schema: {
			summary: 'Gets all appointmetn',
			tags: ['Appointmetn'],
			querystring: GetAppointmentQuery,
			response: {
				'2xx': Type.Array(Appointment),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetAppointmentQuery;

			if (query.name) {
				return appointments.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return appointments;
			}
		},
	});
}
function newappointments(appointmemt: { id: string; name: string; phone: string; }[], newappointment: any): unknown {
	throw new Error('Function not implemented.');
}


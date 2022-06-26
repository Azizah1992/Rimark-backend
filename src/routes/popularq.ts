import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createLifecoachController } from '../controllers/coachs';
import { createQuestionController } from '../controllers/popularq';

const Question = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Question = Static<typeof Question>;  //define query 

const GetQuestionQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetQuestionQuery = Static<typeof GetQuestionQuery>; //to define with type box

export let questions: Question[] = [  //which is defined in the contrlr coachs
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
		url: '/Questions',
		schema: {
			summary: 'Creates new question + all properties are required',
			tags: ['Questions'],
			body: Question,
		},
		handler: async (request, reply) => {
			const newQuestions: any = request.body;
			return createLifecoachController(questions, newQuestions);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/questions/:id',
		schema: {
			summary: 'Update a questions by id + you dont need to pass all properties',
			tags: ['Questions'],
			body: Type.Partial(Question),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newQuestions: any = request.body;
			return createQuestionController(questions, newQuestions);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/question/:id',
		schema: {
			summary: 'Deletes a question',
			tags: ['Questions'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			questions = questions.filter((c) => c.id !== id);

			return questions;
		},
	});

	server.route({
		method: 'GET',
		url: '/questions/:id',
		schema: {
			summary: 'Returns one question or null',
			tags: ['Questions'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Question, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return questions.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/questions',
		schema: {
			summary: 'Gets all questions',
			tags: ['Questions'],
			querystring: GetQuestionQuery,
			response: {
				'2xx': Type.Array(Question),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetQuestionQuery;

			if (query.name) {
				return questions.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return questions;
			}
		},
	});
}
function newQuestions(qusetion: { id: string; name: string; phone: string; }[], newQuestion: any): unknown {
	throw new Error('Function not implemented.');
}


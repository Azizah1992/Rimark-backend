import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { createLolginController} from '../controllers/login';

export default async function (server: FastifyInstance) {
	server.get('/login', async (request, reply) => {
		return 'hi';
	});

	server.get('/verify', async (request, reply) => {
		return 'hi';
	});
}

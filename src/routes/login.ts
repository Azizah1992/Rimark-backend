import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import fastify, { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import { userInfo } from 'os';
import { server } from '../server';

const LoginBody = Type.Object({
	email: Type.String(), //({ format: 'email' }),
	password: Type.String(),
});
type LoginBody = Static<typeof LoginBody>;



export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/login',
		schema: {
			summary: 'Login a user and returns a token',
			body: LoginBody,
		},
		handler: async (request, reply) => {
			const { email, password } = request.body as LoginBody;


			const user = await prismaClient.user.findUnique({
				where: {
					email: email,
				},
			})
			if (!user) return reply.badRequest("You Need To Regiester")

			if (user.password != password) return reply.badRequest("Incorrect Password")




			const token = server.jwt.sign({ email, role: user.role })  //role in hte user ,
			reply.send({ token, role: user.role })


		},
	});
}
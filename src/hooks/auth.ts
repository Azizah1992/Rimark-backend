import { FastifyInstance } from 'fastify';

function verifyToken(token?: string): boolean {
    if (!token) return false;
    if (!token.includes('Bearer ')) return false;
    token = token.replace('Bearer ', '');

    if (token === '1234') return true;

    return false;
}

export function addAuthorization(server: FastifyInstance) {
    server.addHook('onRequest', async (request, reply) => {
        const token = (request.headers as any).authorization;
        if (!verifyToken(token)) reply.unauthorized();
    });


    server.addHook("onRequest", async (request, reply) => {
        const token = (request.headers as any).verifyToken;
        if (!verifyToken(token)) reply.callNotFound();


        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
}
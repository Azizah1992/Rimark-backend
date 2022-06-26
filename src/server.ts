import fastifyAutoload from '@fastify/autoload';// امبورت للبكجات 
import fastifySwagger from '@fastify/swagger';
import { ajvTypeBoxPlugin, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import { join } from 'path';

export const server = fastify({// عرف سيرفر وسوا له اكسبورت 
	logger: true,
	ajv: {
		customOptions: {
			removeAdditional: 'all',
			ownProperties: true,
		},
		plugins: [ajvTypeBoxPlugin],
	},
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(fastifySwagger, {
	routePrefix: '/lifeify',
	exposeRoute: true,
	mode: 'dynamic',
	openapi: {
		info: {
			title: 'life-coach API',
			version: '0.0.1',
		},
	},
});

server.register(fastifyAutoload, {
	dir: join(__dirname, 'routes'),
});

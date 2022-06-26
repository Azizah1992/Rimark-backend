import { server } from './server';// entry point 

// server.listen({ port: 3001 }).catch((err) => {
const port: any = process.env.PORT ?? process.env.$PORT ?? '3001';

server
	.listen({
		port: port,
		host: '0.0.0.0',
	})
	.catch((err) => {
		server.log.error(err);
		process.exit(1);
	});
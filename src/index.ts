
import { prismaClient } from './prisma';
import { listen } from './server';

async function start() {
	listen();
}
start();
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
// import { createLifecoachController } from '../controllers/coachs';
import { createProfileController } from '../controllers/profiel';

const Profile = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Profile = Static<typeof Profile>;  //define query 

const GetProfileQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetProfileQuery = Static<typeof GetProfileQuery>; //to define with type box

export let profiles: Profile[] = [  //which is defined in the contrlr coachs
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
		url: '/profiles',
		schema: {
			summary: 'Creates new profile + all properties are required',
			tags: ['Profiles'],
			body: Profile,
		},
		handler: async (request, reply) => {
			const newProfile: any = request.body;
			return createProfileController(profiles, newProfile);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/profiles/:id',
		schema: {
			summary: 'Update a coachs by id + you dont need to pass all properties',
			tags: ['Profiles'],
			body: Type.Partial(Profile),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newProfile: any = request.body;
			return createProfileController(profiles, newProfile);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/profiles/:id',
		schema: {
			summary: 'Deletes a profile',
			tags: ['Profiles'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			profiles = profiles.filter((c) => c.id !== id);

			return profiles;
		},
	});

	server.route({
		method: 'GET',
		url: '/profiles/:id',
		schema: {
			summary: 'Returns one profile or null',
			tags: ['Profiles'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Profile, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return profiles.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/profile',
		schema: {
			summary: 'Gets all contacts',
			tags: ['Profiles'],
			querystring: GetProfileQuery,
			response: {
				'2xx': Type.Array(Profile),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetProfileQuery;

			if (query.name) {
				return profiles.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return profiles;
			}
		},
	});
}
function newProfile(profiles: { id: string; name: string; phone: string; }[], newProfile: any): unknown {
	throw new Error('Function not implemented.');
}


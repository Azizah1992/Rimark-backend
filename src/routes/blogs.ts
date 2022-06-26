import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { createBlogController } from '../controllers/blogs';


const Blog = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	phone: Type.String(),
});
type Blog = Static<typeof Blog>;  //define query 

const GetBlogQuery = Type.Object({
	name: Type.Optional(Type.String()),

});
type GetBlogQuery = Static<typeof GetBlogQuery>; //to define with type box

export let blogs: Blog[] = [  //which is defined in the contrlr coachs
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
		url: '/blogs',
		schema: {
			summary: 'Creates new blog + all properties are required',
			tags: ['Coaches'],
			body: Blog,
		},
		handler: async (request, reply) => {
			const newblogs: any = request.body;
			return createBlogController(blogs, newblogs);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/blogs/:id',
		schema: {
			summary: 'Update a blogs by id + you dont need to pass all properties',
			tags: ['Blogs'],
			body: Type.Partial(Blog),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newblogs: any = request.body;
			return createBlogController(blogs, newblogs);

		},
	});

	server.route({
		method: 'DELETE',
		url: '/blogs/:id',
		schema: {
			summary: 'Deletes a blog',
			tags: ['Blogs'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			blogs = blogs.filter((c) => c.id !== id);

			return blogs;
		},
	});

	server.route({
		method: 'GET',
		url: '/blogs/:id',
		schema: {
			summary: 'Returns one blog or null',
			tags: ['Blogs'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Blog, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return blogs.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/blogs',
		schema: {
			summary: 'Gets all blogs',
			tags: ['Blogs'],
			querystring: GetBlogQuery,
			response: {
				'2xx': Type.Array(Blog),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetBlogQuery;

			if (query.name) {
				return blogs.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return blogs;
			}
		},
	});
}
function newblogs(coachs: { id: string; name: string; phone: string; }[], newblogs: any): unknown {
	throw new Error('Function not implemented.');
}


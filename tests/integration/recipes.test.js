const request = require('supertest');
const {Recipe} = require('../../models/recipe');
let server;


describe('/api/recipes', () => {
    beforeEach(()=>{server = require('../../app')});
    afterEach(async()=>{
        // console.log('Closing server...');
        await server.close();
        // console.log('server closed, cleaning db...');
        await Recipe.deleteMany({});
        // console.log('db cleaned..');
    });
    describe('GET/',() =>{
        it('Should return all the recipes', async () => {
            await Recipe.collection.insertMany([
                {name: 'recipe1'},
                {name: 'recipe2'},
                {name: 'recipe3'}
            ])
            //
            const res = await request(server).get('/api/recipes');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(r => r.name === 'recipe1')).toBeTruthy();
        })
    });
    describe('GET/:id', ()=> {
        it('Should return recipe if valid id is passed', async()=>{
            const recipe = new Recipe({ name: "recipe5" , meal: {name: 'breakfast'}});
            await recipe.save();
            console.log('Saved recipe:', recipe);
            const res = await request(server).get('/api/recipes/'+ recipe._id);
            console.log('response: ', res.body);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', recipe.name);
 
        });
        it('Should return 404 if invalid id is passed', async()=>{
   
            const res = await request(server).get('/api/recipes/1');

            expect(res.status).toBe(404);
 
        });
    });
    describe('POST /', ()=>{
        it('', ()=>{
            
        })
    })
})
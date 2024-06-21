const request = require('supertest');
const { Recipe } = require('../../models/recipe');
const { User } = require('../../models/user');
const { Meal } = require('../../models/meal');

let server;


describe('/api/recipes', () => {
    beforeEach(async()=>{
        server = require('../../app');
        await Meal.collection.insertMany([
            { name: 'breakfast' },
        ]);
    });
    afterEach(async()=>{
        // console.log('Closing server...');
        await server.close();
        // console.log('server closed, cleaning db...');
        await Recipe.deleteMany({});
        // console.log('db cleaned..');
        await User.deleteMany({});
        await Meal.deleteMany({});
    });
    describe('GET/',() =>{
        it('Should return all the recipes', async () => {
            await Recipe.collection.insertMany([
                {name: 'recipe1'},
                {name: 'recipe2'},
                {name: 'recipe3'}
            ]);
            //
            const res = await request(server).get('/api/recipes');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(r => r.name === 'recipe1')).toBeTruthy();
        });
    });
    describe('GET/:id', ()=> {
        it('Should return recipe if valid id is passed', async()=>{
            const recipe = new Recipe({ name: "recipe5" , meal: {name: 'breakfast'} });
            await recipe.save();
            console.log('Saved recipe5:', recipe);

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
        it('Should return 401 if the client is not logged in', async()=>{
            const res = await request(server)
                .post('/api/recipes')
                .send({name:'recipe6', meal:{name:'breakfast'} });
            expect(res.status).toBe(401);
        });
        it('Should return 400 if recipe is less than 5 characters', async()=>{
            const user = new User({ name: 'testuser0', email: 'testuser0@test.com', password: 'P@ssw0rd0', isAdmin: true });
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .post('/api/recipes')
                .set('x-auth-token', token)
                .send({name:'123', meal:{name:'breakfast'}});
            console.log('new recipe less5:', res.body);
            expect(res.status).toBe(400);

        });
        it('Should return 400 if recipe is more than 50 characters', async()=>{
            const user = new User({ name: 'testuser', email: 'testuser@test.com', password: 'P@ssw0rd', isAdmin: true });
            await user.save();
            const token = user.generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server)
                .post('/api/recipes')
                .set('x-auth-token', token)
                .send({name: name, meal:{name:'breakfast'}});
            console.log('new recipemore50:', res.body);
            expect(res.status).toBe(400);

        });
        it('Should save the recipe if it is valid', async()=>{
            const user = new User({ name: 'testuser2', email: 'testuser2@test.com', password: 'P@ssw0rd2', isAdmin: true })
            await user.save();
            const token = user.generateAuthToken();
            const meal = await Meal.findOne({ name: 'breakfast' });
            const res = await request(server)
                .post('/api/recipes')
                .set('x-auth-token', token)
                .send({name: 'pizza', mealId: meal._id.toString() });
            console.log('Response after saving recipe (valid):', res.body);
            const recipe = await Recipe.findOne({name: 'pizza', 'meal.name': 'breakfast'});
            console.log('saved recipe(valid):', recipe);
            expect(recipe).not.toBeNull;

        });
        it('Should return the recipe if it is valid', async()=>{
            const user = new User({ name: 'testuser3', email: 'testuser3@test.com', password: 'P@ssw0rd3', isAdmin: true });
            await user.save();
            const token = user.generateAuthToken();

            const meal = await Meal.findOne({ name: 'breakfast' });
            const res = await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send({name: 'pizzaa', mealId:meal._id.toString()});
            console.log('Response Body:', res.body);
            
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", 'pizzaa');


        });
    })
})
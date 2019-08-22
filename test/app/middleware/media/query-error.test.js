const test = require('ava');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');

test.beforeEach(t => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Returns 404 if no uploaded file records found', async t => {
  const {app} = t.context;
  const response = await app.get('/media')
    .set('Accept', 'application/json')
    .query({q: 'last'});
  t.is(response.status, 404);
  t.is(response.body.error_description, 'no uploaded file records found');
});
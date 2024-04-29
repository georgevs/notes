import express from 'express';
import createError from 'http-errors';

export default function todos(db) {
  const router = express.Router();
  
  router.route('/')
    .get((req, res, next) => {
      const sql = 'SELECT * FROM todos.ToDos';
      db.query({ sql }, (err, results) => {
        if (err) { next(err) }
        else { res.json(results) }
      });
    })
    .all(() => { throw createError.MethodNotAllowed() });

  router.route('/:id')
    .get((req, res, next) => {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) { throw createError.BadRequest('Invalid id') }
      const sql = 'SELECT * FROM todos.ToDos WHERE id=?';
      const values = [id];
      db.query({ sql, values }, (err, results) => {
        if (!results?.length) { err = createError.NotFound() }
        if (err) { next(err) }
        else { res.json(results[0]) }
      });
    })
    .all(() => { throw createError.MethodNotAllowed() });

  return router;
}

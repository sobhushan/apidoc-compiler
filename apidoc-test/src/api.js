
  /**
 * @api {get} /users Get users (optional filter by name)
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiParam {String} [name] Optional name filter.
 *
 * @apiSuccess {Number} id User's unique ID.
 * @apiSuccess {String} name User's name.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       { "id": 1, "name": "John Doe" },
 *       { "id": 2, "name": "Jane Smith" }
 *     ]
 */
app.get("/users", (req, res) => {
  const users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" }
  ];
  if (req.query.name) {
      return res.json(users.filter(user => user.name.includes(req.query.name)));
  }
  res.json(users);
});

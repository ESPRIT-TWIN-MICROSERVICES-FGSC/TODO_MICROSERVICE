const express = require("express");
const { check, validationResult } = require("express-validator/check");
const Todo = require("../../models/Todo");

const router = express.Router();

//@Route POST /todo
// @Description  Add a todo route
// @Access Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("priority", "Priority is required").not().isEmpty(),
    check("due", "due is required").not().isEmpty(),
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, priority, due } = req.body;

    try {
      // This doesn't create the todo it just create an inctance of it (we have to implement the .save();)
      let todo = new Todo({
        name,
        priority,
        due,
      });

      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@Route POST /todo
// @Description  get todos route
// @Access Public
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@route DELETE /todo/:id
//@desc DELETE todo by id
//@access Public

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    await todo.remove();
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Todo not Found " });
    }
    res.status(500).send("Server error");
  }
});

//@route UPDATE /todo/:id
//@desc update a todo
//@access Public
router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("priority", "Priority is required").not().isEmpty(),
    check("due", "due is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTodo = {
        name: req.body.name,
        priority: req.body.priority,
        due: req.body.due,
      };

      let todo = await Todo.findOne({ _id: req.params.id });

      if (!todo) {
        return res.status(404).json({ message: "Todo doesn't exist " });
      }

      if (todo) {
        todo = await Todo.findOneAndUpdate(
          { _id: req.params.id },
          { $set: newTodo },
          { new: true }
        );
        return res.json(todo);
      }

      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Todo not Found " });
      }
      res.status(500).send("Server error");
    }
  }
);

//@Route POST /todo
// @Description  Done route
// @Access Public
router.post(
  "/done/:id",

  async (req, res) => {
    try {
      let todo = await Todo.findOne({ _id: req.params.id });

      todo.done = true;

      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@Route POST /todo
// @Description  Undone route
// @Access Public
router.post(
    "/undone/:id",
  
    async (req, res) => {
      try {
        let todo = await Todo.findOne({ _id: req.params.id });
  
        todo.done = false;
  
        await todo.save();
        res.json(todo);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    }
  );

module.exports = router;

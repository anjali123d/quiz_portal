const express = require("express");
const Question = require("../models/Question");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ==============================
   ✅ ADD QUESTION
   POST /api/quiz/add
============================== */
router.post("/add", auth, async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;

        if (!question || !options || !correctAnswer) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (options.length !== 4) {
            return res.status(400).json({ message: "Must have 4 options" });
        }

        const newQuestion = await Question.create({
            question,
            options,
            correctAnswer,
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: "Error adding question" });
    }
});

/* ==============================
   ✅ GET ALL QUESTIONS
   GET /api/quiz/all
============================== */
router.get("/all", auth, async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions" });
    }
});

/* ==============================
   ✅ GET 20 RANDOM QUESTIONS
   GET /api/quiz/questions
============================== */
router.get("/questions", auth, async (req, res) => {
    try {
        const questions = await Question.aggregate([
            { $sample: { size: 20 } },
        ]);

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz questions" });
    }
});

/* ==============================
   ✅ DELETE QUESTION
   DELETE /api/quiz/:id
============================== */
router.delete("/:id", auth, async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question" });
    }
});

/* ==============================
   ✅ UPDATE QUESTION (Optional)
   PUT /api/quiz/:id
============================== */
router.put("/:id", auth, async (req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating question" });
    }
});

module.exports = router;
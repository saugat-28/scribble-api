const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchall". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // Fetch all notes that have user ID matching current user and return
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

// ROUTE 2: Add a new Note using: GET "/api/notes/addnote". Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Title is too short').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag } = req.body
    try {
        // If there are errors in above checks then return "Bad Request" and Errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // Create a new note with title, description and tags recieved from request
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        // Save Note to Database and return
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
}
)

// ROUTE 3: Update an existing Note using: PUT "/api/notes/addnote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        // Create a New Blank Note
        const newNote = {}
        if (title) {
            newNote.title = title
        };
        if (description) {
            newNote.description = description
        };
        if (tag) {
            newNote.tag = tag
        };

        // Find the note to be updated
        const note = await Note.findById(req.params.id)
        // If Note not found return the response
        if (!note) {
            return res.status(404).send("Note not found")
        }
        // If Note found with different user ID than current user, return response
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Operation Not Allowed")
        }

        // Update Note and return response
        updatedNote = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({
            "Success": "Note has been updated Successfully",
            updatedNote
        })
    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        const note = await Note.findById(req.params.id)
        // If Note not found return response 
        if (!note) {
            return res.status(404).send("Note not found")
        }

        // If Note found with different user ID than current user, return response
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Operation Not Allowed")
        }

        // Delete Note and return response
        deletedNote = await Note.findByIdAndDelete(req.params.id)
        res.json({
            "Success": "Note has been deleted Successfully",
            deletedNote
        })
    }
    catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

module.exports = router
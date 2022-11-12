const express = require("express")
const router = express.Router()
const ToDo = require('../models/Todo')
const requireAuth = require('../middleware/permissions')
const validateToDoInput = require('../validation/toDoValidation')
const requiresAuth = require("../middleware/permissions")

router.get('/test', (req, res) => {
    res.send('Testing...')
})


router.post("/new",requireAuth  ,async (req, res) => {
    try {
        const {errors, isValid} = validateToDoInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        }
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false
        })

        await newToDo.save()

        return res.json({newToDo})

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


router.get('/current', requireAuth, async (req,res) => {
    try {
      

        const completeToDos = await ToDo.find({
        user: req.user._id,
        complete: true     
        }).sort({compltedAt: -1})

        const incompleteToDos = await ToDo.find({
            user: req.user._id,
            complte: false
        }).sort({createdAt: -1})

        return res.json({incomplete: incompleteToDos,complete: completeToDos})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/:toDoId/complete', requireAuth,async (req, res) => {
    try {
        const todo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId

        })

        if(!todo) {
            return res.status(500).json({error: 'Could not find todo'})
        }

        if(todo.complete) {
            return res.status(500).json({error: 'Todo is already completed'})
        } 

        const updatedToDo = await ToDo.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.toDoId
        }, {
            complete: true,
            completedAt: new Date(),

        }, {
            new: true
        })

        return res.json(updatedToDo)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
        
    }
})

router.put('/:toDoId/incomplete', requireAuth, async (req, res) => {
    try {
        const todo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        })

        if(!todo) {
            return res.status(404).json({msg: 'No task found'})
        }
        if(!todo.complete) {
            return res.json({msg: 'Task is already incompleted'})
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
        {
            user: req.user._id,
            _id: req.params.toDoId,
        }, 
        {
            complete: false,
            completedAt: null
        }, 
        {
            new: true,

        })
        return res.json(updatedToDo)
    
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


router.put('/:toDoId', requireAuth, async (req, res) => {
    try {
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        })

        console.log(toDo)

        if(!toDo) {
            return res.json({msg: "Could not find todo"})
        }

        const {isValid, errors} = validateToDoInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        }

        const updatedToDo = await ToDo.findByIdAndUpdate({
            user: req.user._id,
            _id: req.params.toDoId
        }, 
        {
            content: req.body.content
        }, 
        {
            new: true
        })

        return res.json(updatedToDo)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete('/:toDoId', requireAuth, async (req, res) => {
    try {
         const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        })

        if(!toDo) {
            return res.status(404).json({msg: 'No tasks found'})
        }
        
        await ToDo.findOneAndDelete({user: req.user._id, _id: req.params.toDoId})

        return res.json({sucess: true})

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})




module.exports = router
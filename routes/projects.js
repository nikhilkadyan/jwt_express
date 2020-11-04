const router = require('express').Router()
const Project = require('../models/Project')
const auth = require('./verifyToken')
const { createValidation, updateValidation } = require('../validations/project')

// Get All Projects
router.get('/', (req, res) => {
    Project.find({}, (err, result) => {
        if (err) return res.status(400).send(err)
        res.send(result)
    })
})

// Create New Project
router.post('/', auth, async (req, res) => {
    // Validation
    const { error } = createValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Create Project Object
    const project = new Project({
        title: req.body.title,
        desc: req.body.desc,
        link: req.body.link,
    })

    if (req.body.source) project.set('source', req.body.source)
    if (req.body.date) project.set('date', req.body.date)

    // Save Project to db
    try {
        const savedProject = await project.save()
        res.send(savedProject)
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

// Update Project
router.put('/:id', auth, async (req, res) => {
    // Validation
    const { error } = updateValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if project exist
    const project = await Project.findOne({ _id: req.params.id })
    if (!project) return res.status(404).send("No Project with this id exist")

    // Update Fields
    if(req.body.title) project.set('title', req.body.title)
    if(req.body.desc) project.set('desc', req.body.desc)
    if(req.body.date) project.set('date', req.body.date)
    if(req.body.link) project.set('link', req.body.link)
    if(req.body.source) project.set('source', req.body.source)

    // Update to db
    try {
        const savedProject = await project.save()
        res.send(savedProject)
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

// Delete Project
router.delete('/:id', auth, async (req, res) => {
    if(!req.params.id) return res.status(400).send('Project ID is required')

    // Check if project exist
    const project = await Project.findOne({ _id: req.params.id })
    if (!project) return res.status(404).send("No Project with this id exist")

    // Delete from db
    try {
        const deleteProject = await project.deleteOne()
        if(deleteProject) return res.send("Project Successfully Deleted")
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }

})

module.exports = router
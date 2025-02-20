module.exports = app => {
    const assets = require('../controllers/asset.controller.js');
    const authMiddleware = require('../middleware/auth.middleware.js');
    const router = require('express').Router();
    
    // Apply auth middleware to all routes
    router.use(authMiddleware);
    
    // Routes
    router.get('/', assets.findAll);
    router.post('/', assets.create);
    router.get('/:id', assets.findOne);
    router.put('/:id', assets.update);
    router.delete('/:id', assets.delete);
    
    // File upload route
    router.post('/:id/attachments', assets.uploadAttachment);
    
    // History routes
    router.get('/:id/history', assets.getHistory);
    router.post('/:id/history', assets.addHistoryEntry);
    
    app.use('/api/assets', router);
  };
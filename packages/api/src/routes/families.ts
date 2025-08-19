import express from 'express';
import {
  CreateFamilySchema,
  CreateChildSchema,
  IdParamSchema,
} from '@gitterdun/shared';
import {requireUserId} from '../utils/auth';
import {
  validateParentMembership,
  checkIsFamilyMember,
} from '../utils/familyAuthUtils';
import {
  createFamily,
  getFamilyMembers,
  getUserFamilies,
  checkUserExists,
  createChildUser,
  addChildToFamily,
} from '../utils/familyOperations';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// Authentication utility moved to ../utils/auth

// POST /api/families - create a family; creator becomes owner and parent member
router.post('/', (req, res) => {
  const userId = requireUserId(req);
  const {name} = CreateFamilySchema.parse(req.body);
  const family = createFamily(name, userId);

  res.status(201).json({success: true, data: family});
});

// GET /api/families/:id/members - list members
router.get('/:id/members', (req, res) => {
  const userId = requireUserId(req);
  const {id: familyId} = IdParamSchema.parse(req.params);

  if (!checkIsFamilyMember(userId, familyId)) {
    res.status(403).json({success: false, error: 'Forbidden'});
    return;
  }

  const data = getFamilyMembers(familyId);
  res.json({success: true, data});
});

const parseCreateChildRequest = (req: express.Request) => {
  const userId = requireUserId(req);
  const {id: familyId} = IdParamSchema.parse(req.params);
  const {username, email, password} = CreateChildSchema.parse(req.body);
  return {userId, familyId, username, email, password};
};

// POST /api/families/:id/children - owner or parent creates a child account directly
router.post('/:id/children', async (req, res) => {
  const {userId, familyId, username, email, password} =
    parseCreateChildRequest(req);

  validateParentMembership(userId, familyId);

  if (checkUserExists(email, username)) {
    res.status(409).json({success: false, error: 'User exists'});
    return;
  }

  const childId = await createChildUser(username, email, password);
  addChildToFamily(familyId, childId);

  res.status(201).json({success: true, message: 'Child created'});
});

// GET /api/families/mine - list families where current user is a member
router.get('/mine', (req, res) => {
  const userId = requireUserId(req);
  const families = getUserFamilies(userId);
  res.json({success: true, data: families});
});

export default router;

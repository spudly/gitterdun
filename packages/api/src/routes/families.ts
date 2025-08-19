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
  handleRouteError,
} from '../utils/familyOperations';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// Authentication utility moved to ../utils/auth

// POST /api/families - create a family; creator becomes owner and parent member
router.post('/', (req, res) => {
  try {
    const userId = requireUserId(req);
    const {name} = CreateFamilySchema.parse(req.body);
    const family = createFamily(name, userId);

    return res.status(201).json({success: true, data: family});
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /api/families/:id/members - list members
router.get('/:id/members', (req, res) => {
  try {
    const userId = requireUserId(req);
    const {id: familyId} = IdParamSchema.parse(req.params);

    if (!checkIsFamilyMember(userId, familyId)) {
      return res.status(403).json({success: false, error: 'Forbidden'});
    }

    const data = getFamilyMembers(familyId);
    return res.json({success: true, data});
  } catch (error) {
    return handleRouteError(res, error);
  }
});

const parseCreateChildRequest = (req: express.Request) => {
  const userId = requireUserId(req);
  const {id: familyId} = IdParamSchema.parse(req.params);
  const {username, email, password} = CreateChildSchema.parse(req.body);
  return {userId, familyId, username, email, password};
};

// POST /api/families/:id/children - owner or parent creates a child account directly
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/:id/children', async (req, res) => {
  try {
    const {userId, familyId, username, email, password} =
      parseCreateChildRequest(req);

    validateParentMembership(userId, familyId);

    if (checkUserExists(email, username)) {
      return res.status(409).json({success: false, error: 'User exists'});
    }

    const childId = await createChildUser(username, email, password);
    addChildToFamily(familyId, childId);

    return res.status(201).json({success: true, message: 'Child created'});
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /api/families/mine - list families where current user is a member
router.get('/mine', (req, res) => {
  try {
    const userId = requireUserId(req);
    const families = getUserFamilies(userId);
    return res.json({success: true, data: families});
  } catch (error) {
    return handleRouteError(res, error);
  }
});

export default router;

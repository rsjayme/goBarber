import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreteUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuntheticated from '../middleweares/ensureAuthenticated';

const UsersRouter = Router();
const upload = multer(uploadConfig);

UsersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;
    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

UsersRouter.patch(
  '/avatar',
  ensureAuntheticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  },
);

export default UsersRouter;

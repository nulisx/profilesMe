import { NextFunction, Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, name, description, email } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      res.status(400).json({ message: 'Username or email already taken' });
      return;
    }

    const profilePicture = files.profilePicture ? files.profilePicture[0].buffer : null;
    const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].buffer : null;
    const backgroundType = files.backgroundMedia
      ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
      : null;

    await pool.execute(
      `INSERT INTO users (username, name, description, email, profilePicture, backgroundMedia, backgroundType)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, name, description, email, profilePicture, backgroundMedia, backgroundType]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.params;

    await pool.execute(
      'UPDATE users SET totalVisit = totalVisit + 1 WHERE username = ?',
      [username]
    );

    const [userRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, username, name, description, profilePicture, backgroundMedia, 
       backgroundType, email, createdAt, updatedAt, totalVisit
       FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = userRows[0];
    const [linkRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, title, url, `order`, createdAt, updatedAt FROM links WHERE userId = ? ORDER BY `order` ASC',
      [user.id]
    );

    const userProfile = {
      ...user,
      profilePicture: user.profilePicture
        ? `data:image/jpeg;base64,${Buffer.from(user.profilePicture).toString('base64')}`
        : null,
      backgroundMedia: user.backgroundMedia
        ? `data:${user.backgroundType || 'image'}/jpeg;base64,${Buffer.from(user.backgroundMedia).toString('base64')}`
        : null,
      links: linkRows
    };

    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.params;
    const { name, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const [userRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (userRows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const profilePicture = files.profilePicture ? files.profilePicture[0].buffer : undefined;
    const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].buffer : undefined;
    const backgroundType = files.backgroundMedia
      ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
      : undefined;

    let updateQuery = 'UPDATE users SET name = ?, description = ?';
    const params: any[] = [name, description];

    if (profilePicture) {
      updateQuery += ', profilePicture = ?';
      params.push(profilePicture);
    }

    if (backgroundMedia) {
      updateQuery += ', backgroundMedia = ?, backgroundType = ?';
      params.push(backgroundMedia, backgroundType);
    }

    updateQuery += ' WHERE username = ?';
    params.push(username);

    await pool.execute(updateQuery, params);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.params;

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE username = ?',
      [username]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const checkUsernameAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    res.json({ available: rows.length === 0 });
  } catch (error) {
    next(error);
  }
};

export const setUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as any).id;
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, userId]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({
        exists: true,
        message: 'Username is already taken',
      });
      return;
    }

    await pool.execute(
      'UPDATE users SET username = ? WHERE id = ?',
      [username, userId]
    );

    res.status(200).json({
      exists: false,
      userId: userId,
      username: username,
      message: 'Username set successfully',
    });
  } catch (error) {
    next(error);
  }
};

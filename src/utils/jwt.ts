import jwt from 'jsonwebtoken';

const secret = '3AE52A4D774944963F8A128F17D37D79557095EA3F25BCACB264262970CBA122';

export function signToken(id: number) {
  if (!secret) throw new Error('Environment variable JWT_SECRET is not defined!');
  return new Promise<string>((resolve, reject) => {
    jwt.sign({ id }, secret, {expiresIn:'10h'}, (err, token) => {
      if (err || !token) return reject(err);
      resolve(token);
    })
  })
}

export function verifyToken(token: string) {
  if (!secret) throw new Error('Environment variable JWT_SECRET is not defined!');
  return new Promise<{ id: number }>((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err || !payload || !payload) return reject(err);
      resolve(payload as { id: number });
    })
  })
}
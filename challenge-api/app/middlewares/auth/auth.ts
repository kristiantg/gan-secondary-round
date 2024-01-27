import * as express from 'express';

const getTokenFromHeaders = (req: express.Request): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const requestTime = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = getTokenFromHeaders(req);

    if(token !== "dGhlc2VjcmV0dG9rZW4="){
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Wrong credentials given.',
          });
    }

    next()
  }

const auth = {
  required: requestTime,
  optional: {}
};

export default auth;
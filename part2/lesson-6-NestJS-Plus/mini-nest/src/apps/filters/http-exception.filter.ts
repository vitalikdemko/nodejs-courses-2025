import { UsePipes } from '../../core/decorators/index';
import { HttpException } from '../../core/http/http-exception';
@UsePipes()
export class HttpExceptionFilter {
  catch(err: any, res: any) {
    if (err instanceof HttpException) {
      res.statusCode = err.status;
      res.end(JSON.stringify({ message: err.message }));
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  }
}
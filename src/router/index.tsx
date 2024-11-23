import { createBrowserRouter } from 'react-router-dom';
import TosOperators from '../pages/TosOperators';

const router = createBrowserRouter([
  // ... 其他路由配置 ...
  {
    path: '/tos/operators',
    element: <TosOperators />
  }
]);

export default router; 
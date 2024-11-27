import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import TosServices from '../pages/TosServices';
import TosOperators from '../pages/TosOperators';
import TosDetail from '../pages/TosDetail';
import Developer from '../pages/Developer';
import MorphicAI from '../pages/MorphicAI';
import Docs from '../pages/Docs';
import AgentChat from '../pages/AgentChat';
import MorphicKMS from '../pages/MorphicKMS';
import OperatorDetail from '../pages/OperatorDetail';


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/tos-services',
        element: <TosServices />
      },
      {
        path: '/tos-services/:id',
        element: <TosDetail />
      },
      {
        path: '/tos-operators',
        element: <TosOperators />
      },
      {
        path: '/developer',
        element: <Developer />
      },
      {
        path: '/morphic-ai',
        element: <MorphicAI />
      },
      {
        path: '/docs',
        element: <Docs />
      },
      {
        path: '/agent-chat/:id',
        element: <AgentChat />
      },
      {
        path: '/morphic-kms',
        element: <MorphicKMS />
      },
      {
        path: '/operator/:id',
        element: <OperatorDetail />
      }
    ]
  }
]);

export default router; 
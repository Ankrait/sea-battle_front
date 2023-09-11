import { createHashRouter } from 'react-router-dom';
import App from '../App';
import HomeLayout from '../pages/Home/HomeLayout';
import HomeMain from '../pages/Home/HomeMain/HomeMain';
import HomeCreate from '../pages/Home/HomeCreate/HomeCreate';
import HomeConnect from '../pages/Home/HomeConnect/HomeConnect';
import Game from '../pages/Game/Game';

export const router = createHashRouter([
	{
		path: '/',
		element: <App />,
		// loader: rootLoader,
		// errorElement: <Error />,
		children: [
			{
				path: '/',
				element: <HomeLayout />,
				children: [
					{
						path: '/',
						element: <HomeMain />,
					},
					{
						path: '/create',
						element: <HomeCreate />,
					},
					{
						path: '/connect',
						element: <HomeConnect />,
					},
				],
			},
			{
				path: '/game/:id',
				element: <Game />,
			},
		],
	},
]);

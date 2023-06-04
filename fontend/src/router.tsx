import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout'

import CpanelLayout from 'src/layouts/Cpanel'

import SuspenseLoader from 'src/components/SuspenseLoader';

import AuthLayout from 'src/layouts/Auth'
import Profile from 'src/content/blog/Profile'


const Loader = (Component) => (props) =>
(
	<Suspense fallback={<SuspenseLoader />}>
		<Component {...props} />
	</Suspense>
);

// Pages

const Overview = Loader(lazy(() => import('src/content/overview')));

// Dashboards

const Home = Loader(lazy(() => import('src/content/blog/Home')));

const Topic = Loader(lazy(() => import('src/content/blog/Topic')))

const Posts = Loader(lazy(() => import('src/content/blog/Posts')))

const Detail = Loader(lazy(() => import('src/content/blog/Detail')))
// Applications
// const Cpanel = Loader(lazy(()=> import('src/content/Cpanel')))
const Crypto = Loader(lazy(() => import('src/content/Cpanel/Home')))
const CpanelAccount = Loader(lazy(() => import('src/content/Cpanel/Account')))
//Auth
const Register = Loader(lazy(() => import('src/content/Auth/Register')))

const Login = Loader(lazy(() => import('src/content/Auth/Login')))

const UserProfile = Loader(
	lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
	lazy(() => import('src/content/applications/Users/settings'))
);

// Components

const Buttons = Loader(
	lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
	lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
	lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
	lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
	lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
	lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

const Emailverification = Loader(lazy(() => import('src/content/EmailVerification')));
const UndoEmail = Loader(lazy(() => import('src/content/EditEmail/UndoEmail')))
// Status

const Status404 = Loader(
	lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
	lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
	lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
	lazy(() => import('src/content/pages/Status/Maintenance'))
)

const Friend = Loader(lazy(() => import('src/content/blog/Friend')));
const ListFriend = Loader(lazy(() => import('src/content/blog/Friend/List')))
const PostsFriend = Loader(lazy(() => import('src/content/blog/Friend/Posts')))

const routes: RouteObject[] = [
	{
		path: '',
		element: <SidebarLayout />,
		children: [
			{
				path: '/',
				element: <Navigate to="home" replace />
			},
			{
				path: 'home',
				element: <Home />
			},
			{
				path: 'topic',
				element: <Topic />
			},
			{
				path: 'posts',
				element: <Posts />
			},
			{
				path: 'post',
				children: [
					{
						path: '',
						element: <Navigate to="/topic" replace />
					},
					{
						path: ':id',
						element: <Detail />
					},
					{
						path: ':id/:url',
						element: <Detail />
					}
				]
			},
			{
				path: 'profile',
				element: <Profile />
			},
			{
				path: 'confirm',
				element: <Emailverification />
			},
			{
				path: 'undo',
				element: <UndoEmail />
			},
			{
				path: 'friend',
				children: [
					{
						path: '',
						element: <Navigate to="posts" replace />
					},
					{
						path: 'list',
						element: <ListFriend />
					},
					{
						path: 'posts',
						element: <PostsFriend />
					}
				]
			}
		]
	},
	{
		path: 'error',
		element: <Status500 />
	},
	{
		path: '*',
		element: <Status404 />
	},
	{
		path: 'user',
		element: <SidebarLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="details" replace />
			},
			{
				path: 'details',
				element: <UserProfile />
			},
			{
				path: 'settings',
				element: <UserSettings />
			}


		]
	},
	{
		path: '/auth',
		element: <AuthLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="login" replace />

			},
			{
				path: 'login',
				element: <Login />
			},
			{
				path: 'register',
				element: <Register />
			}
		]
	},
	{
		path: '/cpanel',
		element: <CpanelLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="index" replace />

			},
			{
				path: 'index',
				element: <Crypto />
			},
			{
				path: 'user',
				element: <CpanelAccount />
			}
		]

	},
	{
		path: '/components',
		element: <SidebarLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="buttons" replace />
			},
			{
				path: 'buttons',
				element: <Buttons />
			},
			{
				path: 'modals',
				element: <Modals />
			},
			{
				path: 'accordions',
				element: <Accordions />
			},
			{
				path: 'tabs',
				element: <Tabs />
			},
			{
				path: 'badges',
				element: <Badges />
			},
			{
				path: 'tooltips',
				element: <Tooltips />
			},
			{
				path: 'avatars',
				element: <Avatars />
			},
			{
				path: 'cards',
				element: <Cards />
			},
			{
				path: 'forms',
				element: <Forms />
			}
		]
	}
]

export default routes


export const routesError: RouteObject[] = [
	{
		path: '',
		element: <Status500 />
	},
	{
		path: '*',
		element: <Status500 />
	}
]

import App from "./App";
import Home from "./pages/Home/Home";
import Post from "./pages/Post/Post";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import NotFound from "./pages/NotFound/NotFound";

const routes = [
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "posts/:id", element: <Post /> },
			{ path: "login", element: <Login /> },
			{ path: "signup", element: <Signup /> },
			{ path: "*", element: <NotFound /> },
		],
	},
];

export default routes;

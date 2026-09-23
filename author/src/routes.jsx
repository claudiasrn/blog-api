import App from "./App";
import Login from "./pages/Login/Login";
import Posts from "./pages/Posts/Posts";
import NewPost from "./pages/NewPost/NewPost";
import EditPost from "./pages/EditPost/EditPost";
import PostComments from "./pages/PostComments/PostComments";
import NotFound from "./pages/NotFound/NotFound";
import RequireAuthor from "./components/RequireAuthor/RequireAuthor";

const routes = [
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <RequireAuthor><Posts /></RequireAuthor> },
			{ path: "login", element: <Login /> },
			{ path: "posts/new", element: <RequireAuthor><NewPost /></RequireAuthor> },
			{ path: "posts/:id/edit", element: <RequireAuthor><EditPost /></RequireAuthor> },
			{ path: "posts/:id/comments", element: <RequireAuthor><PostComments /></RequireAuthor> },
			{ path: "*", element: <NotFound /> },
		],
	},
];

export default routes;
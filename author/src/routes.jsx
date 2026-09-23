import App from "./App";
import Login from "./pages/Login/Login";
import Posts from "./pages/Posts/Posts";
import NewPost from "./pages/NewPost/NewPost";
import EditPost from "./pages/EditPost/EditPost";
import PostComments from "./pages/PostComments/PostComments";
import NotFound from "./pages/NotFound/NotFound";

const routes = [
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Posts /> },
			{ path: "login", element: <Login /> },
			{ path: "posts/new", element: <NewPost /> },
			{ path: "posts/:id/edit", element: <EditPost /> },
			{ path: "posts/:id/comments", element: <PostComments /> },
			{ path: "*", element: <NotFound /> },
		],
	},
];

export default routes;
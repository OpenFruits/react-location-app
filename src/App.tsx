import axios from "axios";
import type { MakeGenerics } from "react-location";
import { Link, Outlet, ReactLocation, Router, useMatch } from "react-location";

type PostType = {
  id: string;
  title: string;
  body: string;
};

type LocationGenerics = MakeGenerics<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LoaderData: {
    posts: PostType[];
    post: PostType;
  };
}>;

// Set up a ReactLocation instance
const location = new ReactLocation();

export const App = () => {
  return (
    // Build our routes and render our router
    <Router
      location={location}
      routes={[
        { path: "/", element: <Index /> },
        {
          path: "posts",
          element: <Posts />,
          loader: async () => {
            return {
              posts: await fetchPosts(),
            };
          },
          children: [
            { path: "/", element: <PostsIndex /> },
            {
              path: ":postId",
              element: <Post />,
              loader: async ({ params: { postId } }) => {
                return {
                  post: await fetchPostById(postId),
                };
              },
            },
          ],
        },
      ]}
    >
      <div>
        <Link to="/" getActiveProps={getActiveProps} activeOptions={{ exact: true }}>
          Home
        </Link>{" "}
        <Link to="posts" getActiveProps={getActiveProps}>
          Posts
        </Link>
      </div>
      <hr />
      <Outlet /> {/* Start rendering router matches */}
    </Router>
  );
};

const fetchPosts = async () => {
  await new Promise((r) => {
    return setTimeout(r, 300);
  });
  return await axios.get("https://jsonplaceholder.typicode.com/posts").then((r) => {
    return r.data.slice(0, 5);
  });
};

const fetchPostById = async (postId: string) => {
  await new Promise((r) => {
    return setTimeout(r, 300);
  });

  return await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then((r) => {
    return r.data;
  });
};

const Index = () => {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
};

const Posts = () => {
  const {
    data: { posts },
  } = useMatch<LocationGenerics>();

  return (
    <div>
      <div>
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Link to={post.id} getActiveProps={getActiveProps}>
                <pre>{post.title}</pre>
              </Link>
            </div>
          );
        })}
      </div>
      <hr />
      <Outlet />
    </div>
  );
};

const PostsIndex = () => {
  return (
    <>
      <div>Select an post.</div>
    </>
  );
};

const Post = () => {
  const {
    data: { post },
  } = useMatch<LocationGenerics>();

  return (
    <div>
      <h4>{post?.title}</h4>
      <p>{post?.body}</p>
    </div>
  );
};

const getActiveProps = () => {
  return {
    className: "font-bold text-red-600",
  };
};

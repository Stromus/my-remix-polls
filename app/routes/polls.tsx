import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";
import { getPollByUser } from "~/models/poll.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    const pollsListItems = await getPollByUser({ createdById: userId });
    return json({ pollsListItems });
  }
  return json({ pollsListItems: [] });
}

export default function PollsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Polls</Link>
        </h1>
        {user ? (
          <>
            <p>{user.email}</p>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>
          </>
        ) : (
          <Form action="/login" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Login
            </button>
          </Form>
        )}
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {user && (
            <>
              <Link to="new" className="block p-4 text-xl text-blue-500">
                + New Poll
              </Link>

              <hr />
            </>
          )}
          {data.pollsListItems.length === 0 ? (
            <p className="p-4">
              {user ? (
                "No polls yet"
              ) : (
                <Link to="/login" className="hover:underline">
                  Login to create polls
                </Link>
              )}
            </p>
          ) : (
            <ol>
              {data.pollsListItems.map((poll) => (
                <li key={poll.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={poll.id}
                  >
                    📝 {poll.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

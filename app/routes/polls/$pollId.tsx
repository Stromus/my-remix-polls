import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";

import { deletePoll, getPoll } from "~/models/poll.server";
import { useOptionalUser } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  const poll = await getPoll({ id: params.pollId ?? "" });
  if (!poll) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ poll });
}

export async function action({ request, params }: ActionArgs) {
  await deletePoll({ id: params.pollId ?? "" });

  return redirect("/polls");
}

export default function PollDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.poll.title}</h3>
      <p className="py-6">{data.poll.description}</p>
      <hr className="my-4" />
      {user && (
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
      )}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Poll not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

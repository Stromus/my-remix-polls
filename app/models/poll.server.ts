import type { User, Poll } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Poll } from "@prisma/client";

export function getPoll({ id }: { id: Poll["id"] }) {
  return prisma.poll.findFirst({
    select: { id: true, description: true, title: true, choices: true },
    where: { id },
  });
}

export function getPolls() {
  return prisma.poll.findMany({
    select: { id: true, title: true, description: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getPollByUser({ createdById }: { createdById: User["id"] }) {
  return prisma.poll.findMany({
    where: { createdById },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPoll({
  description,
  title,
  createdById,
}: Pick<Poll, "description" | "title"> & {
  createdById: User["id"];
}) {
  return prisma.poll.create({
    data: {
      title,
      description,
      createdBy: {
        connect: {
          id: createdById,
        },
      },
    },
  });
}

export function deletePoll({ id }: Pick<Poll, "id">) {
  return prisma.poll.deleteMany({
    where: { id },
  });
}

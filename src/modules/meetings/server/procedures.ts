import { z } from "zod";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { TRPCError } from "@trpc/server";

import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { MeetingsInsertSchema, MeetingsUpdateSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(MeetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      // TODO: Create Stream Call, Upsert Stream Users

      return createdMeeting;
    }),
  update: protectedProcedure
    .input(MeetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [selectedMeeting] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!selectedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting already removed or not found",
        });
      }

      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id, selectedMeeting.id),
            eq(meetings.userId, selectedMeeting.userId)
          )
        )
        .returning();

      return updatedMeeting;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [selectedMeeting] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!selectedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting already removed or not found",
        });
      }

      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, selectedMeeting.id),
            eq(meetings.userId, selectedMeeting.userId)
          )
        )
        .returning();

      return removedMeeting;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const data = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});

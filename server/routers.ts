import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createParentLead } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const DISTRICTS = ["中西區", "灣仔區", "東區", "南區", "油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區", "葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"] as const;
export const leadInput = z.object({
  parentName: z.string().trim().min(2, "請填寫家長稱呼").max(120),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{8,32}$/, "請填寫有效聯絡電話"),
  district: z.enum(DISTRICTS),
  grade: z.string().trim().min(2).max(8),
  track: z.string().trim().min(2).max(64),
  score: z.number().int().min(0).max(20),
  weaknessSummary: z.string().trim().min(1).max(2000),
  consent: z.literal(true, { error: "需要同意資料用於學習跟進" }),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  assessment: router({
    submitParentLead: publicProcedure.input(leadInput).mutation(async ({ input }) => {
      await createParentLead({
        parentName: input.parentName,
        phone: input.phone,
        district: input.district,
        grade: input.grade,
        track: input.track,
        score: input.score,
        weaknessSummary: input.weaknessSummary,
        consentAt: new Date(),
      });
      return { success: true } as const;
    }),
  }),

});

export type AppRouter = typeof appRouter;

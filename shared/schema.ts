import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

export const searchResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  thickness: z.string(),
  nos: z.string(),
  grind: z.string(),
  net: z.string(),
  epoxy: z.string(),
  polish: z.string(),
  lea: z.string(),
  lap: z.string(),
  hon: z.string(),
  shot: z.string(),
  polR: z.string(),
  flam: z.string(),
  bal: z.string(),
  bSP: z.string(),
  edge: z.string(),
  trim: z.string(),
  meas: z.string(),
  lCm: z.string(),
  hCm: z.string(),
  status: z.string(),
  date: z.string(),
  color1: z.string(),
  color2: z.string()
});

export const grindResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  thickness: z.string(),
  finish: z.string(),
  nos: z.string(),
  re: z.string(),
  lCm: z.string(),
  hCm: z.string(),
  sft: z.string(),
  date: z.string(),
  shift: z.string(),
  machine: z.string(),
  remark: z.string(),
  slabNo: z.string()
});

export const polishResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  thickness: z.string(),
  finish: z.string(),
  nos: z.string(),
  re: z.string(),
  lCm: z.string(),
  hCm: z.string(),
  sft: z.string(),
  date: z.string(),
  shift: z.string(),
  machine: z.string(),
  remark: z.string(),
  slabNo: z.string()
});

export const epoxyResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  thickness: z.string(),
  finish: z.string(),
  nos: z.string(),
  type: z.string(),
  ratio: z.string(),
  aKg: z.string(),
  bKg: z.string(),
  cKg: z.string(),
  lCm: z.string(),
  hCm: z.string(),
  sft: z.string(),
  date: z.string(),
  shift: z.string(),
  machine: z.string(),
  remark: z.string(),
  slabNo: z.string(),
  factoryColor: z.string(),
  subColor: z.string()
});


export type SearchResult = z.infer<typeof searchResultSchema>;
export type GrindResult = z.infer<typeof grindResultSchema>;
export type PolishResult = z.infer<typeof polishResultSchema>;
export type EpoxyResult = z.infer<typeof epoxyResultSchema>;
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export interface SearchResult {
  blockNo: string;
  partNo: string;
  thickness: string;
  nos: string;
  grind: string;
  net: string;
  epoxy: string;
  polish: string;
  lea: string;
  lap: string;
  hon: string;
  shot: string;
  polR: string;
  flam: string;
  bal: string;
  bSP: string;
  edge: string;
  trim: string;
  meas: string;
  lCm: string;
  hCm: string;
  status: string;
  date: string;
  color1: string;
  color2: string;
}

export interface GrindResult {
  blockNo: string;
  partNo: string;
  thickness: string;
  finish: string;
  nos: string;
  re: string;
  lCm: string;
  hCm: string;
  sft: string;
  date: string;
  shift: string;
  machine: string;
  remark: string;
  slabNo: string;
}

export interface PolishResult {
  blockNo: string;
  partNo: string;
  thickness: string;
  finish: string;
  nos: string;
  re: string;
  lCm: string;
  hCm: string;
  sft: string;
  date: string;
  shift: string;
  machine: string;
  remark: string;
  slabNo: string;
}

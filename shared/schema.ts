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


export const mastersheetResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  facStoneColor: z.string(),
  subColor: z.string(),
  mnL: z.string(),
  mnH: z.string(),
  mnW: z.string(),
  mnCbm: z.string(),
  fnL: z.string(),
  fnH: z.string(),
  fnW: z.string(),
  fnCbm: z.string(),
  location: z.string(),
  type: z.string(),
  remarks2: z.string(),
  rcvdDt: z.string(),
  markerNo: z.string(),
  sp: z.string(),
  mgL: z.string(),
  mgH: z.string(),
  mgW: z.string(),
  mgCbm: z.string(),
  quality: z.string(),
  shift: z.string(),
  mc: z.string(),
  date: z.string(),
  slabL: z.string(),
  slabH: z.string(),
  t1_6: z.string(),
  t1_8: z.string(),
  t2: z.string(),
  t3: z.string(),
  t4: z.string(),
  t5: z.string(),
  t6: z.string(),
  t7: z.string(),
  t8: z.string(),
  t10: z.string(),
  t12: z.string(),
  t15: z.string(),
  t20: z.string(),
  t25: z.string(),
  width: z.string(),
  sliceNos: z.string(),
  leftOverWidth: z.string(),
  wastePctFn: z.string(),
  wastePctFn5: z.string(),
  wastePctMn: z.string(),
  total: z.string(),
  oprSft: z.string(),
  sln: z.string(),
  stDate: z.string(),
  r: z.string()
});

export const gpStockResultSchema = z.object({
  slicingDate: z.string(),
  blockNo: z.string(),
  partNo: z.string(),
  colorName: z.string(),
  length: z.string(),
  height: z.string(),
  thickness: z.string(),
  nos: z.string(),
  dispatched: z.string(),
  eCut: z.string(),
  balance: z.string(),
  stockNos: z.string(),
  m2: z.string(),
  remarks: z.string(),
  location: z.string(),
  mainLocation: z.string(),
  colourName: z.string(),
  subColour: z.string(),
  sp: z.string(),
  remark2: z.string()
});

export type SearchResult = z.infer<typeof searchResultSchema>;
export type GrindResult = z.infer<typeof grindResultSchema>;
export type PolishResult = z.infer<typeof polishResultSchema>;
export type MastersheetResult = z.infer<typeof mastersheetResultSchema>;
export type EpoxyResult = z.infer<typeof epoxyResultSchema>;
export type GPStockResult = z.infer<typeof gpStockResultSchema>;

export const summaryResultSchema = z.object({
  blockNo: z.string(),
  partNo: z.string(),
  thkCm: z.string(),
  slicing: z.string(),
  export: z.string(),
  rework: z.string(),
  edgeCut: z.string(),
  pkl: z.string(),
  ctrStock: z.string(),
  stock: z.string(),
  d: z.string(),
  dS: z.string(),
  eC: z.string(),
  s: z.string(),
  sold: z.string(),
  add: z.string(),
  dSlash: z.string(),
  edgeCutting: z.string()
});

export type SummaryResult = z.infer<typeof summaryResultSchema>;

export const cpStockResultSchema = z.object({
  type: z.string(),
  slicedOn: z.string(),
  colourName: z.string(),
  blockNo: z.string(),
  partNo: z.string(),
  length: z.string(),
  height: z.string(),
  thickness: z.string(),
  nos: z.string(),
  dispatched: z.string(),
  edgeCutting: z.string(),
  balance: z.string(),
  m2: z.string(),
  sidePc: z.string(),
  location: z.string(),
  remarks: z.string(),
  facColour: z.string(),
  subColour: z.string(),
  check: z.string(),
  null: z.string(),
  d: z.string(),
  act: z.string(),
  r: z.string()
});

export type CPStockResult = z.infer<typeof cpStockResultSchema>;
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

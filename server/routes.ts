import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { searchSheetData, getDisReportData, getDisRptData, getGrindData, getPolishData, getEpoxyData, getEColData, getMastersheetData, getGPStockData, getSummaryData, getCPStockData, getSummary2Data } from "./google-sheets";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/search", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await searchSheetData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).send("Failed to fetch search results");
    }
  });

  app.get("/api/dis-report", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).json({ message: "Block number is required" });
    }

    try {
      const results = await getDisReportData(
        blockNo,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Dis Report error:', error);
      res.status(500).json({ message: "Failed to fetch Dis Report results" });
    }
  });

  app.get("/api/dis-rpt", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getDisRptData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Main Page 2 error:', error);
      res.status(500).send("Failed to fetch Main Page 2 results");
    }
  });

  app.get("/api/cpstock", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getCPStockData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('CPStock search error:', error);
      res.status(500).send("Failed to fetch CPStock data");
    }
  });

  app.get("/api/summary2", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getSummary2Data(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Summary2 search error:', error);
      res.status(500).send("Failed to fetch Summary2 data");
    }
  });

  app.get("/api/summary", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getSummaryData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Summary search error:', error);
      res.status(500).send("Failed to fetch Summary data");
    }
  });

  app.get("/api/gpstock", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getGPStockData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('GPStock search error:', error);
      res.status(500).send("Failed to fetch GPStock data");
    }
  });

  app.get("/api/mastersheet", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getMastersheetData(
        blockNo,
        partNo as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Mastersheet search error:', error);
      res.status(500).send("Failed to fetch Mastersheet data");
    }
  });

  app.get("/api/grind", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getGrindData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Grind search error:', error);
      res.status(500).send("Failed to fetch Grind search results");
    }
  });

  app.get("/api/polish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getPolishData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Polish search error:', error);
      res.status(500).send("Failed to fetch Polish search results");
    }
  });

  app.get("/api/epoxy", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getEpoxyData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('Epoxy search error:', error);
      res.status(500).send("Failed to fetch Epoxy search results");
    }
  });

  app.get("/api/ecol", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { blockNo, partNo, thickness } = req.query;

    if (!blockNo || typeof blockNo !== "string") {
      return res.status(400).send("Block number is required");
    }

    try {
      const results = await getEColData(
        blockNo,
        partNo as string | undefined,
        thickness as string | undefined
      );
      res.json(results);
    } catch (error) {
      console.error('ECol search error:', error);
      res.status(500).send("Failed to fetch ECol search results");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
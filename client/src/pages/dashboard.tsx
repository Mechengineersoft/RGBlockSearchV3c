import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdDashboard } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchResult, GPStockResult, SummaryResult, CPStockResult, Summary2Result } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useState, useCallback } from "react";

export default function DashboardPage() {
  const [blockNo, setBlockNo] = useState("");
  const [partNo, setPartNo] = useState("");
  const [thickness, setThickness] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeInput, setActiveInput] = useState("");

  const startListening = useCallback((inputField: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setActiveInput(inputField);
    };

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript.toLowerCase();
      
      transcript = transcript.replace(/\b(single|one)\b/gi, '1')
        .replace(/\b(double|two)\b/gi, '2')
        .replace(/\b(triple|three)\b/gi, '3')
        .replace(/\b(quadruple|four)\b/gi, '4')
        .replace(/\b(quintuple|five)\b/gi, '5')
        .replace(/\bzero\b/gi, '0')
        .replace(/\bsix\b/gi, '6')
        .replace(/\bseven\b/gi, '7')
        .replace(/\beight\b/gi, '8')
        .replace(/\bnine\b/gi, '9');

      transcript = transcript.replace(/(single|one|double|two|triple|three|quadruple|four|quintuple|five)\s+(\d)/gi, (_, multiplier, digit) => {
        const count = {
          'single': 1, 'one': 1,
          'double': 2, 'two': 2,
          'triple': 3, 'three': 3,
          'quadruple': 4, 'four': 4,
          'quintuple': 5, 'five': 5
        }[multiplier.toLowerCase()] || 1;
        return digit.repeat(count);
      });

      if (transcript.split(' ').every(word => word.length === 1)) {
        transcript = transcript.replace(/\s+/g, '');
      }

      switch (inputField) {
        case 'blockNo':
          setBlockNo(transcript);
          break;
        case 'partNo':
          setPartNo(transcript);
          break;
        case 'thickness':
          setThickness(transcript);
          break;
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setActiveInput("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveInput("");
    };

    recognition.start();
  }, []);

  const { data: summaryResults, isLoading: isSummaryLoading, error: summaryError } = useQuery<SummaryResult[]>({    queryKey: ["/api/summary", blockNo, partNo, thickness],
    enabled: blockNo.trim().length > 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (blockNo.trim()) params.append('blockNo', blockNo.trim());
      if (partNo.trim()) params.append('partNo', partNo.trim());
      if (thickness.trim()) params.append('thickness', thickness.trim());

      const response = await fetch(`/api/summary?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    }
  });

  const { data: mastersheetResults, isLoading: isMastersheetLoading, error: mastersheetError } = useQuery<SearchResult[]>({
    queryKey: ["/api/mastersheet", blockNo, partNo],
    enabled: blockNo.trim().length > 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (blockNo.trim()) params.append('blockNo', blockNo.trim());
      if (partNo.trim()) params.append('partNo', partNo.trim());

      const response = await fetch(`/api/mastersheet?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    }
  });

  const { data: cpStockResults, isLoading: isCPStockLoading, error: cpStockError } = useQuery<CPStockResult[]>({    queryKey: ["/api/cpstock", blockNo, partNo, thickness],
    enabled: blockNo.trim().length > 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (blockNo.trim()) params.append('blockNo', blockNo.trim());
      if (partNo.trim()) params.append('partNo', partNo.trim());
      if (thickness.trim()) params.append('thickness', thickness.trim());

      const response = await fetch(`/api/cpstock?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    }
  });

  const { data: summary2Results, isLoading: isSummary2Loading, error: summary2Error } = useQuery<Summary2Result[]>({
  queryKey: ["/api/summary2", blockNo, partNo, thickness],
  enabled: blockNo.trim().length > 0,
  queryFn: async () => {
    const params = new URLSearchParams();
    if (blockNo.trim()) params.append('blockNo', blockNo.trim());
    if (partNo.trim()) params.append('partNo', partNo.trim());
    if (thickness.trim()) params.append('thickness', thickness.trim());

    const response = await fetch(`/api/summary2?${params}`);
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }
    return response.json();
  }
});

const { data: gpStockResults, isLoading: isGPStockLoading, error: gpStockError } = useQuery<GPStockResult[]>({    queryKey: ["/api/gpstock", blockNo, partNo, thickness],
    enabled: blockNo.trim().length > 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (blockNo.trim()) params.append('blockNo', blockNo.trim());
      if (partNo.trim()) params.append('partNo', partNo.trim());
      if (thickness.trim()) params.append('thickness', thickness.trim());

      const response = await fetch(`/api/gpstock?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    }
  });

  const handleClear = () => {
    setBlockNo("");
    setPartNo("");
    setThickness("");
  };

  const mastersheetColumnOrder = [
    "blockNo", "partNo", "facStoneColor", "subColor", "mnL", "mnH", "mnW", "mnCbm",
    "fnL", "fnH", "fnW", "fnCbm", "location", "type", "remarks2", "rcvdDt", "markerNo",
    "sp", "mgL", "mgH", "mgW", "mgCbm", "quality", "shift", "mc", "date", "slabL",
    "slabH", "t1_6", "t1_8", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t10",
    "t12", "t15", "t20", "t25", "width", "sliceNos", "leftOverWidth", "wastePctFn",
    "wastePctFn5", "wastePctMn", "total", "oprSft", "sln", "stDate", "r"
  ];

  const summaryColumnOrder = [
    "blockNo", "partNo", "thkCm", "slicing", "export", "rework", "edgeCut", "pkl",
    "ctrStock", "stock", "d", "dS", "eC", "s", "sold", "add", "dSlash", "edgeCutting"
  ];

  const gpStockColumnOrder = [
    "slicingDate", "blockNo", "partNo", "colorName", "length", "height", "thickness",
    "nos", "dispatched", "eCut", "balance", "stockNos", "m2", "remarks", "location",
    "mainLocation", "colourName", "subColour", "sp", "remark2"
  ];

  const cpStockColumnOrder = [
    "type", "slicedOn", "colourName", "blockNo", "partNo", "length", "height",
    "thickness", "nos", "dispatched", "edgeCutting", "balance", "m2", "sidePc",
    "location", "remarks", "facColour", "subColour", "check", "null", "d", "act", "r"
  ];
  
  const columnDisplayNames: Record<string, string> = {
    blockNo: "BLOCK #",
    partNo: "PART",
    facStoneColor: "FAC STONE COLOUR #",
    subColor: "SUB COLOUR",
    mnL: "MN L",
    mnH: "MN H",
    mnW: "MN W",
    mnCbm: "MN CBM",
    fnL: "FN L",
    fnH: "FN H",
    fnW: "FN W",
    fnCbm: "FN CBM",
    location: "LOCATION",
    type: "TYPE",
    remarks2: "REMARKS 2",
    rcvdDt: "RCVD DT",
    markerNo: "MARKER #",
    sp: "SP",
    mgL: "MG L",
    mgH: "MG H",
    mgW: "MG W",
    mgCbm: "MG CBM",
    quality: "QUALITY",
    shift: "Shift",
    mc: "M/C",
    date: "DATE",
    slabL: "SLAB L",
    slabH: "SLAB H",
    t1_6: "1.6",
    t1_8: "1.8",
    t2: "2",
    t3: "3",
    t4: "4",
    t5: "5",
    t6: "6",
    t7: "7",
    t8: "8",
    t10: "10",
    t12: "12",
    t15: "15",
    t20: "20",
    t25: "25",
    width: "WIDTH",
    sliceNos: "SLICE (nos x thk)",
    leftOverWidth: "left over width in cm",
    wastePctFn: "waste% ON FN",
    wastePctFn5: "waste % ON FN-5",
    wastePctMn: "waste % ON MN",
    total: "Total",
    oprSft: "OPR SFT",
    sln: "SLN",
    stDate: "ST Date",
    r: "R"
  };
  
  // Add display names for Summary columns
  const summaryDisplayNames: Record<string, string> = {
    blockNo: "Block No",
    partNo: "Part",
    thkCm: "Thk cm",
    slicing: "1 Slicing",
    export: "2 Export",
    rework: "3 Rework",
    edgeCut: "4 Edge Cut",
    pkl: "5 Pkl",
    ctrStock: "6 Ctr Stock",
    stock: "6 Stock",
    d: "7 D",
    dS: "7 D/S",
    eC: "7 E/C",
    s: "7 S",
    sold: "9 Sold",
    add: "Add",
    dSlash: "D/S",
    edgeCutting: "Edge Cutting"
  };

  // Add display names for CPStock columns
  const cpStockDisplayNames: Record<string, string> = {
    type: "Type",
    slicedOn: "Sliced On",
    colourName: "Colour Name",
    blockNo: "Block No",
    partNo: "Part No",
    length: "Length",
    height: "Height",
    thickness: "Thickness",
    nos: "Nos",
    dispatched: "Dispatched",
    edgeCutting: "Edge Cutting",
    balance: "Balance",
    m2: "M2",
    sidePc: "Side Pc",
    location: "Location",
    remarks: "Remarks",
    facColour: "Fac Colour",
    subColour: "Sub Colour",
    check: "Check",
    null: "Null",
    d: "D",
    act: "Act",
    r: "R"
  };

  // Add display names for GPStock columns
  const gpStockDisplayNames: Record<string, string> = {
    slicingDate: "Slicing Date",
    blockNo: "Block No",
    partNo: "Part No",
    colorName: "Color Name",
    length: "Length",
    height: "Height",
    thickness: "Thickness",
    nos: "Nos",
    dispatched: "Dispatched",
    eCut: "E Cut",
    balance: "Balance",
    stockNos: "Stock Nos",
    m2: "M2",
    remarks: "Remarks",
    location: "Location",
    mainLocation: "Main Location",
    colourName: "Colour Name",
    subColour: "Sub Colour",
    sp: "SP",
    remark2: "Remark 2"
  };

  // Filter columns with data for each card
  const mastersheetColumnsWithData = new Set<string>();
  if (mastersheetResults?.length) {
    mastersheetResults.forEach(result => {
      Object.entries(result).forEach(([key, value]) => {
        if (key !== 'color1' && key !== 'color2' && value && value.trim() !== '') {
          mastersheetColumnsWithData.add(key);
        }
      });
    });
  }

  const summaryColumnsWithData = new Set<string>();
  if (summaryResults?.length) {
    summaryResults.forEach(result => {
      Object.entries(result).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          summaryColumnsWithData.add(key);
        }
      });
    });
  }

  const cpStockColumnsWithData = new Set<string>();
  if (cpStockResults?.length) {
    cpStockResults.forEach(result => {
      Object.entries(result).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cpStockColumnsWithData.add(key);
        }
      });
    });
  }

  const gpStockColumnsWithData = new Set<string>();
const summary2ColumnsWithData = new Set<string>();
if (gpStockResults?.length) {
  gpStockResults.forEach(result => {
    Object.entries(result).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        gpStockColumnsWithData.add(key);
      }
    });
  });
}
if (summary2Results?.length) {
  summary2Results.forEach(result => {
    Object.entries(result).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        summary2ColumnsWithData.add(key);
      }
    });
  });
}

  const visibleMastersheetColumns = mastersheetColumnOrder.filter(column => mastersheetColumnsWithData.has(column));
  const visibleSummaryColumns = summaryColumnOrder.filter(column => summaryColumnsWithData.has(column));
  const visibleCPStockColumns = cpStockColumnOrder.filter(column => cpStockColumnsWithData.has(column));
  const visibleGPStockColumns = gpStockColumnOrder.filter(column => gpStockColumnsWithData.has(column));
const summary2ColumnOrder = [
  "blockNo", "part", "thkCm", "slicing1", "export2", "rework3", "edgeCut4",
  "pkl5", "ctrStock6", "stock6", "d7", "ds7", "ec7", "s7", "sold9", "add",
  "ds", "edgeCutting"
];
const summary2DisplayNames: Record<string, string> = {
  blockNo: "Block No",
  part: "Part",
  thkCm: "Thk cm",
  slicing1: "1 Slicing",
  export2: "2 Export",
  rework3: "3 Rework",
  edgeCut4: "4 Edge Cut",
  pkl5: "5 Pkl",
  ctrStock6: "6 Ctr Stock",
  stock6: "6 Stock",
  d7: "7 D",
  ds7: "7 D/S",
  ec7: "7 E/C",
  s7: "7 S",
  sold9: "9 Sold",
  add: "Add",
  ds: "D/S",
  edgeCutting: "Edge Cutting"
};
const visibleSummary2Columns = summary2ColumnOrder.filter(column => summary2ColumnsWithData.has(column));

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <MdDashboard className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 overflow-x-auto">
                  <div className="min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Block No (req)"
                          value={blockNo}
                          onChange={(e) => setBlockNo(e.target.value)}
                          className="h-9 text-sm pr-8 border-purple-200 focus:border-purple-400 hover:border-purple-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => startListening('blockNo')}
                          disabled={isListening}
                        >
                          {isListening && activeInput === 'blockNo' ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {blockNo.trim().length === 0 && (
                        <p className="text-xs text-destructive">Required</p>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Part No"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="h-9 text-sm pr-8 border-purple-200 focus:border-purple-400 hover:border-purple-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('partNo')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'partNo' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="h-9 text-sm pr-8 border-purple-200 focus:border-purple-400 hover:border-purple-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('thickness')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'thickness' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-9 bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {summaryError ? (
                  <div className="text-center text-destructive">
                    <p>Failed to fetch summary results. Please try again later.</p>
                    <p className="text-sm mt-1">Error: {summaryError.message}</p>
                  </div>
                ) : isSummaryLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : summaryResults?.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-700 hover:bg-purple-800">
                          {visibleSummaryColumns.map(column => (
                            <TableHead key={column} className="font-bold text-white">
                              {summaryDisplayNames[column] || column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryResults.map((result, i) => (
                          <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-purple-50" : "bg-purple-50 hover:bg-purple-100"}`}>
                            {visibleSummaryColumns.map(column => (
                              <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : blockNo.trim().length > 0 ? (
                  <p className="text-center text-muted-foreground">No results found</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a block number to search</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary 2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 overflow-x-auto">
                  <div className="min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Block No (req)"
                          value={blockNo}
                          onChange={(e) => setBlockNo(e.target.value)}
                          className="h-9 text-sm pr-8 border-cyan-200 focus:border-cyan-400 hover:border-cyan-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => startListening('blockNo')}
                          disabled={isListening}
                        >
                          {isListening && activeInput === 'blockNo' ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-cyan-400 hover:text-cyan-600" />
                          )}
                        </Button>
                      </div>
                      {blockNo.trim().length === 0 && (
                        <p className="text-xs text-destructive">Required</p>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Part No"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="h-9 text-sm pr-8 border-cyan-200 focus:border-cyan-400 hover:border-cyan-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('partNo')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'partNo' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-cyan-400 hover:text-cyan-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="h-9 text-sm pr-8 border-cyan-200 focus:border-cyan-400 hover:border-cyan-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('thickness')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'thickness' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-cyan-400 hover:text-cyan-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-9 bg-cyan-700 hover:bg-cyan-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {summary2Error ? (
                  <div className="text-center text-destructive">
                    <p>Failed to fetch search results. Please try again later.</p>
                    <p className="text-sm mt-1">Error: {summary2Error.message}</p>
                  </div>
                ) : isSummary2Loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : summary2Results?.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cyan-700 hover:bg-cyan-800">
                          {visibleSummary2Columns.map(column => (
                            <TableHead key={column} className="font-bold text-white">
                              {summary2DisplayNames[column] || column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summary2Results.map((result, i) => (
                          <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-cyan-50" : "bg-cyan-50 hover:bg-cyan-100"}`}>
                            {visibleSummary2Columns.map(column => (
                              <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : blockNo.trim().length > 0 ? (
                  <p className="text-center text-muted-foreground">No results found</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a block number to search</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recent activities will be shown here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mastersheet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 overflow-x-auto">
                  <div className="min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Block No (req)"
                          value={blockNo}
                          onChange={(e) => setBlockNo(e.target.value)}
                          className="h-9 text-sm pr-8 border-orange-200 focus:border-orange-400 hover:border-orange-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => startListening('blockNo')}
                          disabled={isListening}
                        >
                          {isListening && activeInput === 'blockNo' ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-orange-400 hover:text-orange-600" />
                          )}
                        </Button>
                      </div>
                      {blockNo.trim().length === 0 && (
                        <p className="text-xs text-destructive">Required</p>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Part No"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="h-9 text-sm pr-8 border-orange-200 focus:border-orange-400 hover:border-orange-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('partNo')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'partNo' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-orange-400 hover:text-orange-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="h-9 text-sm pr-8 border-orange-200 focus:border-orange-400 hover:border-orange-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('thickness')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'thickness' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-orange-400 hover:text-orange-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-9 bg-orange-700 hover:bg-orange-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {mastersheetError ? (
                  <div className="text-center text-destructive">
                    <p>Failed to fetch search results. Please try again later.</p>
                    <p className="text-sm mt-1">Error: {mastersheetError.message}</p>
                  </div>
                ) : isMastersheetLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : mastersheetResults?.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-orange-700 hover:bg-orange-800">
                          {visibleMastersheetColumns.map(column => (
                            <TableHead key={column} className="font-bold text-white">
                              {columnDisplayNames[column] || column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mastersheetResults.map((result, i) => (
                          <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-orange-50" : "bg-orange-50 hover:bg-orange-100"}`}>
                            {visibleMastersheetColumns.map(column => (
                              <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : blockNo.trim().length > 0 ? (
                  <p className="text-center text-muted-foreground">No results found</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a block number to search</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gangsaw Physical Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 overflow-x-auto">
                  <div className="min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Block No (req)"
                          value={blockNo}
                          onChange={(e) => setBlockNo(e.target.value)}
                          className="h-9 text-sm pr-8 border-green-200 focus:border-green-400 hover:border-green-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => startListening('blockNo')}
                          disabled={isListening}
                        >
                          {isListening && activeInput === 'blockNo' ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-400 hover:text-green-600" />
                          )}
                        </Button>
                      </div>
                      {blockNo.trim().length === 0 && (
                        <p className="text-xs text-destructive">Required</p>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Part No"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="h-9 text-sm pr-8 border-green-200 focus:border-green-400 hover:border-green-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('partNo')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'partNo' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-400 hover:text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="h-9 text-sm pr-8 border-green-200 focus:border-green-400 hover:border-green-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('thickness')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'thickness' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-400 hover:text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-9 bg-green-700 hover:bg-green-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {gpStockError ? (
                  <div className="text-center text-destructive">
                    <p>Failed to fetch search results. Please try again later.</p>
                    <p className="text-sm mt-1">Error: {gpStockError.message}</p>
                  </div>
                ) : isGPStockLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : gpStockResults?.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-700 hover:bg-green-800">
                          {visibleGPStockColumns.map(column => (
                            <TableHead key={column} className="font-bold text-white">
                              {gpStockDisplayNames[column] || column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gpStockResults.map((result, i) => (
                          <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-green-50" : "bg-green-50 hover:bg-green-100"}`}>
                            {visibleGPStockColumns.map(column => (
                              <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : blockNo.trim().length > 0 ? (
                  <p className="text-center text-muted-foreground">No results found</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a block number to search</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cutter Physical Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 overflow-x-auto">
                  <div className="min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Block No (req)"
                          value={blockNo}
                          onChange={(e) => setBlockNo(e.target.value)}
                          className="h-9 text-sm pr-8 border-blue-200 focus:border-blue-400 hover:border-blue-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => startListening('blockNo')}
                          disabled={isListening}
                        >
                          {isListening && activeInput === 'blockNo' ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-blue-400 hover:text-blue-600" />
                          )}
                        </Button>
                      </div>
                      {blockNo.trim().length === 0 && (
                        <p className="text-xs text-destructive">Required</p>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Part No"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="h-9 text-sm pr-8 border-blue-200 focus:border-blue-400 hover:border-blue-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('partNo')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'partNo' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-blue-400 hover:text-blue-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="h-9 text-sm pr-8 border-blue-200 focus:border-blue-400 hover:border-blue-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => startListening('thickness')}
                        disabled={isListening}
                      >
                        {isListening && activeInput === 'thickness' ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-blue-400 hover:text-blue-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-9 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {cpStockError ? (
                  <div className="text-center text-destructive">
                    <p>Failed to fetch search results. Please try again later.</p>
                    <p className="text-sm mt-1">Error: {cpStockError.message}</p>
                  </div>
                ) : isCPStockLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : cpStockResults?.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-700 hover:bg-blue-800">
                          {visibleCPStockColumns.map(column => (
                            <TableHead key={column} className="font-bold text-white">
                              {cpStockDisplayNames[column] || column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cpStockResults.map((result, i) => (
                          <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-blue-50 hover:bg-blue-100"}`}>
                            {visibleCPStockColumns.map(column => (
                              <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : blockNo.trim().length > 0 ? (
                  <p className="text-center text-muted-foreground">No results found</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a block number to search</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
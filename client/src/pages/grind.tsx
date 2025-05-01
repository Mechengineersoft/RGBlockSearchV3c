import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { SearchResult, GrindResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Search, Loader2, Mic, MicOff, ArrowLeft } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import "./page-themes.css";
export default function GrindPage() {
  const { logoutMutation } = useAuth();
  const [location] = useLocation();
  const [blockNo, setBlockNo] = useState("");
  const [partNo, setPartNo] = useState("");
  const [thickness, setThickness] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeInput, setActiveInput] = useState("");

  // Update state when URL parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const urlBlockNo = params.get('blockNo');
    const urlPartNo = params.get('partNo');
    const urlThickness = params.get('thickness');
    
    if (urlBlockNo) setBlockNo(decodeURIComponent(urlBlockNo));
    if (urlPartNo) setPartNo(decodeURIComponent(urlPartNo));
    if (urlThickness) setThickness(decodeURIComponent(urlThickness));
  }, [location]);

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
      
      // Process special number sequences (e.g., "triple four" -> "444")
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

      // Handle repeated numbers (e.g., "triple four" -> "444")
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

      // Remove spaces between spelled-out characters (e.g., "a b a" -> "aba")
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

  const [, setLocation] = useLocation();

  const { data: results, isLoading, error } = useQuery<GrindResult[]>({
    queryKey: ["/api/grind", blockNo, partNo, thickness],
    enabled: blockNo.trim().length > 0,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (blockNo.trim()) params.append('blockNo', blockNo.trim());
      if (partNo.trim()) params.append('partNo', partNo.trim());
      if (thickness.trim()) params.append('thickness', thickness.trim());

      const response = await fetch(`/api/grind?${params}`);
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

  // No header colors needed for grind page

  // Define the fixed column order
  const columnOrder = [
    "blockNo", "partNo", "thickness", "finish", "nos", "re", "lCm", 
    "hCm", "sft", "date", "shift", "machine", "remark", "slabNo"
  ];
  
  // Map column keys to display names
  const columnDisplayNames: Record<string, string> = {
    blockNo: "Block No",
    partNo: "Part",
    thickness: "Thk cm",
    finish: "Finish",
    nos: "Nos",
    re: "Re",
    lCm: "L cm",
    hCm: "H cm",
    sft: "Sft",
    date: "Date",
    shift: "Shift",
    machine: "Machine",
    remark: "Remark",
    slabNo: "Slab No"
  };
  
  // Get all columns that have data in any row
  const columnsWithData = new Set<string>();
  if (results?.length) {
    results.forEach(result => {
      Object.entries(result).forEach(([key, value]) => {
        if (key !== 'color1' && key !== 'color2' && value && value.trim() !== '') {
          columnsWithData.add(key);
        }
      });
    });
  }
  
  // Filter the column order to only include columns with data
  const visibleColumns = columnOrder.filter(column => columnsWithData.has(column));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-0 h-12 flex items-center justify-between">
          <h1 className="text-xl font-bold pl-2">Grind Search</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              className="mr-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="mr-2"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-0.5 py-4 flex-1">
        <Card className="shadow-md rounded-lg mx-0 transition-all duration-300 hover:shadow-xl transform translate-y-0 border border-sky-100/50 bg-gradient-to-b from-white to-sky-50/30 hover:bg-gradient-to-b hover:from-white hover:to-sky-100/50 grind-theme">
          <CardContent className="p-1">
            <div className="flex flex-row gap-2 mb-4 overflow-x-auto">
              <div className="min-w-0 flex-1">
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      placeholder="Block No (req)"
                      value={blockNo}
                      onChange={(e) => setBlockNo(e.target.value)}
                      className="h-9 text-sm pr-8 border-sky-200 focus:border-sky-400 hover:border-sky-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-sky-50"
                      onClick={() => startListening('blockNo')}
                      disabled={isListening}
                    >
                      {isListening && activeInput === 'blockNo' ? (
                        <MicOff className="h-4 w-4 text-sky-500" />
                      ) : (
                        <Mic className="h-4 w-4 text-sky-400 hover:text-sky-600" />
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
                    className="h-9 text-sm pr-8 border-sky-200 focus:border-sky-400 hover:border-sky-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-sky-50"
                    onClick={() => startListening('partNo')}
                    disabled={isListening}
                  >
                    {isListening && activeInput === 'partNo' ? (
                      <MicOff className="h-4 w-4 text-sky-500" />
                    ) : (
                      <Mic className="h-4 w-4 text-sky-400 hover:text-sky-600" />
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
                    className="h-9 text-sm pr-8 border-sky-200 focus:border-sky-400 hover:border-sky-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-sky-50"
                    onClick={() => startListening('thickness')}
                    disabled={isListening}
                  >
                    {isListening && activeInput === 'thickness' ? (
                      <MicOff className="h-4 w-4 text-sky-500" />
                    ) : (
                      <Mic className="h-4 w-4 text-sky-400 hover:text-sky-600" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/')} 
                className="h-9 flex gap-2 items-center bg-sky-100 hover:bg-sky-200 text-sky-800 hover:text-sky-900 border-sky-200 hover:border-sky-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClear();
                }} 
                className="h-9 bg-sky-600 hover:bg-sky-700 text-white"
              >
                Clear
              </Button>
            </div>

            {error && (
              <div className="text-center text-destructive my-4">
                <p>Failed to fetch search results. Please try again later.</p>
                <p className="text-sm mt-1">Error: {error.message}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : results?.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-sky-700 hover:bg-sky-800">
                    {visibleColumns.map(column => (
                      <TableHead key={column} className="font-bold text-white">
                        {columnDisplayNames[column] || column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, i) => (
                    <TableRow key={i} className={`${i % 2 === 0 ? "bg-white hover:bg-sky-50" : "bg-sky-50 hover:bg-sky-100"}`}>
                      {visibleColumns.map(column => (
                        <TableCell key={column}>{result[column as keyof typeof result]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : blockNo.trim().length > 0 ? (
              <p className="text-center text-muted-foreground my-8">No results found</p>
            ) : (
              <p className="text-center text-muted-foreground my-8">Enter a block number to search</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
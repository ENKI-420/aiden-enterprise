"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Server, Code, AlertTriangle, CheckCircle, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function LLMDocumentation() {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopeeritud",
      description: "Tekst on lõikelauale kopeeritud",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <BookOpen className="h-6 w-6 text-cyan-500" />
        <h2 className="text-2xl font-bold text-white">LLM Integreerimise dokumentatsioon</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Ülevaade
          </TabsTrigger>
          <TabsTrigger value="ollama" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Ollama
          </TabsTrigger>
          <TabsTrigger value="llamacpp" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            LlamaCPP
          </TabsTrigger>
          <TabsTrigger value="textgen" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Text Generation WebUI
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Kohandatud
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Toetatud LLM tüübid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-600">Ollama</Badge>
                    <span className="text-slate-300">Lihtne kohalike mudelite käitamine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-600">LlamaCPP</Badge>
                    <span className="text-slate-300">C++ põhine kiire inference</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-600">Text Generation WebUI</Badge>
                    <span className="text-slate-300">Gradio põhine veebiliides</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-600">Kohandatud</Badge>
                    <span className="text-slate-300">Oma API endpoint</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Kiire alustamine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-medium">Installi LLM tarkvara</div>
                    <div className="text-slate-400 text-sm">Vali sobiv LLM tüüp ja installi see oma arvutisse</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-medium">Käivita LLM server</div>
                    <div className="text-slate-400 text-sm">Käivita LLM server vaikimisi pordil</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-medium">Lisa LLM administraatori paneelil</div>
                    <div className="text-slate-400 text-sm">Kasuta "Lisa LLM" nuppu uue ühenduse loomiseks</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <div className="text-white font-medium">Testi ühendust</div>
                    <div className="text-slate-400 text-sm">Kasuta test funktsiooni ühenduse kontrollimiseks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-blue-900/20 border-blue-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              <strong>Märkus:</strong> Veendu, et LLM server töötab enne ühenduse lisamist. Süsteem kontrollib
              automaatselt ühenduse staatust.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="ollama" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-500" />
                Ollama seadistamine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">1. Ollama installimine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                    <code className="text-green-400">curl -fsSL https://ollama.ai/install.sh | sh</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => copyToClipboard("curl -fsSL https://ollama.ai/install.sh | sh")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">2. Mudeli allalaadimine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                    <code className="text-green-400">ollama pull llama2</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => copyToClipboard("ollama pull llama2")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">3. Serveri käivitamine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                    <code className="text-green-400">ollama serve</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => copyToClipboard("ollama serve")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">4. Konfigureerimine administraatori paneelil</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      <strong>Tüüp:</strong> Ollama
                    </div>
                    <div>
                      <strong>Endpoint:</strong> http://localhost:11434
                    </div>
                    <div>
                      <strong>API võti:</strong> Pole vaja
                    </div>
                    <div>
                      <strong>Mudelid:</strong> llama2, codellama, mistral (vastavalt allalaaditud mudelitele)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Populaarsed Ollama mudelid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-slate-300 font-medium">Üldotstarbelised</div>
                  <div className="space-y-1 text-sm text-slate-400">
                    <div>• llama2 (7B, 13B, 70B)</div>
                    <div>• llama2-uncensored</div>
                    <div>• mistral (7B)</div>
                    <div>• mixtral (8x7B)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-300 font-medium">Koodipõhised</div>
                  <div className="space-y-1 text-sm text-slate-400">
                    <div>• codellama (7B, 13B, 34B)</div>
                    <div>• codeup</div>
                    <div>• starcoder</div>
                    <div>• deepseek-coder</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llamacpp" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="h-5 w-5 mr-2 text-green-500" />
                LlamaCPP seadistamine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">1. LlamaCPP kompileerimine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-green-500 space-y-2">
                    <div>
                      <code className="text-green-400">git clone https://github.com/ggerganov/llama.cpp</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-6 w-6"
                        onClick={() => copyToClipboard("git clone https://github.com/ggerganov/llama.cpp")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <code className="text-green-400">cd llama.cpp && make</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-6 w-6"
                        onClick={() => copyToClipboard("cd llama.cpp && make")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">2. Mudeli allalaadimine (GGUF formaat)</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-green-500">
                    <div className="text-slate-300 text-sm mb-2">Näide Llama2 mudeli jaoks:</div>
                    <code className="text-green-400">
                      wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">3. Serveri käivitamine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-green-500">
                    <code className="text-green-400">
                      ./server -m models/llama-2-7b-chat.Q4_K_M.gguf -c 2048 --host 0.0.0.0 --port 8080
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() =>
                        copyToClipboard(
                          "./server -m models/llama-2-7b-chat.Q4_K_M.gguf -c 2048 --host 0.0.0.0 --port 8080",
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">4. Konfigureerimine administraatori paneelil</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      <strong>Tüüp:</strong> LlamaCPP
                    </div>
                    <div>
                      <strong>Endpoint:</strong> http://localhost:8080
                    </div>
                    <div>
                      <strong>API võti:</strong> Pole vaja
                    </div>
                    <div>
                      <strong>Mudelid:</strong> default (või mudeli nimi)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-green-900/20 border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-200">
              <strong>Soovitus:</strong> LlamaCPP on kiire ja ressursisäästlik. Kasuta Q4_K_M kvantiseeritud mudeleid
              parima jõudluse ja kvaliteedi tasakaalu jaoks.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="textgen" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="h-5 w-5 mr-2 text-purple-500" />
                Text Generation WebUI seadistamine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">1. Repositooriumi kloneerimine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-purple-500">
                    <code className="text-green-400">git clone https://github.com/oobabooga/text-generation-webui</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => copyToClipboard("git clone https://github.com/oobabooga/text-generation-webui")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">2. Installimine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-purple-500 space-y-2">
                    <div>
                      <code className="text-green-400">cd text-generation-webui</code>
                    </div>
                    <div>
                      <code className="text-green-400">pip install -r requirements.txt</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">3. API režiimis käivitamine</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-purple-500">
                    <code className="text-green-400">python server.py --api --listen</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={() => copyToClipboard("python server.py --api --listen")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">4. Konfigureerimine administraatori paneelil</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      <strong>Tüüp:</strong> Text Generation WebUI
                    </div>
                    <div>
                      <strong>Endpoint:</strong> http://localhost:5000
                    </div>
                    <div>
                      <strong>API võti:</strong> Pole vaja
                    </div>
                    <div>
                      <strong>Mudelid:</strong> Laaditud mudelite nimed
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">API endpointid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-green-400">/api/v1/models</code>
                  <span className="text-slate-400">- Saadaolevad mudelid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-green-400">/api/v1/generate</code>
                  <span className="text-slate-400">- Teksti genereerimine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-green-400">/api/v1/chat/completions</code>
                  <span className="text-slate-400">- Chat vormingus</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-orange-500" />
                Kohandatud API integreerimine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">API nõuded</h4>
                  <div className="text-sm text-slate-300 space-y-2">
                    <div>Sinu kohandatud API peab toetama järgmisi endpointe:</div>
                    <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                      <div>
                        <strong>POST /generate</strong> - Teksti genereerimine
                      </div>
                      <div>
                        <strong>GET /health</strong> - Serveri staatus (valikuline)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Nõutav request formaat</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <pre className="text-green-400 text-sm">
                      {`{
  "prompt": "Kasutaja prompt",
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 0.9
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Oodatav response formaat</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <pre className="text-green-400 text-sm">
                      {`{
  "text": "Genereeritud tekst",
  "tokens": 150,
  "model": "mudeli_nimi"
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Näidis Python Flask server</h4>
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <pre className="text-green-400 text-sm">
                      {`from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt')
    
    # Sinu LLM loogika siin
    response_text = your_llm_function(prompt)
    
    return jsonify({
        'text': response_text,
        'tokens': len(response_text.split()),
        'model': 'your_model_name'
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-orange-900/20 border-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-orange-200">
              <strong>Märkus:</strong> Kohandatud API puhul veendu, et server toetab CORS päiseid ja on kättesaadav
              määratud pordil.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Additional Resources */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lisaressursid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Ametlikud dokumentatsioonid</h4>
              <div className="space-y-1 text-sm">
                <a
                  href="https://ollama.ai/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ollama dokumentatsioon
                </a>
                <a
                  href="https://github.com/ggerganov/llama.cpp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  LlamaCPP GitHub
                </a>
                <a
                  href="https://github.com/oobabooga/text-generation-webui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Text Generation WebUI
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Mudeli ressursid</h4>
              <div className="space-y-1 text-sm">
                <a
                  href="https://huggingface.co/models"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Hugging Face mudelid
                </a>
                <a
                  href="https://ollama.ai/library"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ollama mudeli raamatukogu
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

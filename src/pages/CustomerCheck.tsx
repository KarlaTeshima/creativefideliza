
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { buscarClientePorCodigo, Cliente } from '@/lib/supabaseClient';

const CustomerCheck = () => {
  const { toast } = useToast();
  const [codigoCartao, setCodigoCartao] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  
  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoCartao.trim()) {
      toast({
        title: "Código não informado",
        description: "Por favor, informe o código do seu cartão.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const clienteEncontrado = await buscarClientePorCodigo(codigoCartao);
      setCliente(clienteEncontrado);
      setConsultaRealizada(true);
      
      if (!clienteEncontrado) {
        toast({
          title: "Cartão não encontrado",
          description: "Nenhum cartão encontrado com este código.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao consultar pontos:", error);
      toast({
        title: "Erro ao consultar",
        description: "Ocorreu um erro ao consultar seus pontos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderPointsMessage = () => {
    if (!cliente) return null;
    
    const pontos = cliente.pontos;
    
    if (pontos < 9) {
      return `Você possui ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}. Acumule 10 pontos e seja premiado.`;
    } else if (pontos === 9) {
      return "Você possui 9 pontos. Acumule mais 1 e será premiado!";
    } else {
      return "Você acumulou 10 pontos e pode receber seu prêmio!";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="py-4 px-4 bg-white shadow">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-brand-dark">Consulta de Pontos</h1>
          <Button variant="outline" asChild size="sm">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </header>
      
      <main className="container max-w-md mx-auto py-12 px-4">
        <Card className="border-2 border-brand-accent/10 shadow-lg">
          <CardHeader className="bg-brand-accent/5">
            <CardTitle className="text-brand-accent">Consulte seus pontos</CardTitle>
            <CardDescription>
              Digite o código do seu cartão de fidelidade para consultar seus pontos
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleConsultar}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input 
                    id="codigo_cartao" 
                    value={codigoCartao}
                    onChange={(e) => setCodigoCartao(e.target.value)}
                    placeholder="Digite o código do seu cartão"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent/90" disabled={loading}>
                  {loading ? "Consultando..." : "Consultar Pontos"}
                </Button>
              </div>
            </form>
            
            {consultaRealizada && cliente && (
              <div className="mt-8 border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-medium mb-2">Resultado da consulta</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-accent/10 mb-4">
                      <span className="text-3xl font-bold text-brand-accent">{cliente.pontos}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {cliente.pontos === 1 ? "Ponto" : "Pontos"}
                    </h4>
                  </div>
                  
                  <div className={`p-4 rounded-md ${
                    cliente.pontos === 10 
                      ? "bg-green-50 border border-green-200" 
                      : cliente.pontos === 9 
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}>
                    <p className="text-center text-gray-800">
                      {renderPointsMessage()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {consultaRealizada && !cliente && (
              <div className="mt-8 border rounded-lg p-6 bg-white">
                <div className="text-center text-gray-500">
                  <p>Nenhum cartão encontrado com este código.</p>
                  <p className="mt-2">Verifique se digitou corretamente ou contate a administração.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-brand-dark text-white py-4 px-4 mt-auto">
        <div className="container max-w-7xl mx-auto">
          <p className="text-center text-sm">Sistema de Fidelidade © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerCheck;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { cadastrarCliente, adicionarPonto, buscarClientePorCodigo, Cliente } from '@/lib/supabaseClient';

const AdminPanel = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Cadastro state
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    telefone: '',
    codigo_cartao: ''
  });
  
  // Pontos state
  const [codigoCartao, setCodigoCartao] = useState('');
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [pointsAdded, setPointsAdded] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword('');
    }
  };
  
  const handleChangeCadastro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCadastro({
      ...formCadastro,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCadastrarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await cadastrarCliente(formCadastro);
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${formCadastro.nome} foi adicionado ao sistema.`
      });
      
      // Reset form
      setFormCadastro({
        nome: '',
        telefone: '',
        codigo_cartao: ''
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao processar o cadastro.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBuscarCliente = async () => {
    if (!codigoCartao.trim()) {
      toast({
        title: "Código não informado",
        description: "Por favor, informe o código do cartão.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setPointsAdded(false);
    
    try {
      const cliente = await buscarClientePorCodigo(codigoCartao);
      setClienteAtual(cliente);
      
      if (!cliente) {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum cliente encontrado com este código de cartão.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro ao buscar cliente",
        description: "Ocorreu um erro ao buscar o cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdicionarPonto = async () => {
    if (!clienteAtual) return;
    
    setLoading(true);
    
    try {
      const clienteAtualizado = await adicionarPonto(clienteAtual.codigo_cartao);
      
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
        setPointsAdded(true);
        toast({
          title: "Ponto adicionado com sucesso!",
          description: `${clienteAtualizado.nome} agora possui ${clienteAtualizado.pontos} pontos.`
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar ponto:", error);
      toast({
        title: "Erro ao adicionar ponto",
        description: "Ocorreu um erro ao adicionar o ponto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderPointsMessage = () => {
    if (!clienteAtual) return null;
    
    const pontos = clienteAtual.pontos;
    
    if (pontos < 9) {
      return `Este cliente possui ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}. Acumule 10 pontos e seja premiado.`;
    } else if (pontos === 9) {
      return "Este cliente possui 9 pontos. Acumule mais 1 e seja premiado.";
    } else {
      return "Este cliente acumulou 10 pontos e pode receber o prêmio!";
    }
  };
  
  // Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Administrativo</CardTitle>
            <CardDescription>
              Faça login para acessar o painel de administração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha de administrador"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Entrar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to="/">Voltar à página inicial</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-4 px-4 bg-white shadow">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-dark">Painel Administrativo</h1>
            <p className="text-sm text-gray-500">Sistema de Fidelidade</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Início</Link>
            </Button>
            <Button variant="destructive" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <Tabs defaultValue="cadastro">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="cadastro">Cadastro de Cliente</TabsTrigger>
            <TabsTrigger value="pontos">Gerenciamento de Pontos</TabsTrigger>
          </TabsList>
          
          {/* Cadastro Tab */}
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Cliente</CardTitle>
                <CardDescription>
                  Cadastre um novo cliente no sistema de fidelidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastrarCliente}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input 
                        id="nome" 
                        name="nome"
                        value={formCadastro.nome}
                        onChange={handleChangeCadastro}
                        placeholder="Nome completo do cliente"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        name="telefone"
                        value={formCadastro.telefone}
                        onChange={handleChangeCadastro}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="codigo_cartao">Código do Cartão NFC</Label>
                      <Input 
                        id="codigo_cartao" 
                        name="codigo_cartao"
                        value={formCadastro.codigo_cartao}
                        onChange={handleChangeCadastro}
                        placeholder="Código único do cartão"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="mt-4" disabled={loading}>
                      {loading ? "Cadastrando..." : "Cadastrar Cliente"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pontos Tab */}
          <TabsContent value="pontos">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Pontos</CardTitle>
                <CardDescription>
                  Adicione pontos aos clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="codigo_cartao_pontos">Código do Cartão NFC</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="codigo_cartao_pontos" 
                        value={codigoCartao}
                        onChange={(e) => setCodigoCartao(e.target.value)}
                        placeholder="Insira o código do cartão"
                      />
                      <Button 
                        onClick={handleBuscarCliente} 
                        disabled={loading || !codigoCartao.trim()}
                      >
                        Buscar
                      </Button>
                    </div>
                  </div>
                  
                  {clienteAtual && (
                    <div className="border rounded-md p-4 bg-white">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Cliente encontrado</h3>
                          <p className="text-sm text-gray-500">{clienteAtual.nome} - {clienteAtual.telefone}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Status dos pontos</h4>
                          <p className="text-lg mt-1">{renderPointsMessage()}</p>
                          
                          {/* Avisos baseados na pontuação */}
                          {clienteAtual.pontos === 9 && (
                            <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                              <AlertTitle className="text-amber-600">Atenção</AlertTitle>
                              <AlertDescription className="text-amber-700">
                                Este cliente está a 1 ponto do prêmio!
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {clienteAtual.pontos === 10 && (
                            <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                              <AlertTitle className="text-green-600">Prêmio!</AlertTitle>
                              <AlertDescription className="text-green-700">
                                Este cliente deve receber o prêmio agora.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        <Button 
                          onClick={handleAdicionarPonto} 
                          disabled={loading || clienteAtual.pontos >= 10}
                          className="w-full mt-4"
                        >
                          {clienteAtual.pontos >= 10 ? "Máximo de pontos atingido" : "Adicionar Ponto"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
